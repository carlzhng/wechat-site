import{c as O,l as R,e as U,f as z,u as Y,b as V,d as J,i as K,a as Q,r as W,g as X,h as Z}from"./api-BTxM49HL.js";const d={loggedIn:!1,categories:[],products:[],activeCategory:"all",editingId:null,draftImages:[],saving:!1},n={loginScreen:document.getElementById("login-screen"),loginForm:document.getElementById("login-form"),loginError:document.getElementById("login-error"),dashboard:document.getElementById("dashboard"),logoutBtn:document.getElementById("logout-btn"),categoryTabs:document.getElementById("category-tabs"),productList:document.getElementById("product-list"),addBtn:document.getElementById("add-btn"),editModal:document.getElementById("edit-modal"),editBackdrop:document.getElementById("edit-backdrop"),editClose:document.getElementById("edit-close"),editTitle:document.getElementById("edit-title"),editForm:document.getElementById("edit-form"),itemName:document.getElementById("item-name"),itemCategory:document.getElementById("item-category"),itemBrandGroup:document.getElementById("item-brand-group"),itemBrand:document.getElementById("item-brand"),itemPrice:document.getElementById("item-price"),itemDescription:document.getElementById("item-description"),photoGrid:document.getElementById("photo-grid"),photoInput:document.getElementById("photo-input"),editError:document.getElementById("edit-error"),deleteBtn:document.getElementById("delete-btn"),cancelBtn:document.getElementById("cancel-btn"),saveBtn:document.getElementById("save-btn"),toast:document.getElementById("toast"),brandManagerList:document.getElementById("brand-manager-list")};function _(e){return new Intl.NumberFormat("zh-CN",{style:"currency",currency:"CNY"}).format(e)}function u(e){n.toast.textContent=e,n.toast.hidden=!1,n.toast.classList.add("show"),setTimeout(()=>{n.toast.classList.remove("show"),setTimeout(()=>{n.toast.hidden=!0},300)},3e3)}function p(e,t){t?(e.textContent=t,e.hidden=!1):(e.hidden=!0,e.textContent="")}function L(e){d.loggedIn=e,n.loginScreen.hidden=e,n.dashboard.hidden=!e}async function T(){const e=await z();d.categories=e.categories,d.products=e.products,d.activeCategory==="all"&&d.categories.length,j()}function I(e){d.categories=e.categories,d.products=e.products,j()}function ee(){return d.activeCategory==="all"?d.products:d.products.filter(e=>e.categoryId===d.activeCategory)}function H(e){var t;return((t=d.categories.find(a=>a.id===e))==null?void 0:t.name)??"未知分类"}function B(e){var t;return((t=d.categories.find(a=>a.id===e))==null?void 0:t.brands)??[]}function q(e){return(e??"").trim().toLowerCase()}function x(e,t){return q(e)===q(t)}function N(e,t){const a=(t??"").trim();return a?B(e).find(r=>x(r,a))??a:""}function h(e,t=""){const a=B(e),o=N(e,t);if(!a.length){n.itemBrandGroup.hidden=!0,n.itemBrand.required=!1,n.itemBrand.innerHTML="";return}n.itemBrandGroup.hidden=!1,n.itemBrand.required=!0,n.itemBrand.innerHTML=[`<option value="" disabled ${o?"":"selected"}>请选择品牌</option>`,...a.map(r=>`<option value="${r}" ${x(r,o)?"selected":""}>${r}</option>`)].join("")}function F(e,{sortable:t=!1}={}){const a=e.images[0]?`<img src="${e.images[0]}" alt="" />`:'<div class="no-photo">暂无图片</div>',o=e.brand?e.brand:'<span class="admin-product-missing-brand">未分配品牌</span>',r=t?'<span class="admin-product-handle" draggable="true" aria-label="拖动以排序" title="拖动排序">⠿</span>':"";return`
    <article class="admin-product-card" data-id="${e.id}">
      ${r}
      <div class="admin-product-thumb">${a}</div>
      <div class="admin-product-info">
        <p class="admin-product-section">${H(e.categoryId)} · ${o}</p>
        <h3>${e.name}</h3>
        <p class="admin-product-price">${_(e.price)}</p>
        <p class="admin-product-desc">${e.description||"暂无描述"}</p>
        <p class="admin-product-photos">${e.images.length} 张图片</p>
      </div>
      <button class="btn btn-secondary edit-product-btn" data-id="${e.id}" type="button">
        编辑
      </button>
    </article>
  `}function G(){const e=[{id:"all",name:"全部商品",icon:"📦"},...d.categories.map(t=>({id:t.id,name:t.name,icon:t.icon}))];n.categoryTabs.innerHTML=e.map(t=>`
    <button
      class="category-tab ${t.id===d.activeCategory?"active":""}"
      data-category="${t.id}"
      type="button"
    >
      <span aria-hidden="true">${t.icon}</span> ${t.name}
    </button>
  `).join(""),n.categoryTabs.querySelectorAll(".category-tab").forEach(t=>{t.addEventListener("click",()=>{d.activeCategory=t.dataset.category,G(),A()})})}async function te(e,t,a){const{catalog:o}=await Z(e,a,t);I(o)}function M(e,t,a,o){const r=t!==void 0?` data-brand="${S(t)}"`:"";return`
    <div class="admin-product-sort-list" data-category="${e}"${r}>
      ${a.map(i=>F(i,{sortable:o})).join("")}
    </div>
  `}function A(){var o;const e=ee(),t=d.activeCategory!=="all",a=t?'<p class="product-sort-hint">拖动商品左侧 ⠿ 可调整在店铺中的显示顺序。</p>':'<p class="product-sort-hint">选择具体分类后可拖动商品调整显示顺序。</p>';if(e.length===0){n.productList.innerHTML=`
      ${a}
      <div class="empty-list">
        <p>这里还没有商品。</p>
        <button class="btn btn-primary" type="button" id="empty-add-btn">+ 添加第一件商品</button>
      </div>
    `,(o=document.getElementById("empty-add-btn"))==null||o.addEventListener("click",()=>D());return}if(d.activeCategory!=="all"){const r=B(d.activeCategory);if(r.length){const i=new Set,s=r.map(l=>{const m=e.filter(g=>!g.brand||!x(g.brand,l)?!1:(i.add(g.id),!0));return{brand:l,products:m}}),c=e.filter(l=>!i.has(l.id));c.length&&s.push({brand:"未分配品牌",products:c}),n.productList.innerHTML=a+s.map(({brand:l,products:m})=>`
        <section class="admin-brand-section">
          <h3 class="admin-brand-section-title">${l}</h3>
          ${m.length?M(d.activeCategory,l,m,t):'<p class="admin-brand-section-empty">该品牌暂无商品</p>'}
        </section>
      `).join(""),P(),t&&k();return}}d.activeCategory!=="all"?n.productList.innerHTML=a+M(d.activeCategory,void 0,e,t):n.productList.innerHTML=a+e.map(r=>F(r,{sortable:!1})).join(""),P(),t&&k()}function P(){n.productList.querySelectorAll(".edit-product-btn").forEach(e=>{e.addEventListener("click",()=>D(e.dataset.id))})}function k(){let e=null,t=null;n.productList.querySelectorAll(".admin-product-sort-list").forEach(a=>{const o=a.dataset.category,r=a.dataset.brand!==void 0?b(a.dataset.brand):void 0;a.querySelectorAll(".admin-product-card").forEach(i=>{const s=i.querySelector(".admin-product-handle");s&&(s.addEventListener("dragstart",c=>{e=i.dataset.id,t=a,i.classList.add("is-dragging"),c.dataTransfer.effectAllowed="move",c.dataTransfer.setData("text/plain",e),c.dataTransfer.setDragImage&&c.dataTransfer.setDragImage(i,24,24)}),s.addEventListener("dragend",()=>{i.classList.remove("is-dragging"),a.querySelectorAll(".admin-product-card").forEach(c=>c.classList.remove("is-drag-over")),e=null,t=null}),i.addEventListener("dragover",c=>{c.preventDefault(),c.dataTransfer.dropEffect="move",t===a&&(a.querySelectorAll(".admin-product-card").forEach(l=>l.classList.remove("is-drag-over")),i.classList.add("is-drag-over"))}),i.addEventListener("dragleave",()=>{i.classList.remove("is-drag-over")}),i.addEventListener("drop",async c=>{if(c.preventDefault(),i.classList.remove("is-drag-over"),t!==a||!e)return;const l=i.dataset.id;if(e===l)return;const g=[...a.querySelectorAll(".admin-product-card")].map($=>$.dataset.id),v=g.indexOf(e),f=g.indexOf(l);if(!(v<0||f<0)){g.splice(v,1),g.splice(f,0,e);try{await te(o,r,g),u("已更新商品顺序。")}catch($){u($.message),A()}}}))})})}function w(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function S(e){return encodeURIComponent(e)}function b(e){return decodeURIComponent(e??"")}async function ae(e,t){const a=await X(e,t),o=d.categories.findIndex(r=>r.id===a.id);o!==-1&&(d.categories[o]=a),E()}function E(){n.brandManagerList.innerHTML=d.categories.map(e=>{const t=e.brands??[],a=t.length?t.map(r=>`
          <li class="brand-chip" data-brand="${S(r)}">
            <span
              class="brand-chip-handle"
              draggable="true"
              aria-label="拖动以排序"
              title="拖动排序"
            >⠿</span>
            <span class="brand-chip-label">${w(r)}</span>
            <button
              class="brand-chip-remove"
              type="button"
              data-category="${e.id}"
              data-brand="${S(r)}"
              aria-label="删除品牌 ${w(r)}"
            >✕</button>
          </li>
        `).join(""):"",o=t.length?`<ul class="brand-chip-list" data-category="${e.id}">${a}</ul>`:'<p class="brand-manager-empty">暂无品牌，请添加。</p>';return`
        <article class="brand-manager-card" data-category="${e.id}">
          <div class="brand-manager-card-header">
            <h3><span aria-hidden="true">${e.icon}</span> ${w(e.name)}</h3>
            ${t.length?'<p class="brand-manager-hint">拖动品牌可调整侧栏显示顺序</p>':""}
          </div>
          ${o}
          <form class="brand-add-form" data-category="${e.id}">
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
      `}).join(""),n.brandManagerList.querySelectorAll(".brand-add-form").forEach(e=>{e.addEventListener("submit",async t=>{t.preventDefault();const o=e.querySelector(".brand-add-input").value.trim();if(o)try{const r=await Q(e.dataset.category,o),i=d.categories.findIndex(s=>s.id===r.id);i!==-1&&(d.categories[i]=r),E(),h(e.dataset.category,o),u(`已添加品牌「${o}」。`)}catch(r){u(r.message)}})}),n.brandManagerList.querySelectorAll(".brand-chip-remove").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const a=e.dataset.category,o=b(e.dataset.brand);if(window.confirm(`确定从「${H(a)}」中删除品牌「${o}」吗？`))try{const i=await W(a,o),s=d.categories.findIndex(c=>c.id===i.id);s!==-1&&(d.categories[s]=i),E(),h(a),u(`已删除品牌「${o}」。`)}catch(i){u(i.message)}})}),ne()}function ne(){let e=null,t=null;n.brandManagerList.querySelectorAll(".brand-chip-list").forEach(a=>{const o=a.dataset.category;a.querySelectorAll(".brand-chip").forEach(r=>{const i=r.querySelector(".brand-chip-handle");i&&(i.addEventListener("dragstart",s=>{e=b(r.dataset.brand),t=o,r.classList.add("is-dragging"),s.dataTransfer.effectAllowed="move",s.dataTransfer.setData("text/plain",e),s.dataTransfer.setDragImage&&s.dataTransfer.setDragImage(r,16,16)}),i.addEventListener("dragend",()=>{r.classList.remove("is-dragging"),a.querySelectorAll(".brand-chip").forEach(s=>s.classList.remove("is-drag-over")),e=null,t=null}),r.addEventListener("dragover",s=>{s.preventDefault(),s.dataTransfer.dropEffect="move",t===o&&(a.querySelectorAll(".brand-chip").forEach(c=>c.classList.remove("is-drag-over")),r.classList.add("is-drag-over"))}),r.addEventListener("dragleave",()=>{r.classList.remove("is-drag-over")}),r.addEventListener("drop",async s=>{if(s.preventDefault(),r.classList.remove("is-drag-over"),t!==o||!e)return;const c=b(r.dataset.brand);if(e===c)return;const m=[...a.querySelectorAll(".brand-chip")].map(f=>b(f.dataset.brand)),g=m.indexOf(e),v=m.indexOf(c);if(!(g<0||v<0)){m.splice(g,1),m.splice(v,0,e);try{await ae(o,m),u("已更新品牌顺序。")}catch(f){u(f.message),E()}}}))})})}function j(){G(),E(),A(),re()}function re(){n.itemCategory.innerHTML=d.categories.map(e=>`<option value="${e.id}">${e.icon} ${e.name}</option>`).join("")}function C(){const e=d.draftImages.length>1;n.photoGrid.innerHTML=d.draftImages.map((t,a)=>`
    <div class="photo-thumb ${a===0?"is-cover":""}" data-index="${a}">
      ${a===0?'<span class="cover-badge">Cover</span>':""}
      ${e?'<span class="photo-handle" draggable="true" aria-label="拖动以排序" title="拖动排序">⠿</span>':""}
      <img src="${t}" alt="" draggable="false" />
      <button class="photo-remove" data-index="${a}" type="button" aria-label="Remove photo">✕</button>
    </div>
  `).join(""),n.photoGrid.querySelectorAll(".photo-remove").forEach(t=>{t.addEventListener("click",()=>{d.draftImages.splice(Number(t.dataset.index),1),C()})}),e&&de()}function de(){let e=null;n.photoGrid.querySelectorAll(".photo-thumb").forEach(t=>{const a=t.querySelector(".photo-handle");a&&(a.addEventListener("dragstart",o=>{e=Number(t.dataset.index),t.classList.add("is-dragging"),o.dataTransfer.effectAllowed="move",o.dataTransfer.setData("text/plain",String(e)),o.dataTransfer.setDragImage&&o.dataTransfer.setDragImage(t,44,44)}),a.addEventListener("dragend",()=>{t.classList.remove("is-dragging"),n.photoGrid.querySelectorAll(".photo-thumb").forEach(o=>o.classList.remove("is-drag-over")),e=null}),t.addEventListener("dragover",o=>{o.preventDefault(),o.dataTransfer.dropEffect="move",n.photoGrid.querySelectorAll(".photo-thumb").forEach(r=>r.classList.remove("is-drag-over")),t.classList.add("is-drag-over")}),t.addEventListener("dragleave",()=>{t.classList.remove("is-drag-over")}),t.addEventListener("drop",o=>{if(o.preventDefault(),t.classList.remove("is-drag-over"),e===null)return;const r=Number(t.dataset.index);if(e===r)return;const i=[...d.draftImages],[s]=i.splice(e,1);i.splice(r,0,s),d.draftImages=i,C()}))})}function D(e=null){var t;if(d.editingId=e,p(n.editError,""),e){const a=d.products.find(o=>o.id===e);if(!a)return;n.editTitle.textContent="编辑商品",n.itemName.value=a.name,n.itemCategory.value=a.categoryId,h(a.categoryId,a.brand??""),n.itemPrice.value=a.price,n.itemDescription.value=a.description??"",d.draftImages=[...a.images],n.deleteBtn.hidden=!1}else{n.editTitle.textContent="新增商品";const a=d.activeCategory!=="all"?d.activeCategory:((t=d.categories[0])==null?void 0:t.id)??"";n.editForm.reset(),n.itemCategory.value=a,h(a),d.draftImages=[],n.deleteBtn.hidden=!0}C(),n.editModal.classList.add("open"),n.editModal.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"),n.itemName.focus()}function y(){n.editModal.classList.remove("open"),n.editModal.setAttribute("aria-hidden","true"),document.body.classList.remove("modal-open"),d.editingId=null,d.draftImages=[],n.photoInput.value=""}async function oe(e){for(const t of e)try{const{url:a}=await K(t);d.draftImages.push(a)}catch(a){u(a.message)}C()}async function ie(e){if(e.preventDefault(),d.saving)return;p(n.editError,"");const t=n.itemCategory.value,a=B(t),o={name:n.itemName.value,categoryId:t,price:parseFloat(n.itemPrice.value),description:n.itemDescription.value,images:d.draftImages,currency:"CNY"};if(a.length){const r=N(t,n.itemBrand.value);if(!r){p(n.editError,"请选择品牌。");return}o.brand=r}d.saving=!0,n.saveBtn.disabled=!0,n.saveBtn.textContent="正在保存…";try{if(d.editingId){const{catalog:r}=await Y(d.editingId,o);I(r),u("已更新商品，顾客现在就能看到。")}else{const{catalog:r}=await V(o);I(r),u("已新增商品！")}y()}catch(r){p(n.editError,r.message)}finally{d.saving=!1,n.saveBtn.disabled=!1,n.saveBtn.textContent="保存"}}async function se(){if(!d.editingId)return;const e=d.products.find(a=>a.id===d.editingId);if(!(!e||!window.confirm(`确定要删除“${e.name}”吗？

删除后无法恢复。`)))try{const{catalog:a}=await J(d.editingId);I(a),u("已删除商品。"),y()}catch(a){if(/not found/i.test(a.message)){await T(),u("商品列表已刷新。"),y();return}p(n.editError,a.message)}}async function ce(){window.location.protocol==="file:"&&(p(n.loginError,"请打开 http://localhost:3000/admin.html（不要直接打开本地文件）。请先运行 npm run dev。"),n.loginForm.querySelector('button[type="submit"]').disabled=!0);try{const{loggedIn:e}=await O();L(e),e&&await T()}catch{L(!1)}n.loginForm.addEventListener("submit",async e=>{e.preventDefault(),p(n.loginError,"");const t=document.getElementById("password"),a=n.loginForm.querySelector('button[type="submit"]'),o=t.value.trim();if(!o){p(n.loginError,"请输入密码。");return}a.disabled=!0,a.textContent="正在登录…";try{await R(o),L(!0),await T(),t.value=""}catch(r){p(n.loginError,r.message)}finally{a.disabled=!1,a.textContent="登录"}}),n.logoutBtn.addEventListener("click",async()=>{await U(),L(!1)}),n.addBtn.addEventListener("click",()=>D()),n.editClose.addEventListener("click",y),n.editBackdrop.addEventListener("click",y),n.cancelBtn.addEventListener("click",y),n.editForm.addEventListener("submit",ie),n.deleteBtn.addEventListener("click",se),n.itemCategory.addEventListener("change",()=>{h(n.itemCategory.value)}),n.photoInput.addEventListener("change",async()=>{var e;(e=n.photoInput.files)!=null&&e.length&&(await oe([...n.photoInput.files]),n.photoInput.value="")})}ce();
