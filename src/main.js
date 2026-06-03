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

const STORE_NAME = '加拿大优选生活馆';

const STORE_BRANDS = [
  ...new Set(FASHION_BRAND_SHOWCASE.map((item) => item.brand)),
];

const STORE_INFO = {
  welcome: '欢迎来到【加拿大优选生活馆】',
  description:
    '专注于加拿大本地品牌及热门商品代购，所有商品均来自加拿大卡尔加里正规商场品牌专卖店及 Costco 等正规渠道。',
  wechat: '',
  note: '本网站仅供浏览展示，下单请直接联系微信。微信ID：tieyingtu',
};

const STORE_INTRO_POSTERS = {
  left: {
    brand: 'Jamieson',
    image: 'https://www.ccmpcapital.com/wp-content/uploads/2016/06/Jamieson-New-Products-300-dpi-3.jpg',
    alt: 'Jamieson 维生素与保健品',
  },
  right: {
    brand: 'Estee Lauder',
    image: 'https://m.esteelauder-me.com/media/export/cms/splashpage/splashpage_module_3_a.jpg',
    alt: 'Estee Lauder 护肤产品',
  },
};

const HEALTH_BEAUTY_SHOWCASE = [
  STORE_INTRO_POSTERS.left,
  STORE_INTRO_POSTERS.right,
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
  activeBrand: null,
  openProductId: null,
};

