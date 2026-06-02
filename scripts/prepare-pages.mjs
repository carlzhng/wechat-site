import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

async function copyDir(src, dest) {
  try {
    await fs.access(src);
  } catch {
    return;
  }
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(from, to);
    else if (entry.name !== '.gitkeep') await fs.copyFile(from, to);
  }
}

await fs.mkdir(path.join(root, 'public', 'data'), { recursive: true });
await fs.copyFile(
  path.join(root, 'data', 'catalog.json'),
  path.join(root, 'public', 'data', 'catalog.json')
);
await copyDir(path.join(root, 'uploads'), path.join(root, 'public', 'uploads'));

console.log('Prepared public/ assets for GitHub Pages build.');
