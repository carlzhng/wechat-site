import {
  checkAuth,
  login,
  logout,
  fetchCatalog,
  uploadImage,
  createProduct,
  updateProduct,
  deleteProduct,
  addCategoryBrand,
  removeCategoryBrand,
  reorderCategoryBrands,
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
  itemBrandGroup: document.getElementById('item-brand-group'),
  itemBrand: document.getElementById('item-brand'),
  itemPrice: document.getElementById('item-price'),
  itemDescription: document.getElementById('item-description'),
  photoGrid: document.getElementById('photo-grid'),
  photoInput: document.getElementById('photo-input'),
  editError: document.getElementById('edit-error'),
  deleteBtn: document.getElementById('delete-btn'),
  cancelBtn: document.getElementById('cancel-btn'),
  saveBtn: document.getElementById('save-btn'),
  toast: document.getElementById('toast'),
  brandManagerList: document.getElementById('brand-manager-list'),
};

function formatPrice(price) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(price);
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
  return state.categories.find((c) => c.id === id)?.name ?? '未知分类';
}

function getCategoryBrands(categoryId) {
  return state.categories.find((c) => c.id === categoryId)?.brands ?? [];
}

function normalizeBrand(brand) {
  return (brand ?? '').trim().toLowerCase();
}

function brandsMatch(a, b) {
  return normalizeBrand(a) === normalizeBrand(b);
}

function resolveBrandForCategory(categoryId, brand) {
  const trimmed = (brand ?? '').trim();
  if (!trimmed) return '';
  const match = getCategoryBrands(categoryId).find((b) => brandsMatch(b, trimmed));
  return match ?? trimmed;
}

function populateBrandSelect(categoryId, selectedBrand = '') {
  const brands = getCategoryBrands(categoryId);
  const resolved = resolveBrandForCategory(categoryId, selectedBrand);

  if (!brands.length) {
    els.itemBrandGroup.hidden = true;
    els.itemBrand.required = false;
    els.itemBrand.innerHTML = '';
    return;
  }

  els.itemBrandGroup.hidden = false;
  els.itemBrand.required = true;
  els.itemBrand.innerHTML = [
    `<option value="" disabled ${resolved ? '' : 'selected'}>请选择品牌</option>`,
    ...brands.map(
      (brand) =>
        `<option value="${brand}" ${brandsMatch(brand, resolved) ? 'selected' : ''}>${brand}</option>`
    ),
  ].join('');
}

function renderAdminProductCard(product) {
  const thumb = product.images[0]
    ? `<img src="${product.images[0]}" alt="" />`
    : `<div class="no-photo">暂无图片</div>`;
  const brandLabel = product.brand
    ? product.brand
    : '<span class="admin-product-missing-brand">未分配品牌</span>';

  return `
    <article class="admin-product-card">
      <div class="admin-product-thumb">${thumb}</div>
      <div class="admin-product-info">
        <p class="admin-product-section">${getCategoryName(product.categoryId)} · ${brandLabel}</p>
        <h3>${product.name}</h3>
        <p class="admin-product-price">${formatPrice(product.price)}</p>
        <p class="admin-product-desc">${product.description || '暂无描述'}</p>
        <p class="admin-product-photos">${product.images.length} 张图片</p>
      </div>
      <button class="btn btn-secondary edit-product-btn" data-id="${product.id}" type="button">
        编辑
      </button>
    </article>
  `;
}

