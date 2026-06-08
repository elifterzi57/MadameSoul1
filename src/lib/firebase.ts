import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getMessaging, getToken, deleteToken, isSupported as isMessagingSupported } from 'firebase/messaging';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

let messaging: any = null;

export const initMessaging = async () => {
  if (typeof window !== 'undefined' && await isMessagingSupported()) {
    if (!messaging) {
      messaging = getMessaging(app);
    }
    return messaging;
  }
  return null;
};

export const VAPID_KEY = "BH_0eao9CxHECVLy_eeSZzoX3fTMI_9tnNmmSakEv_zq3VXJKCTsYhylt6r4vDR9PBRysynjZDAIBj0Q9ITE2FI";

export const requestPushNotificationPermission = async (userId: string): Promise<string | null> => {
  try {
    const messagingInstance = await initMessaging();
    if (!messagingInstance) {
      console.warn("FCM Messaging is not supported on this browser.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn("Notification permission was not granted:", permission);
      return null;
    }

    const token = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY
    });

    if (token) {
      const tokenRef = doc(db, 'user_push_tokens', userId);
      await setDoc(tokenRef, {
        token,
        userId,
        updatedAt: new Date().toISOString()
      });
      console.log("FCM Token successfully saved to Firestore:", token);
      return token;
    } else {
      console.warn("Failed to get FCM Token.");
      return null;
    }
  } catch (err) {
    console.error("Error requesting notification permission or token:", err);
    return null;
  }
};

export const disablePushNotifications = async (userId: string): Promise<void> => {
  try {
    const messagingInstance = await initMessaging();
    if (messagingInstance) {
      try {
        await deleteToken(messagingInstance);
      } catch (tokenErr) {
        console.warn("FCM deleteToken failed or token already deleted:", tokenErr);
      }
    }
  } catch (err) {
    console.error("Error initializing messaging during disable:", err);
  }

  try {
    const tokenRef = doc(db, 'user_push_tokens', userId);
    await deleteDoc(tokenRef);
    console.log("FCM Token successfully removed from Firestore.");
  } catch (firestoreErr) {
    console.error("Error deleting FCM token document from Firestore:", firestoreErr);
    throw firestoreErr;
  }
};


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
