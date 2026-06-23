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

export const VAPID_KEY = "BILctmMY6XXmMyTU4kpOmtWaRkYqm181XeGhPZgRyShesGLHvL-F7pLZE66Yfhe_AmJ1jdb91MiBIHYDdhMpSAc";

export const requestPushNotificationPermission = async (userId: string): Promise<string | null> => {
  try {
    const messagingInstance = await initMessaging();
    if (!messagingInstance) {
      console.warn("FCM Messaging is not supported on this browser.");
      return null;
    }

    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn("Notifications are not supported in this browser.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn("Notification permission was not granted:", permission);
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const token = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
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
  // 1. Delete from Firestore first while still authenticated
  try {
    const tokenRef = doc(db, 'user_push_tokens', userId);
    await deleteDoc(tokenRef);
    console.log("FCM Token successfully removed from Firestore.");
  } catch (firestoreErr) {
    console.error("Error deleting FCM token document from Firestore:", firestoreErr);
  }

  // 2. Clear FCM token from client in the background (does not require Firebase Auth)
  initMessaging().then(async (messagingInstance) => {
    if (messagingInstance) {
      try {
        await deleteToken(messagingInstance);
        console.log("FCM Token deleted from client registration.");
      } catch (tokenErr) {
        console.warn("FCM deleteToken failed or token already deleted:", tokenErr);
      }
    }
  }).catch(err => {
    console.error("Error initializing messaging during background disable:", err);
  });
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
