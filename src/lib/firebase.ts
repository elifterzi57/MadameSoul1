import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Firestore offline persistence failed (multiple tabs open).");
    } else if (err.code === 'unimplemented') {
      console.warn("Firestore offline persistence not supported in this browser.");
    }
  });
}

// Initialize Analytics conditionally as it might not be supported in all environments (e.g. iframes)
export const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

import { logEvent } from 'firebase/analytics';
export const logAnalyticsEvent = async (eventName: string, eventParams?: Record<string, any>) => {
  try {
    const analytics = await initAnalytics();
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (err) {
    console.warn("Analytics event logging failed:", err);
  }
};
