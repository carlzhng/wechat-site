import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { BlobNotFoundError, head, put } from '@vercel/blob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');
const UPLOADS_DIR = path.join(ROOT, 'uploads');
const BLOB_CATALOG_PATH = 'catalog.json';

function getBlobToken() {
  return (
    process.env.WECHAT_READ_WRITE_TOKEN ||
    process.env.BLOB_READ_WRITE_TOKEN ||
    ''
  );
}

function getBlobStoreId() {
  return process.env.WECHAT_STORE_ID || process.env.BLOB_STORE_ID || '';
}

function blobCommandOptions() {
  const token = getBlobToken();
  return token ? { token } : {};
}

export function useBlobStorage() {
  if (getBlobToken()) return true;
  // On Vercel, a connected Blob store can auth via OIDC using BLOB_STORE_ID alone.
  if (isVercelRuntime() && getBlobStoreId()) return true;
  return false;
}

function isVercelRuntime() {
  return process.env.VERCEL === '1';
}

function requireBlobOnVercel() {
  if (isVercelRuntime() && !useBlobStorage()) {
    throw new Error(
      'Vercel Blob is not connected. Link your Blob store to this project under Storage, then redeploy Production.'
    );
  }
}

function newUploadFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase() || '.jpg';
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
}

async function readLocalCatalogFile() {
  const candidates = [
    CATALOG_PATH,
    path.join(process.cwd(), 'data', 'catalog.json'),
  ];

  for (const catalogPath of candidates) {
    try {
      const raw = await fs.readFile(catalogPath, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      if (err?.code === 'ENOENT') continue;
      throw err;
    }
  }

  throw new Error('Catalog file is missing from the deployment. Commit data/catalog.json.');
}

async function readCatalogFromBlob() {
  try {
    const meta = await head(BLOB_CATALOG_PATH, blobCommandOptions());
    const token = getBlobToken();
    const res = await fetch(
      meta.url,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    );
    if (!res.ok) return null;
    return JSON.parse(await res.text());
  } catch (err) {
    if (err instanceof BlobNotFoundError) return null;
    console.error('Blob catalog read failed:', err);
    return null;
  }
}

async function writeCatalogToBlob(catalog) {
  try {
    await put(BLOB_CATALOG_PATH, JSON.stringify(catalog, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      ...blobCommandOptions(),
    });
  } catch (err) {
    const hint = useBlobStorage()
      ? ' Check that the Blob store is connected and set to public access.'
      : '';
    throw new Error(
      `${err instanceof Error ? err.message : 'Blob upload failed.'}${hint}`
    );
  }
}

export async function ensureUploadsDir() {
  if (useBlobStorage() || isVercelRuntime()) return;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

export async function readCatalog() {
  if (useBlobStorage()) {
    let catalog = await readCatalogFromBlob();
    if (!catalog) {
      catalog = await readLocalCatalogFile();
      try {
        await writeCatalogToBlob(catalog);
      } catch (err) {
        console.error('Failed to seed catalog to Blob, serving bundled catalog:', err);
      }
    }
    return catalog;
  }

  try {
    return await readLocalCatalogFile();
  } catch (err) {
    console.error('Bundled catalog read failed:', err);
    throw err;
  }
}

export async function writeCatalog(catalog) {
  requireBlobOnVercel();
  if (useBlobStorage()) {
    await writeCatalogToBlob(catalog);
    return;
  }
  await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog, null, 2));
}

export async function saveUploadedImage(file) {
  requireBlobOnVercel();
  const filename = newUploadFilename(file.originalname);

  if (useBlobStorage()) {
    try {
      const blob = await put(`uploads/${filename}`, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
        addRandomSuffix: false,
        ...blobCommandOptions(),
      });
      return blob.url;
    } catch (err) {
      const hint = ' Check that the Blob store allows public uploads.';
      throw new Error(
        `${err instanceof Error ? err.message : 'Image upload failed.'}${hint}`
      );
    }
  }

  await fs.writeFile(path.join(UPLOADS_DIR, filename), file.buffer);
  return `/uploads/${filename}`;
}

export function getUploadsDir() {
  return UPLOADS_DIR;
}
