# Host the store online (so Mom can use admin in a browser)

Your mom does **not** need Node.js, npm, or a computer running in the background.  
**You** set up hosting once. After that she only needs:

1. A bookmark: `https://your-store.com/admin.html`
2. The admin password you chose
3. A phone or computer browser

---

## What does NOT work for admin

**GitHub Pages alone** only shows the customer store. It cannot save products or upload photos, because there is no server running in the background.

Local `npm run dev` is for **you** while building the site—not for daily use by your mom.

---

## What DOES work

Host the full Node app (store + admin API) on any service with **HTTPS**:

| Service | Good for | Notes |
|---------|----------|--------|
| [Render](https://render.com) | Simple setup | Connect GitHub repo, add env vars, use a disk for `data/` + `uploads/` |
| [Railway](https://railway.app) | Similar to Render | Add a volume for persistent files |
| VPS (DigitalOcean, etc.) | Long-term control | You manage updates and backups |

WeChat requires **HTTPS** on the public store URL.

---

## One-time setup (example: Render)

1. Push this project to GitHub.
2. Create a **Web Service** on Render linked to that repo.
3. Settings:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Environment variables:**
     - `ADMIN_PASSWORD` — password only your mom knows
     - `SESSION_SECRET` — any long random string
     - `NODE_ENV` = `production`
4. Add a **persistent disk** (important) mounted at the project root so `data/catalog.json` and `uploads/` are not wiped on redeploy.
5. After deploy, open:
   - Store: `https://your-app.onrender.com/`
   - Admin: `https://your-app.onrender.com/admin.html`

Optional: attach a custom domain (e.g. `shop.yourdomain.com`) in Render settings.

---

## What Mom does every day

1. Open the admin bookmark (or send her the link in WeChat).
2. Log in with the password.
3. Use **+ 新增商品**, **编辑**, **删除**, and **品牌管理** — changes appear on the store immediately.

She never runs terminal commands or edits JSON files.

---

## Tips

- **Bookmark** the admin page on her phone home screen.
- Do **not** share the admin link publicly; only the store link goes in WeChat.
- Back up `data/catalog.json` and `uploads/` occasionally (download from the server or use host backups).
- If you change categories/brands in `catalog.json` on GitHub, redeploy or edit via admin **品牌管理** on the live site.

---

## If you still use GitHub Pages for the store

You can keep Pages for a read-only mirror, but then product changes require either:

- Deploying the full Node app somewhere (recommended), or  
- Manually editing `data/catalog.json` and re-running `npm run deploy:docs` (not mom-friendly).

**Recommended:** one live URL on Render/Railway/VPS for both store and admin.
