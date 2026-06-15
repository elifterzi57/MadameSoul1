import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.GITHUB_TOKEN || "";
const owner = "elifterzi57";
const repo = "MadameSoul1";
const projectName = "MadameSoulKanban1";

// Helper to send GraphQL requests
async function graphql(query, variables = {}) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Authorization": `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "MadameSoulScript"
    },
    body: JSON.stringify({ query, variables })
  });
  return res.json();
}

// Parse jira_tickets.md to extract all tickets
function parseBacklog() {
  const filePath = path.resolve(__dirname, '..', 'docs', 'backlog', 'jira_tickets.md');
  if (!fs.existsSync(filePath)) {
    console.error(`Backlog file not found at: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const tickets = [];
  
  // Split the file by headers to get descriptions for each
  const sections = content.split(/^###\s+/m);
  
  // The first section is the header/summary of the file, skip it
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const lines = section.split('\n');
    const headerLine = lines[0];
    
    // Parse header: "[icon] [ID]: [Title] ([Component])"
    const headerRegex = /^([✅⏳])\s+(MS-\d+):\s*(.*?)(?:\s*\((.*?)\))?\s*$/;
    const headerMatch = headerLine.match(headerRegex);
    
    if (headerMatch) {
      const [_, statusIcon, id, title, component] = headerMatch;
      const isCompleted = statusIcon === '✅';
      
      // Extract properties from body
      let priority = 'Low';
      let status = isCompleted ? 'Done' : 'Todo';
      let assignee = '';
      let description = '';
      
      const descriptionLines = [];
      const criteriaLines = [];
      let inCriteria = false;
      
      for (let j = 1; j < lines.length; j++) {
        const line = lines[j];
        if (line.startsWith('* **Öncelik:**') || line.startsWith('* **Priority:**')) {
          priority = line.replace(/^\*\s+\*\*Öncelik:\*\*\s*/, '').trim();
        } else if (line.startsWith('* **Durum:**') || line.startsWith('* **Status:**')) {
          status = line.replace(/^\*\s+\*\*Durum:\*\*\s*/, '').trim();
        } else if (line.startsWith('* **Atanan:**') || line.startsWith('* **Assignee:**')) {
          assignee = line.replace(/^\*\s+\*\*Atanan:\*\*\s*/, '').trim();
        } else if (line.startsWith('* **Açıklama:**') || line.startsWith('* **Description:**')) {
          description = line.replace(/^\*\s+\*\*Açıklama:\*\*\s*/, '').trim();
        } else if (line.startsWith('* **Kabul Kriterleri:**') || line.startsWith('* **Acceptance Criteria:**')) {
          inCriteria = true;
        } else if (inCriteria && (line.startsWith('---') || line.startsWith('##'))) {
          inCriteria = false;
        } else {
          if (inCriteria) {
            criteriaLines.push(line);
          } else if (line.trim() !== '') {
            descriptionLines.push(line);
          }
        }
      }
      
      tickets.push({
        id,
        title: `[${id}] ${title}`,
        priority,
        status,
        assignee,
        body: `**ID:** ${id}\n**Component:** ${component || 'General'}\n**Priority:** ${priority}\n**Assignee:** ${assignee}\n\n### Description\n${description || descriptionLines.join('\n')}\n\n### Acceptance Criteria\n${criteriaLines.join('\n')}`,
        isCompleted
      });
    }
  }
  
  return tickets;
}

// Find ProjectV2 Node ID
async function findProjectId() {
  const query = `
    query {
      user(login: "${owner}") {
        projectsV2(first: 20) {
          nodes {
            id
            title
            number
          }
        }
      }
    }
  `;
  const result = await graphql(query);
  if (result.errors) {
    console.error("GraphQL Errors looking for project:", result.errors);
    return null;
  }
  const projects = result.data?.user?.projectsV2?.nodes || [];
  const project = projects.find(p => p && p.title === projectName);
  return project ? project.id : null;
}

