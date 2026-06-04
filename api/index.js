import { createApp } from '../app.js';

let appPromise;

export default async function handler(req, res) {
  if (!appPromise) appPromise = createApp({ serveStatic: false });
  const app = await appPromise;
  return app(req, res);
}
