// Import Firebase App and Messaging Compat libraries
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase App in the Service Worker
firebase.initializeApp({
  projectId: "madamesoul-926f6",
  appId: "1:829664664972:web:053b4c40375cd27b26caa9",
  apiKey: "AIzaSyCUVqxJDiJlWpQIJeIscXz7sGFCQOsZn84",
  authDomain: "madamesoul-926f6.firebaseapp.com",
  messagingSenderId: "829664664972",
  storageBucket: "madamesoul-926f6.firebasestorage.app"
});

// Retrieve FCM messaging instance
const messaging = firebase.messaging();

// Handle notification click event to open or focus the application window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data?.url || '/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
