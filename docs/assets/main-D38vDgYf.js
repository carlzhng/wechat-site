import{f as A}from"./api-BQI-HevN.js";const I=[{brand:"Arc'teryx",image:"https://cdn11.bigcommerce.com/s-186hk/images/stencil/1280x1280/products/118329/218521/arcteryx-beta-ar-womens-nightscape-glacial-jacket-2026-model__56387.1760484917.jpg?c=2",alt:"Arc'teryx 户外冲锋衣"},{brand:"Lululemon",image:"https://jingdaily.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ff8lauh0h%2Fproduction%2Fe2a9fa6e1c8e1d98044e35dfddc5f806ed7b6e44-1119x743.png%3Fq%3D90%26fit%3Dmax%26auto%3Dformat&w=3840&q=90",alt:"Lululemon 运动瑜伽服"},{brand:"Coach",image:"https://coach.scene7.com/is/image/Coach/ch857_b4ha_a0?$desktopProductZoom$",alt:"Coach 皮革手袋"},{brand:"Michael Kors",image:"https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80",alt:"Michael Kors 时尚手袋"},{brand:"Lululemon",image:"https://image1.commarts.com/images1/7/6/6/1/1/1166758_102_1160_MTE0MDg1MzIwNDE2OTAxNzMwNTY.jpg",alt:"Lululemon 运动瑜伽服"},{brand:"Canada Goose",image:"https://torontolife.mblycdn.com/tl/resized/2023/11/w1280/Canada-Goose-Inline.png",alt:"Canada Goose 加拿大鹅"},{brand:"Patagonia",image:"https://cdn.prod.website-files.com/64830736e7f43d491d70ef30/64bfca4677234d4b48101c39_64a57f12b9a3a4d896655703_64a2cf04c94179e6494ef328_Business_Model_Examples-Patagonia.webp",alt:"Patagonia 户外服饰"},{brand:"Coach",image:"https://cdn.mos.cms.futurecdn.net/ut7KAUULaU75XwxykV2ECj.jpg",alt:"Coach 皮革手袋"},{brand:"FOSSIL",image:"https://fossil.scene7.com/is/image/FossilPartners/ZB11197124_onmodel?$sfcc_onmodel_xlarge$",alt:"FOSSIL 时尚手表"}],x=[{brand:"Jamieson",image:"https://www.ccmpcapital.com/wp-content/uploads/2016/06/Jamieson-New-Products-300-dpi-3.jpg",alt:"Jamieson 维生素与保健品"},{brand:"Estee Lauder",image:"https://m.esteelauder-me.com/media/export/cms/splashpage/splashpage_module_3_a.jpg",alt:"Estee Lauder 护肤产品"},{brand:"IronKids",image:"https://www.yeswellness.com/cdn/shop/files/ironkids-gummies-omega-3-683702100072-41513153036590.jpg?v=1707154134",alt:"IronKids 儿童营养"},{brand:"Webber Naturals",image:"https://dr9wvh6oz7mzp.cloudfront.net/i/cd41fabf515a87b99fbc7d6a462bd1aa_ra,w240,h280_pa,w240,h280.png",alt:"Webber Naturals 天然保健品"},{brand:"Centrum",image:"https://www.healthcareradius.in/cloud/2022/12/27/Centrum-multi-vitamin.png",alt:"Centrum 复合维生素"},{brand:"Nature's Bounty",image:"https://naturesbounty.com/cdn/shop/collections/natures-bounty-womens-health-bg_e114edf7-5d00-4fad-b82c-426ca731cf4d.png?v=1672852973&width=750",alt:"Nature's Bounty 维生素与保健品"}];let h=[],f=[];const u={activeCategory:null,openProductId:null},a={sidebar:document.getElementById("sidebar"),sidebarOverlay:document.getElementById("sidebar-overlay"),sidebarNav:document.getElementById("sidebar-nav"),sidebarClose:document.getElementById("sidebar-close"),menuBtn:document.getElementById("menu-btn"),categoryHero:document.getElementById("category-hero"),productsGrid:document.getElementById("products-grid"),productModal:document.getElementById("product-modal"),modalBackdrop:document.getElementById("modal-backdrop"),modalClose:document.getElementById("modal-close"),modalContent:document.getElementById("modal-content"),brandGalleryTrack:document.getElementById("brand-gallery-track"),healthBrandGalleryTrack:document.getElementById("health-brand-gallery-track")};function L(e,t="CNY"){return new Intl.NumberFormat("zh-CN",{style:"currency",currency:t}).format(e)}function $(e){return h.find(t=>t.id===e)}function C(e){return f.filter(t=>t.categoryId===e)}function T(e){return f.find(t=>t.id===e)}function P(){a.productsGrid.innerHTML=`
    <div class="empty-state">
      <p>正在加载店铺…</p>
    </div>
  `}function G(){a.productsGrid.innerHTML=`
    <div class="empty-state">
      <p>店铺加载失败，请稍后再试。</p>
    </div>
  `}function w(e,t,{copies:o=2}={}){if(!e)return;const s=i=>`
    <div class="brand-gallery-item">
      <img src="${i.image}" alt="${i.alt}" loading="lazy" draggable="false" />
      <span class="brand-gallery-label">${i.brand}</span>
    </div>
  `,n=t.map(s).join("");e.innerHTML=n.repeat(o),e.dataset.copies=String(o)}function H(){w(a.brandGalleryTrack,I),w(a.healthBrandGalleryTrack,x,{copies:6})}function y(){const e=a.healthBrandGalleryTrack;if(!e)return;const t=[...e.querySelectorAll(".brand-gallery-item")],o=Number(e.dataset.copies)||4,s=t.length/o;if(!s)return;let n=0;for(let c=0;c<s;c++)n+=t[c].offsetWidth;const i=parseFloat(getComputedStyle(e).gap)||0,l=n+i*(s-1);if(!l||!e.scrollWidth){requestAnimationFrame(y);return}e.style.setProperty("--marquee-shift",`${-(l/e.scrollWidth)*100}%`)}function k(){a.sidebarNav.innerHTML=h.map(e=>`
    <button
      class="nav-item ${e.id===u.activeCategory?"active":""}"
      data-category="${e.id}"
      type="button"
    >
      <span class="nav-icon" aria-hidden="true">${e.icon}</span>
      <span class="nav-label">${e.name}</span>
      <span class="nav-count">${C(e.id).length}</span>
    </button>
  `).join(""),a.sidebarNav.querySelectorAll(".nav-item").forEach(e=>{e.addEventListener("click",()=>{F(e.dataset.category),g()})})}function N(){a.sidebar.classList.add("open"),a.sidebarOverlay.classList.add("visible"),a.menuBtn.setAttribute("aria-expanded","true"),document.body.classList.add("sidebar-open")}function g(){a.sidebar.classList.remove("open"),a.sidebarOverlay.classList.remove("visible"),a.menuBtn.setAttribute("aria-expanded","false"),document.body.classList.remove("sidebar-open")}function S(e,{compact:t=!1}={}){const o=`slide-${Math.random().toString(36).slice(2,9)}`,s=e.map((c,d)=>`
    <div class="slide ${d===0?"active":""}" data-index="${d}">
      <img src="${c}" alt="" loading="${d===0?"eager":"lazy"}" draggable="false" />
    </div>
  `).join(""),n=e.length>1?`<div class="slide-dots">${e.map((c,d)=>`<button class="slide-dot ${d===0?"active":""}" data-index="${d}" aria-label="查看第 ${d+1} 张图片" type="button"></button>`).join("")}</div>`:"",i=e.length>1?`
    <button class="slide-btn slide-prev" aria-label="上一张图片" type="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="slide-btn slide-next" aria-label="下一张图片" type="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  `:"";return{html:`
    <div class="slideshow ${t?"slideshow--compact":""}" data-slideshow="${o}">
      <div class="slideshow-track">${s}</div>
      ${i}
      ${n}
    </div>
  `,uid:o,count:e.length}}function q(e){const t=e.querySelector(".slideshow-track"),o=[...e.querySelectorAll(".slide")],s=[...e.querySelectorAll(".slide-dot")],n=e.querySelector(".slide-prev"),i=e.querySelector(".slide-next");if(o.length<=1)return;let l=0,c=0,d=0;function p(r){l=(r%o.length+o.length)%o.length,o.forEach((m,b)=>m.classList.toggle("active",b===l)),s.forEach((m,b)=>m.classList.toggle("active",b===l))}n==null||n.addEventListener("click",r=>{r.stopPropagation(),p(l-1)}),i==null||i.addEventListener("click",r=>{r.stopPropagation(),p(l+1)}),s.forEach(r=>{r.addEventListener("click",m=>{m.stopPropagation(),p(Number(r.dataset.index))})}),t.addEventListener("touchstart",r=>{c=r.touches[0].clientX,d=0},{passive:!0}),t.addEventListener("touchmove",r=>{d=r.touches[0].clientX-c},{passive:!0}),t.addEventListener("touchend",()=>{Math.abs(d)>40&&p(d<0?l+1:l-1)})}function B(e=document){e.querySelectorAll("[data-slideshow]").forEach(q)}function M(){const e=$(u.activeCategory);a.categoryHero.innerHTML=`
    <div class="hero-icon" aria-hidden="true">${e.icon}</div>
    <div class="hero-text">
      <h2>${e.name}</h2>
      <p>${e.description}</p>
    </div>
  `}function _(){const e=C(u.activeCategory);if(e.length===0){a.productsGrid.innerHTML=`
      <div class="empty-state">
        <p>该分类暂无商品。</p>
      </div>
    `;return}a.productsGrid.innerHTML=e.map(t=>{var n;const o=(n=t.images)!=null&&n.length?t.images:[],{html:s}=o.length?S(o,{compact:!0}):{html:'<div class="no-image-placeholder">暂无图片</div>'};return`
      <article class="product-card" data-product="${t.id}">
        <div class="product-card-media">${s}</div>
        <div class="product-card-body">
          <h3 class="product-name">${t.name}</h3>
          <p class="product-price">${L(t.price,t.currency)}</p>
          <button class="view-details-btn" data-product="${t.id}" type="button">
            查看详情
          </button>
        </div>
      </article>
    `}).join(""),B(a.productsGrid),a.productsGrid.querySelectorAll(".view-details-btn").forEach(t=>{t.addEventListener("click",o=>{o.stopPropagation(),E(t.dataset.product)})}),a.productsGrid.querySelectorAll(".product-card").forEach(t=>{t.addEventListener("click",o=>{o.target.closest(".slide-btn, .slide-dot")||E(t.dataset.product)})})}function F(e){u.activeCategory=e,k(),M(),_(),window.scrollTo({top:0,behavior:"smooth"})}function E(e){var n;const t=T(e);if(!t)return;u.openProductId=e;const o=(n=t.images)!=null&&n.length?t.images:[],s=o.length?S(o).html:'<div class="no-image-placeholder large">暂无图片</div>';a.modalContent.innerHTML=`
    <div class="modal-slideshow-wrap">${s}</div>
    <div class="modal-info">
      <p class="modal-category">${$(t.categoryId).name}</p>
      <h2 class="modal-title">${t.name}</h2>
      <p class="modal-price">${L(t.price,t.currency)}</p>
      <p class="modal-description">${t.description}</p>
      <div class="modal-notice">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>下单请直接微信联系。</span>
      </div>
    </div>
  `,B(a.modalContent),a.productModal.classList.add("open"),a.productModal.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open")}function v(){a.productModal.classList.remove("open"),a.productModal.setAttribute("aria-hidden","true"),document.body.classList.remove("modal-open"),u.openProductId=null}function j(){a.menuBtn.addEventListener("click",N),a.sidebarClose.addEventListener("click",g),a.sidebarOverlay.addEventListener("click",g),a.modalClose.addEventListener("click",v),a.modalBackdrop.addEventListener("click",v),document.addEventListener("keydown",e=>{e.key==="Escape"&&(v(),g())})}async function O(){var e;H(),y(),window.addEventListener("resize",y),P(),j();try{const t=await A();h=t.categories,f=t.products,u.activeCategory=(e=h[0])==null?void 0:e.id,k(),M(),_()}catch{G()}}O();
