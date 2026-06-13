import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { BlobNotFoundError, get, head, put } from '@vercel/blob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');
const UPLOADS_DIR = path.join(ROOT, 'uploads');
const BLOB_CATALOG_PATH = 'catalog.json';

let catalogSnapshot = null;

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
  const storeId = getBlobStoreId();
  return {
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
  };
}

export function useBlobStorage() {
  if (getBlobToken()) return true;
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
    const result = await get(BLOB_CATALOG_PATH, {
      access: 'public',
      ...blobCommandOptions(),
    });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text());
    }
  } catch (err) {
    if (!(err instanceof BlobNotFoundError)) {
      console.error('Blob catalog read via get() failed:', err);
    }
  }

  try {
    const meta = await head(BLOB_CATALOG_PATH, blobCommandOptions());
    const token = getBlobToken();
    const res = await fetch(`${meta.url}?v=${Date.now()}`, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return null;
    return JSON.parse(await res.text());
  } catch (err) {
    if (err instanceof BlobNotFoundError) return null;
    console.error('Blob catalog read via URL failed:', err);
    return null;
  }
}

function formatBlobError(err) {
  const message = err instanceof Error ? err.message : 'Blob operation failed.';
  if (/store does not exist/i.test(message)) {
    return (
      `${message} Your BLOB_STORE_ID likely points to a deleted store. ` +
      'In Vercel: Storage → disconnect old Blob links, connect your current public store to this project, confirm BLOB_STORE_ID updated, then redeploy Production.'
    );
  }
  return message;
}

async function writeCatalogToBlob(catalog) {
  try {
    await put(BLOB_CATALOG_PATH, JSON.stringify(catalog, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
      ...blobCommandOptions(),
    });
  } catch (err) {
    throw new Error(formatBlobError(err));
  }
}

export async function ensureUploadsDir() {
  if (useBlobStorage() || isVercelRuntime()) return;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

export async function readCatalog() {
  if (useBlobStorage()) {
    if (catalogSnapshot) return structuredClone(catalogSnapshot);

    let catalog = await readCatalogFromBlob();
    if (!catalog) {
      catalog = await readLocalCatalogFile();
      try {
        await writeCatalogToBlob(catalog);
        catalogSnapshot = structuredClone(catalog);
      } catch (err) {
        console.error('Failed to seed catalog to Blob, serving bundled catalog:', err);
      }
    } else {
      catalogSnapshot = structuredClone(catalog);
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
    catalogSnapshot = structuredClone(catalog);
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
      throw new Error(formatBlobError(err));
    }
  }

  await fs.writeFile(path.join(UPLOADS_DIR, filename), file.buffer);
  return `/uploads/${filename}`;
}

export function getUploadsDir() {
  return UPLOADS_DIR;
}
