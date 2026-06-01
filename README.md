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

### 4. Deploy for WeChat

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

Default sections: Clothing & Apparel, Snacks & Food, Health & Beauty. To rename or add sections, edit `data/catalog.json` (the `categories` array) — this is a one-time setup task.

## Security notes

- Change the default password before going live
- The admin page is not linked from the store — only people with the URL and password can access it
- Keep your admin password private; share it only with the store manager