const els = {
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay'),
  sidebarNav: document.getElementById('sidebar-nav'),
  sidebarClose: document.getElementById('sidebar-close'),
  menuBtn: document.getElementById('menu-btn'),
  categoryHero: document.getElementById('category-hero'),
  productsContainer: document.getElementById('products-container'),
  productModal: document.getElementById('product-modal'),
  modalBackdrop: document.getElementById('modal-backdrop'),
  modalClose: document.getElementById('modal-close'),
  modalContent: document.getElementById('modal-content'),
  topbarBrands: document.getElementById('topbar-brands'),
  brandGalleryTrack: document.getElementById('brand-gallery-track'),
  healthPosterLeft: document.getElementById('health-poster-left'),
  healthPosterRight: document.getElementById('health-poster-right'),
  storeIntroCenter: document.getElementById('store-intro-center'),
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

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeBrand(brand) {
  return (brand ?? '').trim().toLowerCase();
}

function brandsMatch(a, b) {
  return normalizeBrand(a) === normalizeBrand(b);
}

function getCategoryBrands(categoryId) {
  return [...(getCategory(categoryId)?.brands ?? [])];
}

function getProductsForBrand(categoryId, brand) {
  return getProductsForCategory(categoryId).filter(
    (p) => p.brand && brandsMatch(p.brand, brand)
  );
}

function brandAnchorId(categoryId, brand) {
  const slug = brand
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `brand-${categoryId}-${slug}`;
}

function getProduct(id) {
  return products.find((p) => p.id === id);
}

function showLoading() {
  els.productsContainer.innerHTML = `
    <div class="empty-state">
      <p>正在加载店铺…</p>
    </div>
  `;
}

function showError() {
  els.productsContainer.innerHTML = `
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

function renderTopbarBrands() {
  if (!els.topbarBrands) return;
  els.topbarBrands.textContent = STORE_BRANDS.join(' | ');
}

function renderHealthPoster(posterEl, item) {
  if (!posterEl || !item) return;

  posterEl.innerHTML = `
    <div class="health-poster-card brand-gallery-item">
      <img src="${item.image}" alt="${item.alt}" loading="lazy" draggable="false" />
      <span class="brand-gallery-label">${item.brand}</span>
    </div>
  `;
}

function renderStoreIntro() {
  renderHealthPoster(els.healthPosterLeft, STORE_INTRO_POSTERS.left);
  renderHealthPoster(els.healthPosterRight, STORE_INTRO_POSTERS.right);

  if (!els.storeIntroCenter) return;

  const wechatBlock = STORE_INFO.wechat
    ? `
      <p class="store-intro-contact-item">
        <span class="store-intro-contact-label">微信</span>
        <span>${STORE_INFO.wechat}</span>
      </p>`
    : '';

  els.storeIntroCenter.innerHTML = `
    <div class="store-intro-copy">
      <p class="store-intro-welcome">${STORE_INFO.welcome}</p>
      <p class="store-intro-description">${STORE_INFO.description}</p>
    </div>
    <div class="store-intro-contact">
      ${wechatBlock}
      <p class="store-intro-contact-note">${STORE_INFO.note}</p>
    </div>
  `;
}

function renderBrandGalleries() {
  renderBrandGalleryTrack(els.brandGalleryTrack, FASHION_BRAND_SHOWCASE);
}

/* ── Sidebar ── */

function renderSidebar() {
  els.sidebarNav.innerHTML = categories
    .map((cat) => {
      const brands = getCategoryBrands(cat.id);
      const isCategoryActive =
        cat.id === state.activeCategory && !state.activeBrand;
      const brandItems = brands
        .map((brand) => {
          const count = getProductsForBrand(cat.id, brand).length;
          const isBrandActive =
            cat.id === state.activeCategory && state.activeBrand === brand;
          return `
          <button
            class="nav-brand-item ${isBrandActive ? 'active' : ''}"
            type="button"
            data-category="${cat.id}"
            data-brand="${escapeHtml(brand)}"
          >
            <span class="nav-brand-label">${brand}</span>
            <span class="nav-count">${count}</span>
          </button>
        `;
        })
        .join('');

      return `
        <div class="nav-group">
          <button
            class="nav-item ${isCategoryActive ? 'active' : ''}"
            data-category="${cat.id}"
            type="button"
          >
            <span class="nav-icon" aria-hidden="true">${cat.icon}</span>
            <span class="nav-label">${cat.name}</span>
            <span class="nav-count">${getProductsForCategory(cat.id).length}</span>
          </button>
          ${brands.length ? `<div class="nav-brands">${brandItems}</div>` : ''}
        </div>
      `;
    })
    .join('');

  els.sidebarNav.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveCategory(btn.dataset.category);
      closeSidebar();
    });
  });

  els.sidebarNav.querySelectorAll('.nav-brand-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      navigateToBrand(btn.dataset.category, btn.dataset.brand);
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

function renderProductCard(product) {
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
}

function bindProductCards(root) {
  initAllSlideshows(root);

  root.querySelectorAll('.view-details-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProductModal(btn.dataset.product);
    });
  });

  root.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.slide-btn, .slide-dot')) return;
      openProductModal(card.dataset.product);
    });
  });
}

function scrollToBrand(brand) {
  const target = document.getElementById(brandAnchorId(state.activeCategory, brand));
  if (!target) return;

  const topbar = document.querySelector('.topbar');
  const offset = (topbar?.offsetHeight ?? 0) + 12;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

function navigateToBrand(categoryId, brand) {
  const needsRender = state.activeCategory !== categoryId;
  state.activeCategory = categoryId;
  state.activeBrand = brand;

  if (needsRender) {
    renderSidebar();
    renderCategoryHero();
    renderProducts();
  } else {
    renderSidebar();
  }

  closeSidebar();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => scrollToBrand(brand));
  });
}

function renderProducts() {
  const categoryId = state.activeCategory;
  const items = getProductsForCategory(categoryId);
  const brands = getCategoryBrands(categoryId);

  if (!brands.length) {
    if (items.length === 0) {
      els.productsContainer.innerHTML = `
        <div class="empty-state">
          <p>该分类暂无商品。</p>
        </div>
      `;
      return;
    }

    els.productsContainer.innerHTML = `<div class="products-grid">${items.map(renderProductCard).join('')}</div>`;
    bindProductCards(els.productsContainer);
    return;
  }

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
    sections.push({ brand: '其他', products: otherProducts, isOther: true });
  }

  els.productsContainer.innerHTML = sections
    .map(({ brand, products: brandProducts, isOther }) => {
      const sectionId = isOther
        ? `brand-${categoryId}-other`
        : brandAnchorId(categoryId, brand);
      const gridHtml = brandProducts.length
        ? `<div class="products-grid">${brandProducts.map(renderProductCard).join('')}</div>`
        : `<p class="brand-section-empty">该品牌暂无商品。</p>`;

      return `
        <section class="brand-section" id="${sectionId}">
          <h3 class="brand-section-title">${brand}</h3>
          ${gridHtml}
        </section>
      `;
    })
    .join('');

  bindProductCards(els.productsContainer);
}

function setActiveCategory(categoryId) {
  state.activeCategory = categoryId;
  state.activeBrand = null;
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
      <p class="modal-category">${getCategory(product.categoryId).name}${product.brand ? ` · ${product.brand}` : ''}</p>
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
  renderTopbarBrands();
  renderBrandGalleries();
  renderStoreIntro();
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
