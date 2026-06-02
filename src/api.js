const API = '/api';
const STATIC_CATALOG = import.meta.env.VITE_STATIC_CATALOG === 'true';
const STATIC_CATALOG_URL = `${import.meta.env.BASE_URL}data/catalog.json`;

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
}

function resolveCatalogAssets(catalog) {
  const base = import.meta.env.BASE_URL;
  return {
    ...catalog,
    products: catalog.products.map((product) => ({
      ...product,
      images: (product.images ?? []).map((src) => {
        if (!src || src.startsWith('http')) return src;
        const path = src.startsWith('/') ? src.slice(1) : src;
        return `${base}${path}`;
      }),
    })),
  };
}

async function apiFetch(url, options = {}) {
  try {
    return await fetch(url, { credentials: 'include', ...options });
  } catch {
    throw new Error(
      'Cannot reach the store server. Run "npm run dev" and open http://localhost:3000/admin.html'
    );
  }
}

export async function fetchCatalog() {
  if (STATIC_CATALOG) {
    const res = await fetch(STATIC_CATALOG_URL);
    const catalog = await parseJson(res);
    return resolveCatalogAssets(catalog);
  }

  try {
    const res = await apiFetch(`${API}/catalog`);
    return parseJson(res);
  } catch {
    const res = await fetch(STATIC_CATALOG_URL);
    const catalog = await parseJson(res);
    return resolveCatalogAssets(catalog);
  }
}

export async function checkAuth() {
  const res = await apiFetch(`${API}/me`);
  return parseJson(res);
}

export async function login(password) {
  const res = await apiFetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return parseJson(res);
}

export async function logout() {
  const res = await apiFetch(`${API}/logout`, { method: 'POST' });
  return parseJson(res);
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append('image', file);
  const res = await apiFetch(`${API}/upload`, { method: 'POST', body: form });
  return parseJson(res);
}

export async function createProduct(product) {
  const res = await apiFetch(`${API}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return parseJson(res);
}

export async function updateProduct(id, product) {
  const res = await apiFetch(`${API}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return parseJson(res);
}

export async function deleteProduct(id) {
  const res = await apiFetch(`${API}/products/${id}`, { method: 'DELETE' });
  return parseJson(res);
}