function renderCategoryTabs() {
  const tabs = [
    { id: 'all', name: '全部商品', icon: '📦' },
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
        <p>这里还没有商品。</p>
        <button class="btn btn-primary" type="button" id="empty-add-btn">+ 添加第一件商品</button>
      </div>
    `;
    document.getElementById('empty-add-btn')?.addEventListener('click', () => openEditor());
    return;
  }

  if (state.activeCategory !== 'all') {
    const brands = getCategoryBrands(state.activeCategory);
    if (brands.length) {
      const assigned = new Set();
      const sections = brands.map((brand) => {
        const brandProducts = items.filter((p) => {
          if (!p.brand || !brandsMatch(p.brand, brand)) return false;
          assigned.add(p.id);
          return true;
        });
        return { brand, products: brandProducts };
      });
      const otherProducts = items.filter((p) => !assigned.has(p.id));
      if (otherProducts.length) {
        sections.push({ brand: '未分配品牌', products: otherProducts });
      }

      els.productList.innerHTML = sections
        .map(
          ({ brand, products }) => `
        <section class="admin-brand-section">
          <h3 class="admin-brand-section-title">${brand}</h3>
          <div class="admin-brand-section-list">
            ${products.length ? products.map(renderAdminProductCard).join('') : '<p class="admin-brand-section-empty">该品牌暂无商品</p>'}
          </div>
        </section>
      `
        )
        .join('');
      bindEditProductButtons();
      return;
    }
  }

  els.productList.innerHTML = items.map(renderAdminProductCard).join('');
  bindEditProductButtons();
}

function bindEditProductButtons() {
  els.productList.querySelectorAll('.edit-product-btn').forEach((btn) => {
    btn.addEventListener('click', () => openEditor(btn.dataset.id));
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function encodeBrandAttr(brand) {
  return encodeURIComponent(brand);
}

function decodeBrandAttr(value) {
  return decodeURIComponent(value ?? '');
}

async function saveBrandOrder(categoryId, brands) {
  const updated = await reorderCategoryBrands(categoryId, brands);
  const index = state.categories.findIndex((c) => c.id === updated.id);
  if (index !== -1) state.categories[index] = updated;
  renderBrandManager();
}

function renderBrandManager() {
  els.brandManagerList.innerHTML = state.categories
    .map((cat) => {
      const brands = cat.brands ?? [];
      const brandChips = brands.length
        ? brands
            .map(
              (brand) => `
          <li class="brand-chip" data-brand="${encodeBrandAttr(brand)}">
            <span
              class="brand-chip-handle"
              draggable="true"
              aria-label="拖动以排序"
              title="拖动排序"
            >⠿</span>
            <span class="brand-chip-label">${escapeHtml(brand)}</span>
            <button
              class="brand-chip-remove"
              type="button"
              data-category="${cat.id}"
              data-brand="${encodeBrandAttr(brand)}"
              aria-label="删除品牌 ${escapeHtml(brand)}"
            >✕</button>
          </li>
        `
            )
            .join('')
        : '';

      const brandList = brands.length
        ? `<ul class="brand-chip-list" data-category="${cat.id}">${brandChips}</ul>`
        : '<p class="brand-manager-empty">暂无品牌，请添加。</p>';

      return `
        <article class="brand-manager-card" data-category="${cat.id}">
          <div class="brand-manager-card-header">
            <h3><span aria-hidden="true">${cat.icon}</span> ${escapeHtml(cat.name)}</h3>
            ${brands.length ? '<p class="brand-manager-hint">拖动品牌可调整侧栏显示顺序</p>' : ''}
          </div>
          ${brandList}
          <form class="brand-add-form" data-category="${cat.id}">
            <input
              class="field-input brand-add-input"
              type="text"
              placeholder="输入新品牌名称"
              maxlength="80"
              required
            />
            <button class="btn btn-secondary" type="submit">添加品牌</button>
          </form>
        </article>
      `;
    })
    .join('');

  els.brandManagerList.querySelectorAll('.brand-add-form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('.brand-add-input');
      const brand = input.value.trim();
      if (!brand) return;

      try {
        const updated = await addCategoryBrand(form.dataset.category, brand);
        const index = state.categories.findIndex((c) => c.id === updated.id);
        if (index !== -1) state.categories[index] = updated;
        renderBrandManager();
        populateBrandSelect(form.dataset.category, brand);
        showToast(`已添加品牌「${brand}」。`);
      } catch (err) {
        showToast(err.message);
      }
    });
  });

  els.brandManagerList.querySelectorAll('.brand-chip-remove').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const category = btn.dataset.category;
      const brand = decodeBrandAttr(btn.dataset.brand);
      const confirmed = window.confirm(`确定从「${getCategoryName(category)}」中删除品牌「${brand}」吗？`);
      if (!confirmed) return;

      try {
        const updated = await removeCategoryBrand(category, brand);
        const index = state.categories.findIndex((c) => c.id === updated.id);
        if (index !== -1) state.categories[index] = updated;
        renderBrandManager();
        populateBrandSelect(category);
        showToast(`已删除品牌「${brand}」。`);
      } catch (err) {
        showToast(err.message);
      }
    });
  });

  bindBrandDragAndDrop();
}

function bindBrandDragAndDrop() {
  let draggedBrand = null;
  let draggedCategoryId = null;

  els.brandManagerList.querySelectorAll('.brand-chip-list').forEach((list) => {
    const categoryId = list.dataset.category;

    list.querySelectorAll('.brand-chip').forEach((chip) => {
      const handle = chip.querySelector('.brand-chip-handle');
      if (!handle) return;

      handle.addEventListener('dragstart', (e) => {
        draggedBrand = decodeBrandAttr(chip.dataset.brand);
        draggedCategoryId = categoryId;
        chip.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedBrand);
        if (e.dataTransfer.setDragImage) {
          e.dataTransfer.setDragImage(chip, 16, 16);
        }
      });

      handle.addEventListener('dragend', () => {
        chip.classList.remove('is-dragging');
        list.querySelectorAll('.brand-chip').forEach((el) => el.classList.remove('is-drag-over'));
        draggedBrand = null;
        draggedCategoryId = null;
      });

      chip.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedCategoryId !== categoryId) return;
        list.querySelectorAll('.brand-chip').forEach((el) => el.classList.remove('is-drag-over'));
        chip.classList.add('is-drag-over');
      });

      chip.addEventListener('dragleave', () => {
        chip.classList.remove('is-drag-over');
      });

      chip.addEventListener('drop', async (e) => {
        e.preventDefault();
        chip.classList.remove('is-drag-over');
        if (draggedCategoryId !== categoryId || !draggedBrand) return;

        const targetBrand = decodeBrandAttr(chip.dataset.brand);
        if (draggedBrand === targetBrand) return;

        const chips = [...list.querySelectorAll('.brand-chip')];
        const order = chips.map((el) => decodeBrandAttr(el.dataset.brand));
        const from = order.indexOf(draggedBrand);
        const to = order.indexOf(targetBrand);
        if (from < 0 || to < 0) return;

        order.splice(from, 1);
        order.splice(to, 0, draggedBrand);

        try {
          await saveBrandOrder(categoryId, order);
          showToast('已更新品牌顺序。');
        } catch (err) {
          showToast(err.message);
          renderBrandManager();
        }
      });
    });
  });
}

function renderDashboard() {
  renderCategoryTabs();
  renderBrandManager();
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
    els.editTitle.textContent = '编辑商品';
    els.itemName.value = product.name;
    els.itemCategory.value = product.categoryId;
    populateBrandSelect(product.categoryId, product.brand ?? '');
    els.itemPrice.value = product.price;
    els.itemDescription.value = product.description ?? '';
    state.draftImages = [...product.images];
    els.deleteBtn.hidden = false;
  } else {
    els.editTitle.textContent = '新增商品';
    const defaultCategory =
      state.activeCategory !== 'all' ? state.activeCategory : state.categories[0]?.id ?? '';
    els.editForm.reset();
    els.itemCategory.value = defaultCategory;
    populateBrandSelect(defaultCategory);
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

  const categoryId = els.itemCategory.value;
  const allowedBrands = getCategoryBrands(categoryId);

  const payload = {
    name: els.itemName.value,
    categoryId,
    price: parseFloat(els.itemPrice.value),
    description: els.itemDescription.value,
    images: state.draftImages,
    currency: 'CNY',
  };

  if (allowedBrands.length) {
    const brand = resolveBrandForCategory(categoryId, els.itemBrand.value);
    if (!brand) {
      showError(els.editError, '请选择品牌。');
      return;
    }
    payload.brand = brand;
  }

  state.saving = true;
  els.saveBtn.disabled = true;
  els.saveBtn.textContent = '正在保存…';

  try {
    if (state.editingId) {
      await updateProduct(state.editingId, payload);
      showToast('已更新商品，顾客现在就能看到。');
    } else {
      await createProduct(payload);
      showToast('已新增商品！');
    }
    await loadCatalog();
    closeEditor();
  } catch (err) {
    showError(els.editError, err.message);
  } finally {
    state.saving = false;
    els.saveBtn.disabled = false;
    els.saveBtn.textContent = '保存';
  }
}

async function handleDelete() {
  if (!state.editingId) return;
  const product = state.products.find((p) => p.id === state.editingId);
  if (!product) return;

  const confirmed = window.confirm(
    `确定要删除“${product.name}”吗？\n\n删除后无法恢复。`
  );
  if (!confirmed) return;

  try {
    await deleteProduct(state.editingId);
    showToast('已删除商品。');
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
      '请打开 http://localhost:3000/admin.html（不要直接打开本地文件）。请先运行 npm run dev。'
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
      showError(els.loginError, '请输入密码。');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '正在登录…';

    try {
      await login(password);
      setView(true);
      await loadCatalog();
      passwordInput.value = '';
    } catch (err) {
      showError(els.loginError, err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '登录';
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
  els.itemCategory.addEventListener('change', () => {
    populateBrandSelect(els.itemCategory.value);
  });

  els.photoInput.addEventListener('change', async () => {
    if (els.photoInput.files?.length) {
      await handlePhotoUpload([...els.photoInput.files]);
      els.photoInput.value = '';
    }
  });
}

init();
