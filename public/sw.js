// Import Firebase App and Messaging Compat libraries for FCM
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase App inside the Service Worker
firebase.initializeApp({
  projectId: "madamesoul-926f6",
  appId: "1:829664664972:web:053b4c40375cd27b26caa9",
  apiKey: "AIzaSyCUVqxJDiJlWpQIJeIscXz7sGFCQOsZn84",
  authDomain: "madamesoul-926f6.firebaseapp.com",
  messagingSenderId: "829664664972",
  storageBucket: "madamesoul-926f6.firebasestorage.app"
});

const messaging = firebase.messaging();

// Handle notification click event to focus or open window
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

// Caching configuration and caching handlers
const CACHE_NAME = 'madamesoul-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/icon.svg',
  '/manifest.json',
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event with Cache-First / Network-Fallback for assets and Card images
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests (e.g. POST to firebase, stripe, api calls)
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip browser extension requests (e.g. chrome-extension://)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Cache-First strategy for static assets and card images
  if (
    ASSETS.includes(url.pathname) ||
    url.pathname.startsWith('/cards/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch updated version in the background (stale-while-revalidate)
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          }).catch(() => {});
          
          return cachedResponse;
        }
        
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
  } else {
    // Network-First with Cache-Fallback for other files
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});
