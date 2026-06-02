import { fetchCatalog } from './api.js';

const FASHION_BRAND_SHOWCASE = [
  {
    brand: "Arc'teryx",
    image: 'https://cdn11.bigcommerce.com/s-186hk/images/stencil/1280x1280/products/118329/218521/arcteryx-beta-ar-womens-nightscape-glacial-jacket-2026-model__56387.1760484917.jpg?c=2',
    alt: 'Arc\'teryx 户外冲锋衣',
  },
  {
    brand: 'Lululemon',
    image: 'https://jingdaily.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ff8lauh0h%2Fproduction%2Fe2a9fa6e1c8e1d98044e35dfddc5f806ed7b6e44-1119x743.png%3Fq%3D90%26fit%3Dmax%26auto%3Dformat&w=3840&q=90',
    alt: 'Lululemon 运动瑜伽服',
  },
  {
    brand: 'Coach',
    image: 'https://coach.scene7.com/is/image/Coach/ch857_b4ha_a0?$desktopProductZoom$',
    alt: 'Coach 皮革手袋',
  },
  {
    brand: 'Michael Kors',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80',
    alt: 'Michael Kors 时尚手袋',
  },
  {
    brand: 'Lululemon',
    image: 'https://image1.commarts.com/images1/7/6/6/1/1/1166758_102_1160_MTE0MDg1MzIwNDE2OTAxNzMwNTY.jpg',
    alt: 'Lululemon 运动瑜伽服',
  },
  {
    brand: 'Canada Goose',
    image: 'https://torontolife.mblycdn.com/tl/resized/2023/11/w1280/Canada-Goose-Inline.png',
    alt: 'Canada Goose 加拿大鹅',
  },
  {
    brand: 'Patagonia',
    image: 'https://cdn.prod.website-files.com/64830736e7f43d491d70ef30/64bfca4677234d4b48101c39_64a57f12b9a3a4d896655703_64a2cf04c94179e6494ef328_Business_Model_Examples-Patagonia.webp',
    alt: 'Patagonia 户外服饰',
  },
  {
    brand: 'Coach',
    image: 'https://cdn.mos.cms.futurecdn.net/ut7KAUULaU75XwxykV2ECj.jpg',
    alt: 'Coach 皮革手袋',
  },
  {
    brand: 'FOSSIL',
    image: 'https://fossil.scene7.com/is/image/FossilPartners/ZB11197124_onmodel?$sfcc_onmodel_xlarge$',
    alt: 'FOSSIL 时尚手表',
  }
];

const HEALTH_BEAUTY_SHOWCASE = [
  {
    brand: 'Jamieson',
    image: 'https://www.ccmpcapital.com/wp-content/uploads/2016/06/Jamieson-New-Products-300-dpi-3.jpg',
    alt: 'Jamieson 维生素与保健品',
  },
  {
    brand: 'Estee Lauder',
    image: 'https://m.esteelauder-me.com/media/export/cms/splashpage/splashpage_module_3_a.jpg',
    alt: 'Estee Lauder 护肤产品',
  },
  {
    brand: 'IronKids',
    image: 'https://www.yeswellness.com/cdn/shop/files/ironkids-gummies-omega-3-683702100072-41513153036590.jpg?v=1707154134',
    alt: 'IronKids 儿童营养',
  },
  {
    brand: 'Webber Naturals',
    image: 'https://dr9wvh6oz7mzp.cloudfront.net/i/cd41fabf515a87b99fbc7d6a462bd1aa_ra,w240,h280_pa,w240,h280.png',
    alt: 'Webber Naturals 天然保健品',
  },
  {
    brand: 'Centrum',
    image: 'https://www.healthcareradius.in/cloud/2022/12/27/Centrum-multi-vitamin.png',
    alt: 'Centrum 复合维生素',
  },
  {
    brand: "Nature's Bounty",
    image: 'https://naturesbounty.com/cdn/shop/collections/natures-bounty-womens-health-bg_e114edf7-5d00-4fad-b82c-426ca731cf4d.png?v=1672852973&width=750',
    alt: "Nature's Bounty 维生素与保健品",
  },
];

let categories = [];
let products = [];

const state = {
  activeCategory: null,
  openProductId: null,
};

const els = {
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay'),
  sidebarNav: document.getElementById('sidebar-nav'),
  sidebarClose: document.getElementById('sidebar-close'),
  menuBtn: document.getElementById('menu-btn'),
  categoryHero: document.getElementById('category-hero'),
  productsGrid: document.getElementById('products-grid'),
  productModal: document.getElementById('product-modal'),
  modalBackdrop: document.getElementById('modal-backdrop'),
  modalClose: document.getElementById('modal-close'),
  modalContent: document.getElementById('modal-content'),
  brandGalleryTrack: document.getElementById('brand-gallery-track'),
  healthBrandGalleryTrack: document.getElementById('health-brand-gallery-track'),
};

