import express from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-secret';
const isProd = process.env.NODE_ENV === 'production';

const CATALOG_PATH = path.join(__dirname, 'data', 'catalog.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

function authToken() {
  return crypto.createHmac('sha256', SESSION_SECRET).update('admin').digest('hex');
}

function requireAuth(req, res, next) {
  if (req.cookies.auth === authToken()) return next();
  res.status(401).json({ error: 'Please sign in again.' });
}

async function readCatalog() {
  const raw = await fs.readFile(CATALOG_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeCatalog(catalog) {
  await fs.writeFile(CATALOG_PATH, JSON.stringify(catalog, null, 2));
}

function newProductId() {
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

await fs.mkdir(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, safe);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
});

app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/api/catalog', async (_req, res) => {
  try {
    res.json(await readCatalog());
  } catch {
    res.status(500).json({ error: 'Could not load store catalog.' });
  }
});

app.get('/api/me', (req, res) => {
  res.json({ loggedIn: req.cookies.auth === authToken() });
});

app.post('/api/login', (req, res) => {
  const password = String(req.body?.password ?? '').trim();
  const expected = String(ADMIN_PASSWORD).trim();
  if (!password || password !== expected) {
    return res.status(401).json({ error: 'Wrong password. Please try again.' });
  }
  res.cookie('auth', authToken(), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: isProd,
  });
  res.json({ ok: true });
});

app.post('/api/logout', (_req, res) => {
  res.clearCookie('auth');
  res.json({ ok: true });
});

app.post('/api/upload', requireAuth, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed.' });
    }
    if (!req.file) return res.status(400).json({ error: 'No image received.' });
    res.json({ url: `/uploads/${req.file.filename}` });
  });
});

app.post('/api/products', requireAuth, async (req, res) => {
  try {
    const { name, categoryId, brand, price, description, images, currency = 'CNY' } =
      req.body ?? {};
    if (!name?.trim()) return res.status(400).json({ error: 'Item name is required.' });
    if (!categoryId) return res.status(400).json({ error: 'Please pick a section.' });
    if (price === undefined || price === null || Number.isNaN(Number(price))) {
      return res.status(400).json({ error: 'Please enter a price.' });
    }

    const catalog = await readCatalog();
    const category = catalog.categories.find((c) => c.id === categoryId);
    if (!category) {
      return res.status(400).json({ error: 'That section does not exist.' });
    }

    let brandName = (brand ?? '').trim();
    const allowedBrands = category.brands ?? [];
    if (allowedBrands.length) {
      if (!brandName) {
        return res.status(400).json({ error: 'Please pick a brand for this section.' });
      }
      const matchedBrand = allowedBrands.find((b) => brandsEqual(b, brandName));
      if (!matchedBrand) {
        return res.status(400).json({ error: 'Please pick a brand for this section.' });
      }
      brandName = matchedBrand;
    }

    const product = {
      id: newProductId(),
      categoryId,
      name: name.trim(),
      ...(brandName && { brand: brandName }),
      price: Number(price),
      currency,
      description: (description ?? '').trim(),
      images: Array.isArray(images) ? images : [],
    };

    catalog.products.push(product);
    await writeCatalog(catalog);
    res.json(product);
  } catch {
    res.status(500).json({ error: 'Could not add item.' });
  }
});