// Create issue in repository
async function createRepoIssue(title, body) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: {
      "Authorization": `token ${token}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "MadameSoulScript"
    },
    body: JSON.stringify({ title, body })
  });
  const data = await res.json();
  if (data.errors || data.message) {
    console.error(`Failed to create repository issue "${title}":`, data.message || data.errors);
    return null;
  }
  return { nodeId: data.node_id, number: data.number };
}

// Close issue in repository
async function closeRepoIssue(issueNumber) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`, {
    method: "PATCH",
    headers: {
      "Authorization": `token ${token}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "MadameSoulScript"
    },
    body: JSON.stringify({ state: "closed", state_reason: "completed" })
  });
  return res.ok;
}

// Link issue to Project v2
async function addIssueToProject(projectId, contentId) {
  const query = `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: {
        projectId: $projectId,
        contentId: $contentId
      }) {
        item {
          id
        }
      }
    }
  `;
  const result = await graphql(query, { projectId, contentId });
  if (result.errors) {
    console.error(`Failed to link issue ${contentId} to project:`, result.errors);
    return null;
  }
  return result.data?.addProjectV2ItemById?.item?.id;
}

async function main() {
  const tickets = parseBacklog();
  console.log(`Parsed ${tickets.length} tickets from backlog.`);
  
  if (tickets.length === 0) {
    return;
  }

  const args = process.argv.slice(2);
  const runSync = args.includes('--sync');

  if (!runSync) {
    console.log("\nDry Run mode. Run with '--sync' to execute actual syncing to GitHub.");
    return;
  }

  console.log("\nStarting GitHub Sync...");
  
  console.log("Connecting to GitHub Project v2...");
  const projectId = await findProjectId();
  if (!projectId) {
    console.error(`Could not find Project v2 named "${projectName}" or lack permissions.`);
    return;
  }
  console.log(`Found Project ID: ${projectId}`);

  // Find the migration ticket (MS-209)
  const migrationTicket = tickets.find(t => t.id === 'MS-209');
  if (!migrationTicket) {
    console.error("Could not find MS-209 migration ticket in backlog file!");
    return;
  }

  // Filter out MS-209 so we sync it separately (first and then close at the end)
  const otherTickets = tickets.filter(t => t.id !== 'MS-209');

  console.log(`\nStep 1: Creating MS-209 Migration Ticket...`);
  const migrationIssue = await createRepoIssue(migrationTicket.title, migrationTicket.body);
  if (!migrationIssue) {
    console.error("Failed to create MS-209 issue. Aborting migration.");
    return;
  }
  console.log(`Created MS-209 Issue #${migrationIssue.number}`);
  await addIssueToProject(projectId, migrationIssue.nodeId);
  console.log(`Linked MS-209 to Project.`);

  console.log(`\nStep 2: Syncing all ${otherTickets.length} other backlog tickets...`);

  let count = 0;
  for (const ticket of otherTickets) {
    count++;
    console.log(`[${count}/${otherTickets.length}] Syncing ${ticket.id}: ${ticket.title.substring(0, 50)}...`);
    
    const issue = await createRepoIssue(ticket.title, ticket.body);
    if (issue) {
      await addIssueToProject(projectId, issue.nodeId);
      
      // If the ticket was already completed, let's close its issue in GitHub too
      if (ticket.isCompleted) {
        await closeRepoIssue(issue.number);
        console.log(`  Created, linked, and closed issue.`);
      } else {
        console.log(`  Created and linked issue (remains open).`);
      }
    }
    
    // 1.5 seconds throttle to avoid hitting secondary API abuse rates
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`\nStep 3: Closing MS-209 Migration Ticket...`);
  await closeRepoIssue(migrationIssue.number);
  console.log(`Closed MS-209 Issue #${migrationIssue.number}`);

  console.log("\nAll backlog tickets have been successfully synced to GitHub Kanban board!");
}

main().catch(console.error);
