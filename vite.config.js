import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'transformers-fix',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url.startsWith('/models/Xenova')) {
            res.statusCode = 404;
            res.end('Not Found');
            return;
          }
          next();
        });
      }
    }
  ],
})
