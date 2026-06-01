import {
  checkAuth,
  login,
  logout,
  fetchCatalog,
  uploadImage,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api.js';

const state = {
  loggedIn: false,
  categories: [],
  products: [],
  activeCategory: 'all',
  editingId: null,
  draftImages: [],
  saving: false,
};

const els = {
  loginScreen: document.getElementById('login-screen'),
  loginForm: document.getElementById('login-form'),
  loginError: document.getElementById('login-error'),
  dashboard: document.getElementById('dashboard'),
  logoutBtn: document.getElementById('logout-btn'),
  categoryTabs: document.getElementById('category-tabs'),
  productList: document.getElementById('product-list'),
  addBtn: document.getElementById('add-btn'),
  editModal: document.getElementById('edit-modal'),
  editBackdrop: document.getElementById('edit-backdrop'),
  editClose: document.getElementById('edit-close'),
  editTitle: document.getElementById('edit-title'),
  editForm: document.getElementById('edit-form'),
  itemName: document.getElementById('item-name'),
  itemCategory: document.getElementById('item-category'),
  itemPrice: document.getElementById('item-price'),
  itemDescription: document.getElementById('item-description'),
  photoGrid: document.getElementById('photo-grid'),
  photoInput: document.getElementById('photo-input'),
  editError: document.getElementById('edit-error'),
  deleteBtn: document.getElementById('delete-btn'),
  cancelBtn: document.getElementById('cancel-btn'),
  saveBtn: document.getElementById('save-btn'),
  toast: document.getElementById('toast'),
};

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  els.toast.classList.add('show');
  setTimeout(() => {
    els.toast.classList.remove('show');
    setTimeout(() => {
      els.toast.hidden = true;
    }, 300);
  }, 3000);
}

function showError(el, message) {
  if (message) {
    el.textContent = message;
    el.hidden = false;
  } else {
    el.hidden = true;
    el.textContent = '';
  }
}

function setView(loggedIn) {
  state.loggedIn = loggedIn;
  els.loginScreen.hidden = loggedIn;
  els.dashboard.hidden = !loggedIn;
}

async function loadCatalog() {
  const catalog = await fetchCatalog();
  state.categories = catalog.categories;
  state.products = catalog.products;
  if (state.activeCategory === 'all' && state.categories.length) {
    // keep 'all'
  }
  renderDashboard();
}

function filteredProducts() {
  if (state.activeCategory === 'all') return state.products;
  return state.products.filter((p) => p.categoryId === state.activeCategory);
}

function getCategoryName(id) {
  return state.categories.find((c) => c.id === id)?.name ?? 'Unknown';
}

function renderCategoryTabs() {
  const tabs = [
    { id: 'all', name: 'All Items', icon: '📦' },
    ...state.categories.map((c) => ({ id: c.id, name: c.name, icon: c.icon })),
  ];

  els.categoryTabs.innerHTML = tabs
    .map(
      (tab) => `
    <button
      class="category-tab ${tab.id === state.activeCategory ? 'active' : ''}"
      data-category="${tab.id}"
      type="button"
    >
      <span aria-hidden="true">${tab.icon}</span> ${tab.name}
    </button>
  `
    )
    .join('');

  els.categoryTabs.querySelectorAll('.category-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeCategory = btn.dataset.category;
      renderCategoryTabs();
      renderProductList();
    });
  });
}

function renderProductList() {
  const items = filteredProducts();

  if (items.length === 0) {
    els.productList.innerHTML = `
      <div class="empty-list">
        <p>No items here yet.</p>
        <button class="btn btn-primary" type="button" id="empty-add-btn">+ Add Your First Item</button>
      </div>
    `;
    document.getElementById('empty-add-btn')?.addEventListener('click', () => openEditor());
    return;
  }

  els.productList.innerHTML = items
    .map((product) => {
      const thumb = product.images[0]
        ? `<img src="${product.images[0]}" alt="" />`
        : `<div class="no-photo">No photo</div>`;
      return `
      <article class="admin-product-card">
        <div class="admin-product-thumb">${thumb}</div>
        <div class="admin-product-info">
          <p class="admin-product-section">${getCategoryName(product.categoryId)}</p>
          <h3>${product.name}</h3>
          <p class="admin-product-price">${formatPrice(product.price)}</p>
          <p class="admin-product-desc">${product.description || 'No description'}</p>
          <p class="admin-product-photos">${product.images.length} photo${product.images.length === 1 ? '' : 's'}</p>
        </div>
        <button class="btn btn-secondary edit-product-btn" data-id="${product.id}" type="button">
          Edit
        </button>
      </article>
    `;
    })
    .join('');

  els.productList.querySelectorAll('.edit-product-btn').forEach((btn) => {
    btn.addEventListener('click', () => openEditor(btn.dataset.id));
  });
}

function renderDashboard() {
  renderCategoryTabs();
  renderProductList();
  populateCategorySelect();
}

function populateCategorySelect() {
  els.itemCategory.innerHTML = state.categories
    .map((c) => `<option value="${c.id}">${c.icon} ${c.name}</option>`)
    .join('');
}

