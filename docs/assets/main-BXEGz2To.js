import{f as F}from"./api-C0awQeH6.js";const A=[{brand:"Arc'teryx",image:"https://cdn11.bigcommerce.com/s-186hk/images/stencil/1280x1280/products/118329/218521/arcteryx-beta-ar-womens-nightscape-glacial-jacket-2026-model__56387.1760484917.jpg?c=2",alt:"Arc'teryx 户外冲锋衣"},{brand:"Lululemon",image:"https://jingdaily.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ff8lauh0h%2Fproduction%2Fe2a9fa6e1c8e1d98044e35dfddc5f806ed7b6e44-1119x743.png%3Fq%3D90%26fit%3Dmax%26auto%3Dformat&w=3840&q=90",alt:"Lululemon 运动瑜伽服"},{brand:"Coach",image:"https://coach.scene7.com/is/image/Coach/ch857_b4ha_a0?$desktopProductZoom$",alt:"Coach 皮革手袋"},{brand:"Michael Kors",image:"https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80",alt:"Michael Kors 时尚手袋"},{brand:"Lululemon",image:"https://image1.commarts.com/images1/7/6/6/1/1/1166758_102_1160_MTE0MDg1MzIwNDE2OTAxNzMwNTY.jpg",alt:"Lululemon 运动瑜伽服"},{brand:"Canada Goose",image:"https://torontolife.mblycdn.com/tl/resized/2023/11/w1280/Canada-Goose-Inline.png",alt:"Canada Goose 加拿大鹅"},{brand:"Patagonia",image:"https://cdn.prod.website-files.com/64830736e7f43d491d70ef30/64bfca4677234d4b48101c39_64a57f12b9a3a4d896655703_64a2cf04c94179e6494ef328_Business_Model_Examples-Patagonia.webp",alt:"Patagonia 户外服饰"},{brand:"Coach",image:"https://cdn.mos.cms.futurecdn.net/ut7KAUULaU75XwxykV2ECj.jpg",alt:"Coach 皮革手袋"},{brand:"FOSSIL",image:"https://fossil.scene7.com/is/image/FossilPartners/ZB11197124_onmodel?$sfcc_onmodel_xlarge$",alt:"FOSSIL 时尚手表"}],N=[...new Set(A.map(e=>e.brand))],f={welcome:"欢迎来到【加拿大优选生活馆】",description:"专注于加拿大本地品牌及热门商品代购，所有商品均来自加拿大卡尔加里正规商场品牌专卖店及 Costco 等正规渠道。",note:"本网站仅供浏览展示，下单请直接联系微信。微信ID：tieyingtu"},B={left:{brand:"Jamieson",image:"https://www.ccmpcapital.com/wp-content/uploads/2016/06/Jamieson-New-Products-300-dpi-3.jpg",alt:"Jamieson 维生素与保健品"},right:{brand:"Estee Lauder",image:"https://m.esteelauder-me.com/media/export/cms/splashpage/splashpage_module_3_a.jpg",alt:"Estee Lauder 护肤产品"}};let h=[],$=[];const i={activeCategory:null,activeBrand:null,openProductId:null},n={sidebar:document.getElementById("sidebar"),sidebarOverlay:document.getElementById("sidebar-overlay"),sidebarNav:document.getElementById("sidebar-nav"),sidebarClose:document.getElementById("sidebar-close"),menuBtn:document.getElementById("menu-btn"),categoryHero:document.getElementById("category-hero"),productsContainer:document.getElementById("products-container"),productModal:document.getElementById("product-modal"),modalBackdrop:document.getElementById("modal-backdrop"),modalClose:document.getElementById("modal-close"),modalContent:document.getElementById("modal-content"),topbarBrands:document.getElementById("topbar-brands"),brandGalleryTrack:document.getElementById("brand-gallery-track"),healthPosterLeft:document.getElementById("health-poster-left"),healthPosterRight:document.getElementById("health-poster-right"),storeIntroCenter:document.getElementById("store-intro-center")};function T(e,t="CNY"){return new Intl.NumberFormat("zh-CN",{style:"currency",currency:t}).format(e)}function C(e){return h.find(t=>t.id===e)}function w(e){return $.filter(t=>t.categoryId===e)}function O(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function S(e){return(e??"").trim().toLowerCase()}function _(e,t){return S(e)===S(t)}function x(e){var t;return[...((t=C(e))==null?void 0:t.brands)??[]]}function R(e,t){return w(e).filter(a=>a.brand&&_(a.brand,t))}function H(e,t){const a=t.toLowerCase().replace(/['']/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");return`brand-${e}-${a}`}function z(e){return $.find(t=>t.id===e)}function D(){n.productsContainer.innerHTML=`
    <div class="empty-state">
      <p>正在加载店铺…</p>
    </div>
  `}function G(){n.productsContainer.innerHTML=`
    <div class="empty-state">
      <p>店铺加载失败，请稍后再试。</p>
    </div>
  `}function X(e,t,{copies:a=2}={}){if(!e)return;const r=c=>`
    <div class="brand-gallery-item">
      <img src="${c.image}" alt="${c.alt}" loading="lazy" draggable="false" />
      <span class="brand-gallery-label">${c.brand}</span>
    </div>
  `,o=t.map(r).join("");e.innerHTML=o.repeat(a),e.dataset.copies=String(a)}function J(){n.topbarBrands&&(n.topbarBrands.textContent=N.join(" | "))}function I(e,t){!e||!t||(e.innerHTML=`
    <div class="health-poster-card brand-gallery-item">
      <img src="${t.image}" alt="${t.alt}" loading="lazy" draggable="false" />
      <span class="brand-gallery-label">${t.brand}</span>
    </div>
  `)}function K(){if(I(n.healthPosterLeft,B.left),I(n.healthPosterRight,B.right),!n.storeIntroCenter)return;const e="";n.storeIntroCenter.innerHTML=`
    <div class="store-intro-copy">
      <p class="store-intro-welcome">${f.welcome}</p>
      <p class="store-intro-description">${f.description}</p>
    </div>
    <div class="store-intro-contact">
      ${e}
      <p class="store-intro-contact-note">${f.note}</p>
    </div>
  `}function U(){X(n.brandGalleryTrack,A)}function v(){n.sidebarNav.innerHTML=h.map(e=>{const t=x(e.id),a=e.id===i.activeCategory&&!i.activeBrand,r=t.map(o=>{const c=R(e.id,o).length;return`
          <button
            class="nav-brand-item ${e.id===i.activeCategory&&i.activeBrand===o?"active":""}"
            type="button"
            data-category="${e.id}"
            data-brand="${O(o)}"
          >
            <span class="nav-brand-label">${o}</span>
            <span class="nav-count">${c}</span>
          </button>
        `}).join("");return`
        <div class="nav-group">
          <button
            class="nav-item ${a?"active":""}"
            data-category="${e.id}"
            type="button"
          >
            <span class="nav-icon" aria-hidden="true">${e.icon}</span>
            <span class="nav-label">${e.name}</span>
            <span class="nav-count">${w(e.id).length}</span>
          </button>
          ${t.length?`<div class="nav-brands">${r}</div>`:""}
        </div>
      `}).join(""),n.sidebarNav.querySelectorAll(".nav-item").forEach(e=>{e.addEventListener("click",()=>{Q(e.dataset.category),g()})}),n.sidebarNav.querySelectorAll(".nav-brand-item").forEach(e=>{e.addEventListener("click",()=>{W(e.dataset.category,e.dataset.brand)})})}function Y(){n.sidebar.classList.add("open"),n.sidebarOverlay.classList.add("visible"),n.menuBtn.setAttribute("aria-expanded","true"),document.body.classList.add("sidebar-open")}function g(){n.sidebar.classList.remove("open"),n.sidebarOverlay.classList.remove("visible"),n.menuBtn.setAttribute("aria-expanded","false"),document.body.classList.remove("sidebar-open")}function j(e,{compact:t=!1}={}){const a=`slide-${Math.random().toString(36).slice(2,9)}`,r=e.map((u,s)=>`
    <div class="slide ${s===0?"active":""}" data-index="${s}">
      <img src="${u}" alt="" loading="${s===0?"eager":"lazy"}" draggable="false" />
    </div>
  `).join(""),o=e.length>1?`<div class="slide-dots">${e.map((u,s)=>`<button class="slide-dot ${s===0?"active":""}" data-index="${s}" aria-label="查看第 ${s+1} 张图片" type="button"></button>`).join("")}</div>`:"",c=e.length>1?`
    <button class="slide-btn slide-prev" aria-label="上一张图片" type="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="slide-btn slide-next" aria-label="下一张图片" type="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  `:"";return{html:`
    <div class="slideshow ${t?"slideshow--compact":""}" data-slideshow="${a}">
      <div class="slideshow-track">${r}</div>
      ${c}
      ${o}
    </div>
  `,uid:a,count:e.length}}function Z(e){const t=e.querySelector(".slideshow-track"),a=[...e.querySelectorAll(".slide")],r=[...e.querySelectorAll(".slide-dot")],o=e.querySelector(".slide-prev"),c=e.querySelector(".slide-next");if(a.length<=1)return;let d=0,u=0,s=0;function m(l){d=(l%a.length+a.length)%a.length,a.forEach((p,b)=>p.classList.toggle("active",b===d)),r.forEach((p,b)=>p.classList.toggle("active",b===d))}o==null||o.addEventListener("click",l=>{l.stopPropagation(),m(d-1)}),c==null||c.addEventListener("click",l=>{l.stopPropagation(),m(d+1)}),r.forEach(l=>{l.addEventListener("click",p=>{p.stopPropagation(),m(Number(l.dataset.index))})}),t.addEventListener("touchstart",l=>{u=l.touches[0].clientX,s=0},{passive:!0}),t.addEventListener("touchmove",l=>{s=l.touches[0].clientX-u},{passive:!0}),t.addEventListener("touchend",()=>{Math.abs(s)>40&&m(s<0?d+1:d-1)})}function q(e=document){e.querySelectorAll("[data-slideshow]").forEach(Z)}function E(){const e=C(i.activeCategory);n.categoryHero.innerHTML=`
    <div class="hero-icon" aria-hidden="true">${e.icon}</div>
    <div class="hero-text">
      <h2>${e.name}</h2>
      <p>${e.description}</p>
    </div>
  `}function k(e){var r;const t=(r=e.images)!=null&&r.length?e.images:[],{html:a}=t.length?j(t,{compact:!0}):{html:'<div class="no-image-placeholder">暂无图片</div>'};return`
    <article class="product-card" data-product="${e.id}">
      <div class="product-card-media">${a}</div>
      <div class="product-card-body">
        <h3 class="product-name">${e.name}</h3>
        <p class="product-price">${T(e.price,e.currency)}</p>
        <button class="view-details-btn" data-product="${e.id}" type="button">
          查看详情
        </button>
      </div>
    </article>
  `}function M(e){q(e),e.querySelectorAll(".view-details-btn").forEach(t=>{t.addEventListener("click",a=>{a.stopPropagation(),P(t.dataset.product)})}),e.querySelectorAll(".product-card").forEach(t=>{t.addEventListener("click",a=>{a.target.closest(".slide-btn, .slide-dot")||P(t.dataset.product)})})}function V(e){const t=document.getElementById(H(i.activeCategory,e));if(!t)return;const a=document.querySelector(".topbar"),r=((a==null?void 0:a.offsetHeight)??0)+12,o=t.getBoundingClientRect().top+window.scrollY-r;window.scrollTo({top:o,behavior:"smooth"})}function W(e,t){const a=i.activeCategory!==e;i.activeCategory=e,i.activeBrand=t,a?(v(),E(),L()):v(),g(),requestAnimationFrame(()=>{requestAnimationFrame(()=>V(t))})}function L(){const e=i.activeCategory,t=w(e),a=x(e);if(!a.length){if(t.length===0){n.productsContainer.innerHTML=`
        <div class="empty-state">
          <p>该分类暂无商品。</p>
        </div>
      `;return}n.productsContainer.innerHTML=`<div class="products-grid">${t.map(k).join("")}</div>`,M(n.productsContainer);return}const r=new Set,o=a.map(d=>{const u=t.filter(s=>!s.brand||!_(s.brand,d)?!1:(r.add(s.id),!0));return{brand:d,products:u}}),c=t.filter(d=>!r.has(d.id));c.length&&o.push({brand:"其他",products:c,isOther:!0}),n.productsContainer.innerHTML=o.map(({brand:d,products:u,isOther:s})=>{const m=s?`brand-${e}-other`:H(e,d),l=u.length?`<div class="products-grid">${u.map(k).join("")}</div>`:'<p class="brand-section-empty">该品牌暂无商品。</p>';return`
        <section class="brand-section" id="${m}">
          <h3 class="brand-section-title">${d}</h3>
          ${l}
        </section>
      `}).join(""),M(n.productsContainer)}function Q(e){i.activeCategory=e,i.activeBrand=null,v(),E(),L(),window.scrollTo({top:0,behavior:"smooth"})}function P(e){var o;const t=z(e);if(!t)return;i.openProductId=e;const a=(o=t.images)!=null&&o.length?t.images:[],r=a.length?j(a).html:'<div class="no-image-placeholder large">暂无图片</div>';n.modalContent.innerHTML=`
    <div class="modal-slideshow-wrap">${r}</div>
    <div class="modal-info">
      <p class="modal-category">${C(t.categoryId).name}${t.brand?` · ${t.brand}`:""}</p>
      <h2 class="modal-title">${t.name}</h2>
      <p class="modal-price">${T(t.price,t.currency)}</p>
      <p class="modal-description">${t.description}</p>
      <div class="modal-notice">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>下单请直接微信联系。</span>
      </div>
    </div>
  `,q(n.modalContent),n.productModal.classList.add("open"),n.productModal.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open")}function y(){n.productModal.classList.remove("open"),n.productModal.setAttribute("aria-hidden","true"),document.body.classList.remove("modal-open"),i.openProductId=null}function ee(){n.menuBtn.addEventListener("click",Y),n.sidebarClose.addEventListener("click",g),n.sidebarOverlay.addEventListener("click",g),n.modalClose.addEventListener("click",y),n.modalBackdrop.addEventListener("click",y),document.addEventListener("keydown",e=>{e.key==="Escape"&&(y(),g())})}async function te(){var e;J(),U(),K(),D(),ee();try{const t=await F();h=t.categories,$=t.products,i.activeCategory=(e=h[0])==null?void 0:e.id,v(),E(),L()}catch{G()}}te();
