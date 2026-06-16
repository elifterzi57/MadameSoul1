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

async function findProjectId() {
  const query = `
    query {
      user(login: "${owner}") {
        projectsV2(first: 20) {
          nodes {
            id
            title
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

function parseTicket(targetId) {
  const filePath = path.resolve(__dirname, '..', 'docs', 'backlog', 'jira_tickets.md');
  if (!fs.existsSync(filePath)) {
    console.error(`Backlog file not found at: ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const sections = content.split(/^###\s+/m);
  
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const lines = section.split('\n');
    const headerLine = lines[0];
    
    const headerRegex = /^([📋✅⏳])\s+(MS-\d+):\s*(.*?)(?:\s*\((.*?)\))?\s*$/u;
    const headerMatch = headerLine.match(headerRegex);
    
    if (headerMatch) {
      const [_, statusIcon, id, title, component] = headerMatch;
      if (id === targetId) {
        const isCompleted = statusIcon === '✅';
        
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
        
        return {
          id,
          title: `[${id}] ${title}`,
          priority,
          status,
          assignee,
          body: `**ID:** ${id}\n**Component:** ${component || 'General'}\n**Priority:** ${priority}\n**Assignee:** ${assignee}\n\n### Description\n${description || descriptionLines.join('\n')}\n\n### Acceptance Criteria\n${criteriaLines.join('\n')}`,
          isCompleted
        };
      }
    }
  }
  return null;
}

async function main() {
  const ticketId = process.argv[2];
  if (!ticketId) {
    console.error("Usage: node scripts/sync_single_ticket.js <TicketID> [--sync]");
    process.exit(1);
  }

  const runSync = process.argv.includes('--sync');
  const ticket = parseTicket(ticketId);

  if (!ticket) {
    console.error(`Ticket ${ticketId} not found in jira_tickets.md`);
    process.exit(1);
  }

  console.log(`Parsed ticket ${ticket.id}: ${ticket.title}`);
  
  if (!runSync) {
    console.log("\nDry Run mode. Run with '--sync' to execute actual syncing to GitHub.");
    return;
  }

  console.log("Connecting to GitHub Project v2...");
  const projectId = await findProjectId();
  if (!projectId) {
    console.error(`Could not find Project v2 named "${projectName}" or lack permissions.`);
    process.exit(1);
  }
  console.log(`Found Project ID: ${projectId}`);

  console.log(`Creating issue on GitHub...`);
  const issue = await createRepoIssue(ticket.title, ticket.body);
  if (!issue) {
    console.error("Failed to create issue on GitHub.");
    process.exit(1);
  }
  console.log(`Created Issue #${issue.number} (Node ID: ${issue.nodeId})`);

  console.log(`Linking to project ${projectName}...`);
  await addIssueToProject(projectId, issue.nodeId);
  console.log("Successfully linked to project.");

  if (ticket.isCompleted) {
    console.log("Closing issue since the ticket is marked completed...");
    await closeRepoIssue(issue.number);
    console.log("Successfully closed issue.");
  }
}

main().catch(console.error);
