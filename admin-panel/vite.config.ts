import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom plugin to redirect root to base URL in development
const redirectPlugin = () => ({
  name: 'redirect-to-admin',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(302, { Location: '/admin/' });
        res.end();
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    redirectPlugin()
  ],
  base: '/admin/',
  server: {
    port: 3001
  }
})