app.put('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const { name, categoryId, brand, price, description, images, currency = 'CNY' } =
      req.body ?? {};
    const catalog = await readCatalog();
    const index = catalog.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Item not found.' });

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ error: 'Item name is required.' });
    }

    const existing = catalog.products[index];
    const nextCategoryId = categoryId ?? existing.categoryId;
    const category = catalog.categories.find((c) => c.id === nextCategoryId);
    const allowedBrands = category?.brands ?? [];

    let nextBrand =
      brand !== undefined ? brand.trim() || undefined : existing.brand;

    if (allowedBrands.length) {
      if (!nextBrand) {
        return res.status(400).json({ error: 'Please pick a brand for this section.' });
      }
      const matchedBrand = allowedBrands.find((b) => brandsEqual(b, nextBrand));
      if (!matchedBrand) {
        return res.status(400).json({ error: 'Please pick a brand for this section.' });
      }
      nextBrand = matchedBrand;
    }

    catalog.products[index] = {
      ...existing,
      ...(name !== undefined && { name: name.trim() }),
      ...(categoryId !== undefined && { categoryId }),
      ...(brand !== undefined && (nextBrand ? { brand: nextBrand } : { brand: undefined })),
      ...(price !== undefined && { price: Number(price) }),
      ...(description !== undefined && { description: description.trim() }),
      ...(images !== undefined && { images }),
      ...(currency !== undefined && { currency }),
    };

    if (brand !== undefined && !nextBrand) {
      delete catalog.products[index].brand;
    }

    await writeCatalog(catalog);
    res.json(catalog.products[index]);
  } catch {
    res.status(500).json({ error: 'Could not save changes.' });
  }
});

function normalizeBrandName(brand) {
  return String(brand ?? '').trim();
}

function brandsEqual(a, b) {
  return normalizeBrandName(a).toLowerCase() === normalizeBrandName(b).toLowerCase();
}

app.post('/api/categories/:categoryId/brands', requireAuth, async (req, res) => {
  try {
    const brandName = normalizeBrandName(req.body?.brand);
    if (!brandName) {
      return res.status(400).json({ error: 'Please enter a brand name.' });
    }

    const catalog = await readCatalog();
    const category = catalog.categories.find((c) => c.id === req.params.categoryId);
    if (!category) {
      return res.status(404).json({ error: 'That section does not exist.' });
    }

    if (!Array.isArray(category.brands)) category.brands = [];
    if (category.brands.some((b) => brandsEqual(b, brandName))) {
      return res.status(400).json({ error: 'This brand already exists in that section.' });
    }

    category.brands.push(brandName);
    await writeCatalog(catalog);
    res.json(category);
  } catch {
    res.status(500).json({ error: 'Could not add brand.' });
  }
});

app.delete('/api/categories/:categoryId/brands', requireAuth, async (req, res) => {
  try {
    const brandName = normalizeBrandName(req.body?.brand);
    if (!brandName) {
      return res.status(400).json({ error: 'Please specify which brand to remove.' });
    }

    const catalog = await readCatalog();
    const category = catalog.categories.find((c) => c.id === req.params.categoryId);
    if (!category) {
      return res.status(404).json({ error: 'That section does not exist.' });
    }

    const brands = category.brands ?? [];
    const nextBrands = brands.filter((b) => !brandsEqual(b, brandName));
    if (nextBrands.length === brands.length) {
      return res.status(404).json({ error: 'Brand not found in that section.' });
    }

    category.brands = nextBrands;
    await writeCatalog(catalog);
    res.json(category);
  } catch {
    res.status(500).json({ error: 'Could not remove brand.' });
  }
});

app.delete('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const catalog = await readCatalog();
    const before = catalog.products.length;
    catalog.products = catalog.products.filter((p) => p.id !== req.params.id);
    if (catalog.products.length === before) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    await writeCatalog(catalog);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Could not remove item.' });
  }
});

if (isProd) {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom' });
  app.use(vite.middlewares);

  app.use(async (req, res, next) => {
    if (req.method !== 'GET') return next();

    const url = req.originalUrl.split('?')[0];
    let htmlFile = null;
    if (url === '/' || url === '/index.html') htmlFile = 'index.html';
    else if (url === '/admin.html') htmlFile = 'admin.html';
    else return next();

    try {
      const filePath = path.join(__dirname, htmlFile);
      let template = await fs.readFile(filePath, 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (err) {
      vite.ssrFixStacktrace(err);
      next(err);
    }
  });
}

app.listen(PORT, () => {
  console.log(`Store running at http://localhost:${PORT}`);
  console.log(`Admin panel at http://localhost:${PORT}/admin.html`);
  if (ADMIN_PASSWORD === 'changeme') {
    console.warn('WARNING: Set ADMIN_PASSWORD in a .env file before going live!');
  }
});
