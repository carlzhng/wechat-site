# Deploy to Vercel (store + admin)

Vercel hosts the customer store and the admin panel on one HTTPS site. The guest page and admin both use the same API; catalog and new photo uploads are stored in **Vercel Blob** (the serverless runtime cannot write to `data/` or `uploads/` on disk).

## One-time setup

### 1. Push the repo to GitHub

Vercel deploys from your Git repository.

### 2. Import the project in Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import this repository
3. Leave **Framework Preset** as detected (or “Other”)
4. Vercel should pick up `vercel.json` automatically:
   - **Build command:** `npm run build:vercel`
   - **Output directory:** `dist`

### 3. Add a Blob store

1. In the Vercel project → **Storage** → **Create Database** → **Blob**
2. Connect it to this project

Vercel adds `BLOB_READ_WRITE_TOKEN` for you. No manual copy is required unless you deploy elsewhere.

### 4. Set environment variables

In **Project → Settings → Environment Variables**, add:

| Name | Value |
|------|--------|
| `ADMIN_PASSWORD` | Password for the store manager |
| `SESSION_SECRET` | Long random string (e.g. 32+ characters) |

Apply to **Production** (and Preview if you want admin on preview URLs).

### 5. Deploy

Click **Deploy**. When it finishes:

- **Store:** `https://your-project.vercel.app/`
- **Admin:** `https://your-project.vercel.app/admin.html`

On first admin login, the live catalog is copied from `data/catalog.json` in the repo into Blob. Existing product images that use `/uploads/...` paths are still served from the static build; **new** uploads get public Blob URLs.

## Custom domain (WeChat)

1. **Project → Settings → Domains** → add your domain
2. Point DNS as Vercel instructs
3. Share `https://your-domain.com/` and `https://your-domain.com/admin.html` in WeChat

## Local development

Local dev still uses files on disk (no Blob token required):

```bash
npm install
copy .env.example .env
# edit ADMIN_PASSWORD and SESSION_SECRET
npm run dev
```

- Store: http://localhost:3000/
- Admin: http://localhost:3000/admin.html

## Troubleshooting

| Problem | What to check |
|---------|----------------|
| Admin login fails | `ADMIN_PASSWORD` in Vercel env vars |
| “Please sign in again” after login | `SESSION_SECRET` set; use HTTPS (Vercel default) |
| Changes don’t save | Blob store connected; `BLOB_READ_WRITE_TOKEN` present |
| Old photos missing | Commit files under `uploads/` and redeploy so they are copied into `public/uploads` at build time |
| Guest page empty | `data/catalog.json` committed; run `npm run build:vercel` locally to verify build |

## GitHub Pages vs Vercel

| | GitHub Pages | Vercel |
|--|--------------|--------|
| Guest store | Yes (read-only) | Yes |
| Admin edits | No | Yes |
| HTTPS for WeChat | Yes | Yes |

You can keep GitHub Pages for a backup storefront, but day-to-day management should use the Vercel deployment.
