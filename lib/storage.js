import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { BlobNotFoundError, head, put } from '@vercel/blob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');
const UPLOADS_DIR = path.join(ROOT, 'uploads');
const BLOB_CATALOG_PATH = 'catalog.json';

export function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function newUploadFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase() || '.jpg';
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
}

async function readLocalCatalogFile() {
  const raw = await fs.readFile(CATALOG_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function readCatalogFromBlob() {
  try {
    const meta = await head(BLOB_CATALOG_PATH);
    const res = await fetch(meta.url);
    if (!res.ok) throw new Error('Could not fetch catalog from blob storage.');
    return JSON.parse(await res.text());
  } catch (err) {
    if (err instanceof BlobNotFoundError) return null;
    throw err;
  }
}

async function writeCatalogToBlob(catalog) {
  await put(BLOB_CATALOG_PATH, JSON.stringify(catalog, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function ensureUploadsDir() {
  if (!useBlobStorage()) {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function readCatalog() {
  if (useBlobStorage()) {
    let catalog = await readCatalogFromBlob();
    if (!catalog) {
      catalog = await readLocalCatalogFile();
      await writeCatalogToBlob(catalog);
    }
    return catalog;
  }
  return readLocalCatalogFile();
}

export async function writeCatalog(catalog) {
  if (useBlobStorage()) {
    await writeCatalogToBlob(catalog);
    return;
  }
  await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog, null, 2));
}

export async function saveUploadedImage(file) {
  const filename = newUploadFilename(file.originalname);

  if (useBlobStorage()) {
    const blob = await put(`uploads/${filename}`, file.buffer, {
      access: 'public',
      contentType: file.mimetype,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  await fs.writeFile(path.join(UPLOADS_DIR, filename), file.buffer);
  return `/uploads/${filename}`;
}

export function getUploadsDir() {
  return UPLOADS_DIR;
}
