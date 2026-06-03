import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const docs = path.join(root, 'docs');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(from, to);
    else await fs.copyFile(from, to);
  }
}

await fs.rm(docs, { recursive: true, force: true });
await copyDir(dist, docs);
await fs.writeFile(path.join(docs, '.nojekyll'), '');
console.log('Copied dist/ to docs/ — commit and push, then set Pages source to /docs.');
