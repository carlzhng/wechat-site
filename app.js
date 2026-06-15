import express from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  ensureUploadsDir,
  readCatalog,
  writeCatalog,
  saveUploadedImage,
  getUploadsDir,
  useBlobStorage,
} from './lib/storage.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-secret';

function isSecureCookie() {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL === '1' ||
    process.env.VERCEL_ENV === 'production'
  );
}

function authToken() {
  return crypto.createHmac('sha256', SESSION_SECRET).update('admin').digest('hex');
}

function requireAuth(req, res, next) {
  if (req.cookies.auth === authToken()) return next();
  res.status(401).json({ error: 'Please sign in again.' });
}

function newProductId() {
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeBrandName(brand) {
  return String(brand ?? '').trim();
}

function brandsEqual(a, b) {
  return normalizeBrandName(a).toLowerCase() === normalizeBrandName(b).toLowerCase();
}

function sendApiError(res, err, fallback) {
  console.error(err);
  const message = err instanceof Error && err.message ? err.message : fallback;
  res.status(500).json({ error: message });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
});

export async function createApp(options = {}) {
  const { serveStatic = false, viteMiddleware = null } = options;

  await ensureUploadsDir();

  const app = express();
  app.set('trust proxy', 1);

  // Vercel rewrites can leave req.url as "/api" while originalUrl keeps "/api/products".
  if (process.env.VERCEL === '1') {
    app.use((req, _res, next) => {
      const originalPath = (req.originalUrl || '').split('?')[0];
      const currentPath = (req.url || '').split('?')[0];
      if (
        originalPath.startsWith('/api/') &&
        (currentPath === '/api' || currentPath === '/api/')
      ) {
        const query = req.originalUrl?.includes('?')
          ? req.originalUrl.slice(req.originalUrl.indexOf('?'))
          : '';
        req.url = originalPath + query;
      }
      next();
    });
  }

  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());

  if (!useBlobStorage()) {
    app.use('/uploads', express.static(getUploadsDir()));
  }

  app.get('/api/catalog', async (_req, res) => {
    try {
      res.set('Cache-Control', 'no-store');
      res.json(await readCatalog());
    } catch (err) {
      sendApiError(res, err, 'Could not load store catalog.');
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
      secure: isSecureCookie(),
    });
    res.json({ ok: true });
  });

  app.post('/api/logout', (_req, res) => {
    res.clearCookie('auth', { secure: isSecureCookie() });
    res.json({ ok: true });
  });

  app.post('/api/upload', requireAuth, (req, res) => {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || 'Upload failed.' });
      }
      if (!req.file) return res.status(400).json({ error: 'No image received.' });
      try {
        const url = await saveUploadedImage(req.file);
        res.json({ url });
      } catch (err) {
        sendApiError(res, err, 'Upload failed.');
      }
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
      res.json({ product, catalog });
    } catch (err) {
      sendApiError(res, err, 'Could not add item.');
    }
  });

  app.put('/api/products/order', requireAuth, async (req, res) => {
    try {
      const { categoryId, brand, productIds } = req.body ?? {};
      if (!categoryId) {
        return res.status(400).json({ error: 'Please pick a section.' });
      }
      if (!Array.isArray(productIds)) {
        return res.status(400).json({ error: 'Product order must be a list.' });
      }

      const catalog = await readCatalog();
      const category = catalog.categories.find((c) => c.id === categoryId);
      if (!category) {
        return res.status(404).json({ error: 'That section does not exist.' });
      }

      const allowedBrands = category.brands ?? [];
      const brandKey = brand === undefined || brand === null ? null : String(brand);

      function inScope(product) {
        if (product.categoryId !== categoryId) return false;
        if (!allowedBrands.length) return true;
        if (brandKey === '未分配品牌') {
          if (!product.brand) return true;
          return !allowedBrands.some((b) => brandsEqual(b, product.brand));
        }
        if (brandKey) {
          return Boolean(product.brand && brandsEqual(product.brand, brandKey));
        }
        return true;
      }

      const scoped = catalog.products.filter(inScope);
      if (productIds.length !== scoped.length) {
        return res.status(400).json({ error: 'Product list does not match this section.' });
      }

      const byId = new Map(scoped.map((p) => [p.id, p]));
      const reordered = productIds.map((id) => {
        const product = byId.get(id);
        if (!product) return null;
        return product;
      });

      if (reordered.some((p) => !p)) {
        return res.status(400).json({ error: 'Product list does not match this section.' });
      }

      const scopedIds = new Set(scoped.map((p) => p.id));
      let index = 0;
      catalog.products = catalog.products.map((product) => {
        if (!scopedIds.has(product.id)) return product;
        return reordered[index++];
      });

      await writeCatalog(catalog);
      res.json({ catalog });
    } catch (err) {
      sendApiError(res, err, 'Could not reorder products.');
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
      res.json({ product: catalog.products[index], catalog });
    } catch (err) {
      sendApiError(res, err, 'Could not save changes.');
    }
  });

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
    } catch (err) {
      sendApiError(res, err, 'Could not add brand.');
    }
  });

  app.put('/api/categories/:categoryId/brands/order', requireAuth, async (req, res) => {
    try {
      const { brands } = req.body ?? {};
      if (!Array.isArray(brands)) {
        return res.status(400).json({ error: 'Brand order must be a list.' });
      }

      const catalog = await readCatalog();
      const category = catalog.categories.find((c) => c.id === req.params.categoryId);
      if (!category) {
        return res.status(404).json({ error: 'That section does not exist.' });
      }

      const existing = category.brands ?? [];
      if (brands.length !== existing.length) {
        return res.status(400).json({ error: 'Brand list does not match this section.' });
      }

      const reordered = brands.map((name) => {
        const trimmed = normalizeBrandName(name);
        const match = existing.find((b) => brandsEqual(b, trimmed));
        if (!match) return null;
        return match;
      });

      if (reordered.some((b) => !b)) {
        return res.status(400).json({ error: 'Brand list does not match this section.' });
      }

      category.brands = reordered;
      await writeCatalog(catalog);
      res.json(category);
    } catch (err) {
      sendApiError(res, err, 'Could not reorder brands.');
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
    } catch (err) {
      sendApiError(res, err, 'Could not remove brand.');
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
      res.json({ ok: true, catalog });
    } catch (err) {
      sendApiError(res, err, 'Could not remove item.');
    }
  });

  if (viteMiddleware) {
    app.use(viteMiddleware);
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
        template = await options.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (err) {
        options.ssrFixStacktrace?.(err);
        next(err);
      }
    });
  } else if (serveStatic) {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      const filePath = path.join(distDir, req.path === '/' ? 'index.html' : req.path);
      res.sendFile(filePath, (err) => {
        if (!err) return;
        res.sendFile(path.join(distDir, 'index.html'));
      });
    });
  }

  return app;
}
