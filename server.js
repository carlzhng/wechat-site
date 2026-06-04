import { createApp } from './app.js';

const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';
const isProd = process.env.NODE_ENV === 'production';

let app;

if (isProd) {
  app = await createApp({ serveStatic: true });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom' });
  app = await createApp({
    viteMiddleware: vite.middlewares,
    transformIndexHtml: (url, template) => vite.transformIndexHtml(url, template),
    ssrFixStacktrace: (err) => vite.ssrFixStacktrace(err),
  });
}

app.listen(PORT, () => {
  console.log(`Store running at http://localhost:${PORT}`);
  console.log(`Admin panel at http://localhost:${PORT}/admin.html`);
  if (ADMIN_PASSWORD === 'changeme') {
    console.warn('WARNING: Set ADMIN_PASSWORD in a .env file before going live!');
  }
});