function renderPhotoGrid() {
  els.photoGrid.innerHTML = state.draftImages
    .map(
      (url, i) => `
    <div class="photo-thumb ${i === 0 ? 'is-cover' : ''}">
      ${i === 0 ? '<span class="cover-badge">Cover</span>' : ''}
      <img src="${url}" alt="" />
      <button class="photo-remove" data-index="${i}" type="button" aria-label="Remove photo">✕</button>
    </div>
  `
    )
    .join('');

  els.photoGrid.querySelectorAll('.photo-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.draftImages.splice(Number(btn.dataset.index), 1);
      renderPhotoGrid();
    });
  });
}

function openEditor(productId = null) {
  state.editingId = productId;
  showError(els.editError, '');

  if (productId) {
    const product = state.products.find((p) => p.id === productId);
    if (!product) return;
    els.editTitle.textContent = 'Edit Item';
    els.itemName.value = product.name;
    els.itemCategory.value = product.categoryId;
    els.itemPrice.value = product.price;
    els.itemDescription.value = product.description ?? '';
    state.draftImages = [...product.images];
    els.deleteBtn.hidden = false;
  } else {
    els.editTitle.textContent = 'Add New Item';
    els.editForm.reset();
    els.itemCategory.value =
      state.activeCategory !== 'all' ? state.activeCategory : state.categories[0]?.id ?? '';
    state.draftImages = [];
    els.deleteBtn.hidden = true;
  }

  renderPhotoGrid();
  els.editModal.classList.add('open');
  els.editModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  els.itemName.focus();
}

function closeEditor() {
  els.editModal.classList.remove('open');
  els.editModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  state.editingId = null;
  state.draftImages = [];
  els.photoInput.value = '';
}

async function handlePhotoUpload(files) {
  for (const file of files) {
    try {
      const { url } = await uploadImage(file);
      state.draftImages.push(url);
    } catch (err) {
      showToast(err.message);
    }
  }
  renderPhotoGrid();
}

async function handleSave(e) {
  e.preventDefault();
  if (state.saving) return;

  showError(els.editError, '');

  const payload = {
    name: els.itemName.value,
    categoryId: els.itemCategory.value,
    price: parseFloat(els.itemPrice.value),
    description: els.itemDescription.value,
    images: state.draftImages,
    currency: 'USD',
  };

  state.saving = true;
  els.saveBtn.disabled = true;
  els.saveBtn.textContent = 'Saving...';

  try {
    if (state.editingId) {
      await updateProduct(state.editingId, payload);
      showToast('Item updated! Customers can see the changes now.');
    } else {
      await createProduct(payload);
      showToast('New item added to your store!');
    }
    await loadCatalog();
    closeEditor();
  } catch (err) {
    showError(els.editError, err.message);
  } finally {
    state.saving = false;
    els.saveBtn.disabled = false;
    els.saveBtn.textContent = 'Save Item';
  }
}

async function handleDelete() {
  if (!state.editingId) return;
  const product = state.products.find((p) => p.id === state.editingId);
  if (!product) return;

  const confirmed = window.confirm(
    `Remove "${product.name}" from the store?\n\nThis cannot be undone.`
  );
  if (!confirmed) return;

  try {
    await deleteProduct(state.editingId);
    showToast('Item removed from your store.');
    await loadCatalog();
    closeEditor();
  } catch (err) {
    showError(els.editError, err.message);
  }
}

async function init() {
  if (window.location.protocol === 'file:') {
    showError(
      els.loginError,
      'Open http://localhost:3000/admin.html instead of the file on your computer. Run npm run dev first.'
    );
    els.loginForm.querySelector('button[type="submit"]').disabled = true;
  }

  try {
    const { loggedIn } = await checkAuth();
    setView(loggedIn);
    if (loggedIn) await loadCatalog();
  } catch {
    setView(false);
  }

  els.loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError(els.loginError, '');
    const passwordInput = document.getElementById('password');
    const submitBtn = els.loginForm.querySelector('button[type="submit"]');
    const password = passwordInput.value.trim();

    if (!password) {
      showError(els.loginError, 'Please enter your password.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    try {
      await login(password);
      setView(true);
      await loadCatalog();
      passwordInput.value = '';
    } catch (err) {
      showError(els.loginError, err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });

  els.logoutBtn.addEventListener('click', async () => {
    await logout();
    setView(false);
  });

  els.addBtn.addEventListener('click', () => openEditor());
  els.editClose.addEventListener('click', closeEditor);
  els.editBackdrop.addEventListener('click', closeEditor);
  els.cancelBtn.addEventListener('click', closeEditor);
  els.editForm.addEventListener('submit', handleSave);
  els.deleteBtn.addEventListener('click', handleDelete);

  els.photoInput.addEventListener('change', async () => {
    if (els.photoInput.files?.length) {
      await handlePhotoUpload([...els.photoInput.files]);
      els.photoInput.value = '';
    }
  });
}

init();
