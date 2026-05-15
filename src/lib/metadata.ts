import { UAParser } from 'ua-parser-js';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface UserMetadata {
  device: string;
  os: string;
  browser: string;
  ip: string;
  location: string;
  timestamp: Date;
}

export async function gatherUserMetadata(): Promise<UserMetadata> {
  const parser = new UAParser();
  const result = parser.getResult();

  let ip = 'Unknown';
  let location = 'Unknown';

  try {
    // Using a free, reliable IP and location API
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      ip = data.ip || 'Unknown';
      location = `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`.replace(/^, |, $/g, '').trim() || 'Unknown';
    }
  } catch (error) {
    console.error('Failed to fetch IP/Location:', error);
  }

  return {
    device: result.device.model || result.device.vendor || 'Desktop',
    os: `${result.os.name || ''} ${result.os.version || ''}`.trim() || 'Unknown',
    browser: `${result.browser.name || ''} ${result.browser.version || ''}`.trim() || 'Unknown',
    ip,
    location,
    timestamp: new Date()
  };
}

export async function logUserEvent(userId: string, eventType: string, eventData: any = {}) {
  // Event logging disabled as per user request
  return;
}