function formatPrice(price, currency = 'CNY') {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(price);
}

function getCategory(id) {
  return categories.find((c) => c.id === id);
}

function getProductsForCategory(categoryId) {
  return products.filter((p) => p.categoryId === categoryId);
}

function getProduct(id) {
  return products.find((p) => p.id === id);
}

function showLoading() {
  els.productsGrid.innerHTML = `
    <div class="empty-state">
      <p>正在加载店铺…</p>
    </div>
  `;
}

function showError() {
  els.productsGrid.innerHTML = `
    <div class="empty-state">
      <p>店铺加载失败，请稍后再试。</p>
    </div>
  `;
}

/* ── Brand gallery marquee ── */

function renderBrandGalleryTrack(trackEl, showcase, { copies = 2 } = {}) {
  if (!trackEl) return;

  const itemHtml = (item) => `
    <div class="brand-gallery-item">
      <img src="${item.image}" alt="${item.alt}" loading="lazy" draggable="false" />
      <span class="brand-gallery-label">${item.brand}</span>
    </div>
  `;

  const oneSet = showcase.map(itemHtml).join('');
  trackEl.innerHTML = oneSet.repeat(copies);
  trackEl.dataset.copies = String(copies);
}

function renderBrandGalleries() {
  renderBrandGalleryTrack(els.brandGalleryTrack, FASHION_BRAND_SHOWCASE);
  renderBrandGalleryTrack(els.healthBrandGalleryTrack, HEALTH_BEAUTY_SHOWCASE, { copies: 6 });
}

function syncHealthGalleryOffset() {
  const track = els.healthBrandGalleryTrack;
  if (!track) return;

  const items = [...track.querySelectorAll('.brand-gallery-item')];
  const copyCount = Number(track.dataset.copies) || 4;
  const perSet = items.length / copyCount;
  if (!perSet) return;

  let setWidth = 0;
  for (let i = 0; i < perSet; i++) setWidth += items[i].offsetWidth;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const oneSetWidth = setWidth + gap * (perSet - 1);

  if (!oneSetWidth || !track.scrollWidth) {
    requestAnimationFrame(syncHealthGalleryOffset);
    return;
  }

  track.style.setProperty(
    '--marquee-shift',
    `${-(oneSetWidth / track.scrollWidth) * 100}%`
  );
}

/* ── Sidebar ── */

function renderSidebar() {
  els.sidebarNav.innerHTML = categories
    .map(
      (cat) => `
    <button
      class="nav-item ${cat.id === state.activeCategory ? 'active' : ''}"
      data-category="${cat.id}"
      type="button"
    >
      <span class="nav-icon" aria-hidden="true">${cat.icon}</span>
      <span class="nav-label">${cat.name}</span>
      <span class="nav-count">${getProductsForCategory(cat.id).length}</span>
    </button>
  `
    )
    .join('');

  els.sidebarNav.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveCategory(btn.dataset.category);
      closeSidebar();
    });
  });
}

function openSidebar() {
  els.sidebar.classList.add('open');
  els.sidebarOverlay.classList.add('visible');
  els.menuBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('sidebar-open');
}

function closeSidebar() {
  els.sidebar.classList.remove('open');
  els.sidebarOverlay.classList.remove('visible');
  els.menuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('sidebar-open');
}

/* ── Slideshow ── */

function createSlideshow(images, { compact = false } = {}) {
  const uid = `slide-${Math.random().toString(36).slice(2, 9)}`;
  const slides = images
    .map(
      (src, i) => `
    <div class="slide ${i === 0 ? 'active' : ''}" data-index="${i}">
      <img src="${src}" alt="" loading="${i === 0 ? 'eager' : 'lazy'}" draggable="false" />
    </div>
  `
    )
    .join('');

  const dots =
    images.length > 1
      ? `<div class="slide-dots">${images.map((_, i) => `<button class="slide-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="查看第 ${i + 1} 张图片" type="button"></button>`).join('')}</div>`
      : '';

  const nav =
    images.length > 1
      ? `
    <button class="slide-btn slide-prev" aria-label="上一张图片" type="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="slide-btn slide-next" aria-label="下一张图片" type="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  `
      : '';

  const html = `
    <div class="slideshow ${compact ? 'slideshow--compact' : ''}" data-slideshow="${uid}">
      <div class="slideshow-track">${slides}</div>
      ${nav}
      ${dots}
    </div>
  `;

  return { html, uid, count: images.length };
}

