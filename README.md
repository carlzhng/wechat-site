# WeChat Store

A mobile-first product catalog for WeChat, with a simple admin panel so anyone can manage items — no coding required.

## For customers

Share your store link in WeChat. Customers browse by section, swipe through product photos, and see prices. There is no checkout — they contact you to order.

**Store URL:** `https://your-domain.com/`

## For the store manager (admin)

Bookmark the admin page and sign in with the password you set up:

**Admin URL:** `https://your-domain.com/admin.html`

From there you can:

- **Add New Item** — name, section, price, description, photos
- **Edit** — change price, update photos, edit details
- **Remove Item** — delete with a confirmation prompt
- **Add Photos** — tap "+ Add Photos" to upload from phone or computer
- **Remove Photos** — tap ✕ on any photo (first photo is the cover image)

Changes save immediately and appear on the store for customers.

### Can Mom use admin without running npm locally?

**Yes.** Local `npm run dev` is only for development on your computer.

For daily use, deploy the full app once to a cloud host (Render, Railway, a VPS, etc.) with HTTPS. Mom then opens `https://your-domain.com/admin.html` in a browser—no terminal, no npm.

GitHub Pages **cannot** run the admin (read-only store only). See **[docs/HOSTING-FOR-ADMIN.md](docs/HOSTING-FOR-ADMIN.md)** for a step-by-step hosting guide.

---

## Setup (one time, for you)

### 1. Install Node.js

Download from [nodejs.org](https://nodejs.org) (LTS version).

### 2. Install and configure

```bash
npm install
```

Copy the example env file and set a password:

```bash
copy .env.example .env
```

Edit `.env` and set:

```
ADMIN_PASSWORD=choose-a-password-mom-will-remember
SESSION_SECRET=any-long-random-string
```

### 3. Run locally

```bash
npm run dev
```

- Store: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

### 4. Deploy to GitHub Pages

GitHub Pages cannot run the Node.js admin API. Use it for a **read-only** storefront.

**Important:** Do not use “Deploy from branch → `/ (root)`”. That serves raw `index.html` without CSS. Use the **`/docs` folder** instead.

#### One-time setup (required)

1. Open your repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Set **Branch** to **`main`** and folder to **`/docs`**
4. Click **Save**

#### Deploy updates

After changing products locally (`npm run dev` + admin), commit `data/catalog.json` and `uploads/`, then either:

- **Push to `main`** — GitHub Actions rebuilds and updates the `docs/` folder automatically, or
- **Locally:** run `npm run deploy:docs`, then commit and push the `docs/` folder

Your store URL: `https://<username>.github.io/wechat-site/`

To test locally:

```bash
npm run deploy:docs
npx serve docs -l 4173
```

Then open `http://localhost:4173/wechat-site/`

**Note:** Styles live in `src/styles/main.css` during development. The live site uses bundled CSS from the build (e.g. `docs/assets/main-*.css`).

### 5. Deploy for WeChat

WeChat requires HTTPS. Build and run on a server:

```bash
npm run build
npm start
```

Deploy to any Node.js host (Railway, Render, a VPS, etc.). Make sure:

- The `data/` folder and `uploads/` folder persist (they hold your catalog and photos)
- Your `.env` file is set on the server with a strong `ADMIN_PASSWORD`

---

## Project structure

| Path | Purpose |
|------|---------|
| `data/catalog.json` | Product catalog (managed via admin) |
| `uploads/` | Product photos uploaded through admin |
| `admin.html` | Admin panel |
| `index.html` | Customer-facing store |
| `.env` | Password and secrets (never commit this) |

## Categories

Default sections: Clothing & Apparel, Health, Beauty, Snacks & Food. To rename or add sections, edit `data/catalog.json` (the `categories` array) — the sidebar and admin read from there automatically.

## Security notes

- Change the default password before going live
- The admin page is not linked from the store — only people with the URL and password can access it
- Keep your admin password private; share it only with the store manager
