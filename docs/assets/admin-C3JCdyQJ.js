import{c as O,l as R,e as U,f as z,u as Y,b as V,d as J,i as K,a as Q,r as W,g as X,h as Z}from"./api-BTxM49HL.js";const d={loggedIn:!1,categories:[],products:[],activeCategory:"all",editingId:null,draftImages:[],saving:!1},a={loginScreen:document.getElementById("login-screen"),loginForm:document.getElementById("login-form"),loginError:document.getElementById("login-error"),dashboard:document.getElementById("dashboard"),logoutBtn:document.getElementById("logout-btn"),categoryTabs:document.getElementById("category-tabs"),productList:document.getElementById("product-list"),addBtn:document.getElementById("add-btn"),editModal:document.getElementById("edit-modal"),editBackdrop:document.getElementById("edit-backdrop"),editClose:document.getElementById("edit-close"),editTitle:document.getElementById("edit-title"),editForm:document.getElementById("edit-form"),itemName:document.getElementById("item-name"),itemCategory:document.getElementById("item-category"),itemBrandGroup:document.getElementById("item-brand-group"),itemBrand:document.getElementById("item-brand"),itemPrice:document.getElementById("item-price"),itemDescription:document.getElementById("item-description"),photoGrid:document.getElementById("photo-grid"),photoInput:document.getElementById("photo-input"),editError:document.getElementById("edit-error"),deleteBtn:document.getElementById("delete-btn"),cancelBtn:document.getElementById("cancel-btn"),saveBtn:document.getElementById("save-btn"),toast:document.getElementById("toast"),brandManagerList:document.getElementById("brand-manager-list")};function _(e){return new Intl.NumberFormat("zh-CN",{style:"currency",currency:"CNY"}).format(e)}function u(e){a.toast.textContent=e,a.toast.hidden=!1,a.toast.classList.add("show"),setTimeout(()=>{a.toast.classList.remove("show"),setTimeout(()=>{a.toast.hidden=!0},300)},3e3)}function p(e,n){n?(e.textContent=n,e.hidden=!1):(e.hidden=!0,e.textContent="")}function L(e){d.loggedIn=e,a.loginScreen.hidden=e,a.dashboard.hidden=!e}async function w(){const e=await z();d.categories=e.categories,d.products=e.products,d.activeCategory==="all"&&d.categories.length,G()}function B(e){d.categories=e.categories,d.products=e.products,G()}function ee(){return d.activeCategory==="all"?d.products:d.products.filter(e=>e.categoryId===d.activeCategory)}function H(e){var n;return((n=d.categories.find(t=>t.id===e))==null?void 0:n.name)??"未知分类"}function I(e){var n;return((n=d.categories.find(t=>t.id===e))==null?void 0:n.brands)??[]}function D(e){return(e??"").trim().toLowerCase()}function S(e,n){return D(e)===D(n)}function F(e,n){const t=(n??"").trim();return t?I(e).find(r=>S(r,t))??t:""}function h(e,n=""){const t=I(e),o=F(e,n);if(!t.length){a.itemBrandGroup.hidden=!0,a.itemBrand.required=!1,a.itemBrand.innerHTML="";return}a.itemBrandGroup.hidden=!1,a.itemBrand.required=!0,a.itemBrand.innerHTML=[`<option value="" disabled ${o?"":"selected"}>请选择品牌</option>`,...t.map(r=>`<option value="${r}" ${S(r,o)?"selected":""}>${r}</option>`)].join("")}function N(e,{sortable:n=!1}={}){const t=e.images[0]?`<img src="${e.images[0]}" alt="" />`:'<div class="no-photo">暂无图片</div>',o=e.brand?e.brand:'<span class="admin-product-missing-brand">未分配品牌</span>',r=n?'<span class="admin-product-handle" draggable="true" aria-label="拖动以排序" title="拖动排序">⠿</span>':"";return`
    <article class="admin-product-card" data-id="${e.id}">
      ${r}
      <div class="admin-product-thumb">${t}</div>
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
  `}function j(){const e=[{id:"all",name:"全部商品",icon:"📦"},...d.categories.map(n=>({id:n.id,name:n.name,icon:n.icon}))];a.categoryTabs.innerHTML=e.map(n=>`
    <button
      class="category-tab ${n.id===d.activeCategory?"active":""}"
      data-category="${n.id}"
      type="button"
    >
      <span aria-hidden="true">${n.icon}</span> ${n.name}
    </button>
  `).join(""),a.categoryTabs.querySelectorAll(".category-tab").forEach(n=>{n.addEventListener("click",()=>{d.activeCategory=n.dataset.category,j(),A()})})}async function te(e,n,t){const{catalog:o}=await Z(e,t,n);B(o)}function M(e,n,t,o){const r=n!==void 0?` data-brand="${T(n)}"`:"";return`
    <div class="admin-product-sort-list" data-category="${e}"${r}>
      ${t.map(i=>N(i,{sortable:o})).join("")}
    </div>
  `}function A(){var o;const e=ee(),n=d.activeCategory!=="all",t=n?'<p class="product-sort-hint">拖动商品左侧 ⠿ 可调整在店铺中的显示顺序。</p>':'<p class="product-sort-hint">选择具体分类后可拖动商品调整显示顺序。</p>';if(e.length===0){a.productList.innerHTML=`
      ${t}
      <div class="empty-list">
        <p>这里还没有商品。</p>
        <button class="btn btn-primary" type="button" id="empty-add-btn">+ 添加第一件商品</button>
      </div>
    `,(o=document.getElementById("empty-add-btn"))==null||o.addEventListener("click",()=>q());return}if(d.activeCategory!=="all"){const r=I(d.activeCategory);if(r.length){const i=new Set,s=r.map(l=>{const m=e.filter(g=>!g.brand||!S(g.brand,l)?!1:(i.add(g.id),!0));return{brand:l,products:m}}),c=e.filter(l=>!i.has(l.id));c.length&&s.push({brand:"未分配品牌",products:c}),a.productList.innerHTML=t+s.map(({brand:l,products:m})=>`
        <section class="admin-brand-section">
          <h3 class="admin-brand-section-title">${l}</h3>
          ${m.length?M(d.activeCategory,l,m,n):'<p class="admin-brand-section-empty">该品牌暂无商品</p>'}
        </section>
      `).join(""),P(),n&&k();return}}d.activeCategory!=="all"?a.productList.innerHTML=t+M(d.activeCategory,void 0,e,n):a.productList.innerHTML=t+e.map(r=>N(r,{sortable:!1})).join(""),P(),n&&k()}function P(){a.productList.querySelectorAll(".edit-product-btn").forEach(e=>{e.addEventListener("click",()=>q(e.dataset.id))})}function k(){let e=null,n=null;a.productList.querySelectorAll(".admin-product-sort-list").forEach(t=>{const o=t.dataset.category,r=t.dataset.brand!==void 0?b(t.dataset.brand):void 0;t.querySelectorAll(".admin-product-card").forEach(i=>{const s=i.querySelector(".admin-product-handle");s&&(s.addEventListener("dragstart",c=>{e=i.dataset.id,n=t,i.classList.add("is-dragging"),c.dataTransfer.effectAllowed="move",c.dataTransfer.setData("text/plain",e),c.dataTransfer.setDragImage&&c.dataTransfer.setDragImage(i,24,24)}),s.addEventListener("dragend",()=>{i.classList.remove("is-dragging"),t.querySelectorAll(".admin-product-card").forEach(c=>c.classList.remove("is-drag-over")),e=null,n=null}),i.addEventListener("dragover",c=>{c.preventDefault(),c.dataTransfer.dropEffect="move",n===t&&(t.querySelectorAll(".admin-product-card").forEach(l=>l.classList.remove("is-drag-over")),i.classList.add("is-drag-over"))}),i.addEventListener("dragleave",()=>{i.classList.remove("is-drag-over")}),i.addEventListener("drop",async c=>{if(c.preventDefault(),i.classList.remove("is-drag-over"),n!==t||!e)return;const l=i.dataset.id;if(e===l)return;const g=[...t.querySelectorAll(".admin-product-card")].map(C=>C.dataset.id),v=g.indexOf(e),f=g.indexOf(l);if(!(v<0||f<0)){g.splice(v,1),g.splice(f,0,e);try{await te(o,r,g),u("已更新商品顺序。")}catch(C){u(C.message),A()}}}))})})}function $(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function T(e){return encodeURIComponent(e)}function b(e){return decodeURIComponent(e??"")}async function ae(e,n){const t=await X(e,n),o=d.categories.findIndex(r=>r.id===t.id);o!==-1&&(d.categories[o]=t),E()}function E(){a.brandManagerList.innerHTML=d.categories.map(e=>{const n=e.brands??[],t=n.length?n.map(r=>`
          <li class="brand-chip" data-brand="${T(r)}">
            <span
              class="brand-chip-handle"
              draggable="true"
              aria-label="拖动以排序"
              title="拖动排序"
            >⠿</span>
            <span class="brand-chip-label">${$(r)}</span>
            <button
              class="brand-chip-remove"
              type="button"
              data-category="${e.id}"
              data-brand="${T(r)}"
              aria-label="删除品牌 ${$(r)}"
            >✕</button>
          </li>
        `).join(""):"",o=n.length?`<ul class="brand-chip-list" data-category="${e.id}">${t}</ul>`:'<p class="brand-manager-empty">暂无品牌，请添加。</p>';return`
        <article class="brand-manager-card" data-category="${e.id}">
          <div class="brand-manager-card-header">
            <h3><span aria-hidden="true">${e.icon}</span> ${$(e.name)}</h3>
            ${n.length?'<p class="brand-manager-hint">拖动品牌可调整侧栏显示顺序</p>':""}
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
      `}).join(""),a.brandManagerList.querySelectorAll(".brand-add-form").forEach(e=>{e.addEventListener("submit",async n=>{n.preventDefault();const o=e.querySelector(".brand-add-input").value.trim();if(o)try{const r=await Q(e.dataset.category,o),i=d.categories.findIndex(s=>s.id===r.id);i!==-1&&(d.categories[i]=r),E(),h(e.dataset.category,o),u(`已添加品牌「${o}」。`)}catch(r){u(r.message)}})}),a.brandManagerList.querySelectorAll(".brand-chip-remove").forEach(e=>{e.addEventListener("click",async n=>{n.stopPropagation();const t=e.dataset.category,o=b(e.dataset.brand);if(window.confirm(`确定从「${H(t)}」中删除品牌「${o}」吗？`))try{const i=await W(t,o),s=d.categories.findIndex(c=>c.id===i.id);s!==-1&&(d.categories[s]=i),E(),h(t),u(`已删除品牌「${o}」。`)}catch(i){u(i.message)}})}),ne()}function ne(){let e=null,n=null;a.brandManagerList.querySelectorAll(".brand-chip-list").forEach(t=>{const o=t.dataset.category;t.querySelectorAll(".brand-chip").forEach(r=>{const i=r.querySelector(".brand-chip-handle");i&&(i.addEventListener("dragstart",s=>{e=b(r.dataset.brand),n=o,r.classList.add("is-dragging"),s.dataTransfer.effectAllowed="move",s.dataTransfer.setData("text/plain",e),s.dataTransfer.setDragImage&&s.dataTransfer.setDragImage(r,16,16)}),i.addEventListener("dragend",()=>{r.classList.remove("is-dragging"),t.querySelectorAll(".brand-chip").forEach(s=>s.classList.remove("is-drag-over")),e=null,n=null}),r.addEventListener("dragover",s=>{s.preventDefault(),s.dataTransfer.dropEffect="move",n===o&&(t.querySelectorAll(".brand-chip").forEach(c=>c.classList.remove("is-drag-over")),r.classList.add("is-drag-over"))}),r.addEventListener("dragleave",()=>{r.classList.remove("is-drag-over")}),r.addEventListener("drop",async s=>{if(s.preventDefault(),r.classList.remove("is-drag-over"),n!==o||!e)return;const c=b(r.dataset.brand);if(e===c)return;const m=[...t.querySelectorAll(".brand-chip")].map(f=>b(f.dataset.brand)),g=m.indexOf(e),v=m.indexOf(c);if(!(g<0||v<0)){m.splice(g,1),m.splice(v,0,e);try{await ae(o,m),u("已更新品牌顺序。")}catch(f){u(f.message),E()}}}))})})}function G(){j(),E(),A(),re()}function re(){a.itemCategory.innerHTML=d.categories.map(e=>`<option value="${e.id}">${e.icon} ${e.name}</option>`).join("")}function x(){a.photoGrid.innerHTML=d.draftImages.map((e,n)=>`
    <div class="photo-thumb ${n===0?"is-cover":""}">
      ${n===0?'<span class="cover-badge">Cover</span>':""}
      <img src="${e}" alt="" />
      <button class="photo-remove" data-index="${n}" type="button" aria-label="Remove photo">✕</button>
    </div>
  `).join(""),a.photoGrid.querySelectorAll(".photo-remove").forEach(e=>{e.addEventListener("click",()=>{d.draftImages.splice(Number(e.dataset.index),1),x()})})}function q(e=null){var n;if(d.editingId=e,p(a.editError,""),e){const t=d.products.find(o=>o.id===e);if(!t)return;a.editTitle.textContent="编辑商品",a.itemName.value=t.name,a.itemCategory.value=t.categoryId,h(t.categoryId,t.brand??""),a.itemPrice.value=t.price,a.itemDescription.value=t.description??"",d.draftImages=[...t.images],a.deleteBtn.hidden=!1}else{a.editTitle.textContent="新增商品";const t=d.activeCategory!=="all"?d.activeCategory:((n=d.categories[0])==null?void 0:n.id)??"";a.editForm.reset(),a.itemCategory.value=t,h(t),d.draftImages=[],a.deleteBtn.hidden=!0}x(),a.editModal.classList.add("open"),a.editModal.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"),a.itemName.focus()}function y(){a.editModal.classList.remove("open"),a.editModal.setAttribute("aria-hidden","true"),document.body.classList.remove("modal-open"),d.editingId=null,d.draftImages=[],a.photoInput.value=""}async function de(e){for(const n of e)try{const{url:t}=await K(n);d.draftImages.push(t)}catch(t){u(t.message)}x()}async function oe(e){if(e.preventDefault(),d.saving)return;p(a.editError,"");const n=a.itemCategory.value,t=I(n),o={name:a.itemName.value,categoryId:n,price:parseFloat(a.itemPrice.value),description:a.itemDescription.value,images:d.draftImages,currency:"CNY"};if(t.length){const r=F(n,a.itemBrand.value);if(!r){p(a.editError,"请选择品牌。");return}o.brand=r}d.saving=!0,a.saveBtn.disabled=!0,a.saveBtn.textContent="正在保存…";try{if(d.editingId){const{catalog:r}=await Y(d.editingId,o);B(r),u("已更新商品，顾客现在就能看到。")}else{const{catalog:r}=await V(o);B(r),u("已新增商品！")}y()}catch(r){p(a.editError,r.message)}finally{d.saving=!1,a.saveBtn.disabled=!1,a.saveBtn.textContent="保存"}}async function ie(){if(!d.editingId)return;const e=d.products.find(t=>t.id===d.editingId);if(!(!e||!window.confirm(`确定要删除“${e.name}”吗？

删除后无法恢复。`)))try{const{catalog:t}=await J(d.editingId);B(t),u("已删除商品。"),y()}catch(t){if(/not found/i.test(t.message)){await w(),u("商品列表已刷新。"),y();return}p(a.editError,t.message)}}async function se(){window.location.protocol==="file:"&&(p(a.loginError,"请打开 http://localhost:3000/admin.html（不要直接打开本地文件）。请先运行 npm run dev。"),a.loginForm.querySelector('button[type="submit"]').disabled=!0);try{const{loggedIn:e}=await O();L(e),e&&await w()}catch{L(!1)}a.loginForm.addEventListener("submit",async e=>{e.preventDefault(),p(a.loginError,"");const n=document.getElementById("password"),t=a.loginForm.querySelector('button[type="submit"]'),o=n.value.trim();if(!o){p(a.loginError,"请输入密码。");return}t.disabled=!0,t.textContent="正在登录…";try{await R(o),L(!0),await w(),n.value=""}catch(r){p(a.loginError,r.message)}finally{t.disabled=!1,t.textContent="登录"}}),a.logoutBtn.addEventListener("click",async()=>{await U(),L(!1)}),a.addBtn.addEventListener("click",()=>q()),a.editClose.addEventListener("click",y),a.editBackdrop.addEventListener("click",y),a.cancelBtn.addEventListener("click",y),a.editForm.addEventListener("submit",oe),a.deleteBtn.addEventListener("click",ie),a.itemCategory.addEventListener("change",()=>{h(a.itemCategory.value)}),a.photoInput.addEventListener("change",async()=>{var e;(e=a.photoInput.files)!=null&&e.length&&(await de([...a.photoInput.files]),a.photoInput.value="")})}se();
