import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Unregister service worker on localhost to prevent caching/HMR issues (white screens)
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      let unregistered = false;
      for (const registration of registrations) {
        registration.unregister();
        unregistered = true;
      }
      if (unregistered) {
        console.log('Unregistered active service workers on localhost to resolve caching/HMR issues.');
        window.location.reload();
      }
    });
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('ServiceWorker registration successful with scope: ', reg.scope))
        .catch((err) => console.error('ServiceWorker registration failed: ', err));
    });
  }
}