function initSlideshow(container) {
  const track = container.querySelector('.slideshow-track');
  const slideEls = [...container.querySelectorAll('.slide')];
  const dots = [...container.querySelectorAll('.slide-dot')];
  const prevBtn = container.querySelector('.slide-prev');
  const nextBtn = container.querySelector('.slide-next');

  if (slideEls.length <= 1) return;

  let current = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;

  function goTo(index) {
    current = ((index % slideEls.length) + slideEls.length) % slideEls.length;
    slideEls.forEach((s, i) => s.classList.toggle('active', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    goTo(current - 1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    goTo(current + 1);
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      goTo(Number(dot.dataset.index));
    });
  });

  track.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    },
    { passive: true }
  );

  track.addEventListener(
    'touchmove',
    (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    },
    { passive: true }
  );

  track.addEventListener('touchend', () => {
    if (Math.abs(touchDeltaX) > 40) {
      goTo(touchDeltaX < 0 ? current + 1 : current - 1);
    }
  });
}

function initAllSlideshows(root = document) {
  root.querySelectorAll('[data-slideshow]').forEach(initSlideshow);
}

/* ── Product grid ── */

function renderCategoryHero() {
  const cat = getCategory(state.activeCategory);
  els.categoryHero.innerHTML = `
    <div class="hero-icon" aria-hidden="true">${cat.icon}</div>
    <div class="hero-text">
      <h2>${cat.name}</h2>
      <p>${cat.description}</p>
    </div>
  `;
}

function renderProducts() {
  const items = getProductsForCategory(state.activeCategory);

  if (items.length === 0) {
    els.productsGrid.innerHTML = `
      <div class="empty-state">
        <p>该分类暂无商品。</p>
      </div>
    `;
    return;
  }

  els.productsGrid.innerHTML = items
    .map((product) => {
      const imgs = product.images?.length ? product.images : [];
      const { html } = imgs.length
        ? createSlideshow(imgs, { compact: true })
        : { html: '<div class="no-image-placeholder">暂无图片</div>' };
      return `
      <article class="product-card" data-product="${product.id}">
        <div class="product-card-media">${html}</div>
        <div class="product-card-body">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">${formatPrice(product.price, product.currency)}</p>
          <button class="view-details-btn" data-product="${product.id}" type="button">
            查看详情
          </button>
        </div>
      </article>
    `;
    })
    .join('');

  initAllSlideshows(els.productsGrid);

  els.productsGrid.querySelectorAll('.view-details-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProductModal(btn.dataset.product);
    });
  });

  els.productsGrid.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.slide-btn, .slide-dot')) return;
      openProductModal(card.dataset.product);
    });
  });
}

function setActiveCategory(categoryId) {
  state.activeCategory = categoryId;
  renderSidebar();
  renderCategoryHero();
  renderProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Product modal ── */

function openProductModal(productId) {
  const product = getProduct(productId);
  if (!product) return;

  state.openProductId = productId;
  const imgs = product.images?.length ? product.images : [];
  const slideshowHtml = imgs.length
    ? createSlideshow(imgs).html
    : '<div class="no-image-placeholder large">暂无图片</div>';

  els.modalContent.innerHTML = `
    <div class="modal-slideshow-wrap">${slideshowHtml}</div>
    <div class="modal-info">
      <p class="modal-category">${getCategory(product.categoryId).name}</p>
      <h2 class="modal-title">${product.name}</h2>
      <p class="modal-price">${formatPrice(product.price, product.currency)}</p>
      <p class="modal-description">${product.description}</p>
      <div class="modal-notice">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>下单请直接微信联系。</span>
      </div>
    </div>
  `;

  initAllSlideshows(els.modalContent);

  els.productModal.classList.add('open');
  els.productModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeProductModal() {
  els.productModal.classList.remove('open');
  els.productModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  state.openProductId = null;
}

function bindEvents() {
  els.menuBtn.addEventListener('click', openSidebar);
  els.sidebarClose.addEventListener('click', closeSidebar);
  els.sidebarOverlay.addEventListener('click', closeSidebar);
  els.modalClose.addEventListener('click', closeProductModal);
  els.modalBackdrop.addEventListener('click', closeProductModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeSidebar();
    }
  });
}

async function init() {
  renderBrandGalleries();
  syncHealthGalleryOffset();
  window.addEventListener('resize', syncHealthGalleryOffset);
  showLoading();
  bindEvents();

  try {
    const catalog = await fetchCatalog();
    categories = catalog.categories;
    products = catalog.products;
    state.activeCategory = categories[0]?.id;
    renderSidebar();
    renderCategoryHero();
    renderProducts();
  } catch {
    showError();
  }
}

init();
