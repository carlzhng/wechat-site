import{c as N,l as j,e as G,f as O,u as R,b as U,d as z,h as Y,a as V,r as J,g as K}from"./api-Dn4w8aUd.js";const r={loggedIn:!1,categories:[],products:[],activeCategory:"all",editingId:null,draftImages:[],saving:!1},t={loginScreen:document.getElementById("login-screen"),loginForm:document.getElementById("login-form"),loginError:document.getElementById("login-error"),dashboard:document.getElementById("dashboard"),logoutBtn:document.getElementById("logout-btn"),categoryTabs:document.getElementById("category-tabs"),productList:document.getElementById("product-list"),addBtn:document.getElementById("add-btn"),editModal:document.getElementById("edit-modal"),editBackdrop:document.getElementById("edit-backdrop"),editClose:document.getElementById("edit-close"),editTitle:document.getElementById("edit-title"),editForm:document.getElementById("edit-form"),itemName:document.getElementById("item-name"),itemCategory:document.getElementById("item-category"),itemBrandGroup:document.getElementById("item-brand-group"),itemBrand:document.getElementById("item-brand"),itemPrice:document.getElementById("item-price"),itemDescription:document.getElementById("item-description"),photoGrid:document.getElementById("photo-grid"),photoInput:document.getElementById("photo-input"),editError:document.getElementById("edit-error"),deleteBtn:document.getElementById("delete-btn"),cancelBtn:document.getElementById("cancel-btn"),saveBtn:document.getElementById("save-btn"),toast:document.getElementById("toast"),brandManagerList:document.getElementById("brand-manager-list")};function Q(e){return new Intl.NumberFormat("zh-CN",{style:"currency",currency:"CNY"}).format(e)}function l(e){t.toast.textContent=e,t.toast.hidden=!1,t.toast.classList.add("show"),setTimeout(()=>{t.toast.classList.remove("show"),setTimeout(()=>{t.toast.hidden=!0},300)},3e3)}function u(e,n){n?(e.textContent=n,e.hidden=!1):(e.hidden=!0,e.textContent="")}function b(e){r.loggedIn=e,t.loginScreen.hidden=e,t.dashboard.hidden=!e}async function T(){const e=await O();r.categories=e.categories,r.products=e.products,r.activeCategory==="all"&&r.categories.length,L()}function M(e){const n=r.products.findIndex(a=>a.id===e.id);n===-1?r.products.push(e):r.products[n]=e,L()}function W(e){r.products=r.products.filter(n=>n.id!==e),L()}function X(){return r.activeCategory==="all"?r.products:r.products.filter(e=>e.categoryId===r.activeCategory)}function k(e){var n;return((n=r.categories.find(a=>a.id===e))==null?void 0:n.name)??"未知分类"}function h(e){var n;return((n=r.categories.find(a=>a.id===e))==null?void 0:n.brands)??[]}function S(e){return(e??"").trim().toLowerCase()}function I(e,n){return S(e)===S(n)}function D(e,n){const a=(n??"").trim();return a?h(e).find(d=>I(d,a))??a:""}function p(e,n=""){const a=h(e),i=D(e,n);if(!a.length){t.itemBrandGroup.hidden=!0,t.itemBrand.required=!1,t.itemBrand.innerHTML="";return}t.itemBrandGroup.hidden=!1,t.itemBrand.required=!0,t.itemBrand.innerHTML=[`<option value="" disabled ${i?"":"selected"}>请选择品牌</option>`,...a.map(d=>`<option value="${d}" ${I(d,i)?"selected":""}>${d}</option>`)].join("")}function q(e){const n=e.images[0]?`<img src="${e.images[0]}" alt="" />`:'<div class="no-photo">暂无图片</div>',a=e.brand?e.brand:'<span class="admin-product-missing-brand">未分配品牌</span>';return`
    <article class="admin-product-card">
      <div class="admin-product-thumb">${n}</div>
      <div class="admin-product-info">
        <p class="admin-product-section">${k(e.categoryId)} · ${a}</p>
        <h3>${e.name}</h3>
        <p class="admin-product-price">${Q(e.price)}</p>
        <p class="admin-product-desc">${e.description||"暂无描述"}</p>
        <p class="admin-product-photos">${e.images.length} 张图片</p>
      </div>
      <button class="btn btn-secondary edit-product-btn" data-id="${e.id}" type="button">
        编辑
      </button>
    </article>
  `}function F(){const e=[{id:"all",name:"全部商品",icon:"📦"},...r.categories.map(n=>({id:n.id,name:n.name,icon:n.icon}))];t.categoryTabs.innerHTML=e.map(n=>`
    <button
      class="category-tab ${n.id===r.activeCategory?"active":""}"
      data-category="${n.id}"
      type="button"
    >
      <span aria-hidden="true">${n.icon}</span> ${n.name}
    </button>
  `).join(""),t.categoryTabs.querySelectorAll(".category-tab").forEach(n=>{n.addEventListener("click",()=>{r.activeCategory=n.dataset.category,F(),H()})})}function H(){var n;const e=X();if(e.length===0){t.productList.innerHTML=`
      <div class="empty-list">
        <p>这里还没有商品。</p>
        <button class="btn btn-primary" type="button" id="empty-add-btn">+ 添加第一件商品</button>
      </div>
    `,(n=document.getElementById("empty-add-btn"))==null||n.addEventListener("click",()=>$());return}if(r.activeCategory!=="all"){const a=h(r.activeCategory);if(a.length){const i=new Set,d=a.map(o=>{const c=e.filter(y=>!y.brand||!I(y.brand,o)?!1:(i.add(y.id),!0));return{brand:o,products:c}}),s=e.filter(o=>!i.has(o.id));s.length&&d.push({brand:"未分配品牌",products:s}),t.productList.innerHTML=d.map(({brand:o,products:c})=>`
        <section class="admin-brand-section">
          <h3 class="admin-brand-section-title">${o}</h3>
          <div class="admin-brand-section-list">
            ${c.length?c.map(q).join(""):'<p class="admin-brand-section-empty">该品牌暂无商品</p>'}
          </div>
        </section>
      `).join(""),A();return}}t.productList.innerHTML=e.map(q).join(""),A()}function A(){t.productList.querySelectorAll(".edit-product-btn").forEach(e=>{e.addEventListener("click",()=>$(e.dataset.id))})}function B(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function P(e){return encodeURIComponent(e)}function v(e){return decodeURIComponent(e??"")}async function Z(e,n){const a=await K(e,n),i=r.categories.findIndex(d=>d.id===a.id);i!==-1&&(r.categories[i]=a),f()}function f(){t.brandManagerList.innerHTML=r.categories.map(e=>{const n=e.brands??[],a=n.length?n.map(d=>`
          <li class="brand-chip" data-brand="${P(d)}">
            <span
              class="brand-chip-handle"
              draggable="true"
              aria-label="拖动以排序"
              title="拖动排序"
            >⠿</span>
            <span class="brand-chip-label">${B(d)}</span>
            <button
              class="brand-chip-remove"
              type="button"
              data-category="${e.id}"
              data-brand="${P(d)}"
              aria-label="删除品牌 ${B(d)}"
            >✕</button>
          </li>
        `).join(""):"",i=n.length?`<ul class="brand-chip-list" data-category="${e.id}">${a}</ul>`:'<p class="brand-manager-empty">暂无品牌，请添加。</p>';return`
        <article class="brand-manager-card" data-category="${e.id}">
          <div class="brand-manager-card-header">
            <h3><span aria-hidden="true">${e.icon}</span> ${B(e.name)}</h3>
            ${n.length?'<p class="brand-manager-hint">拖动品牌可调整侧栏显示顺序</p>':""}
          </div>
          ${i}
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
      `}).join(""),t.brandManagerList.querySelectorAll(".brand-add-form").forEach(e=>{e.addEventListener("submit",async n=>{n.preventDefault();const i=e.querySelector(".brand-add-input").value.trim();if(i)try{const d=await V(e.dataset.category,i),s=r.categories.findIndex(o=>o.id===d.id);s!==-1&&(r.categories[s]=d),f(),p(e.dataset.category,i),l(`已添加品牌「${i}」。`)}catch(d){l(d.message)}})}),t.brandManagerList.querySelectorAll(".brand-chip-remove").forEach(e=>{e.addEventListener("click",async n=>{n.stopPropagation();const a=e.dataset.category,i=v(e.dataset.brand);if(window.confirm(`确定从「${k(a)}」中删除品牌「${i}」吗？`))try{const s=await J(a,i),o=r.categories.findIndex(c=>c.id===s.id);o!==-1&&(r.categories[o]=s),f(),p(a),l(`已删除品牌「${i}」。`)}catch(s){l(s.message)}})}),_()}function _(){let e=null,n=null;t.brandManagerList.querySelectorAll(".brand-chip-list").forEach(a=>{const i=a.dataset.category;a.querySelectorAll(".brand-chip").forEach(d=>{const s=d.querySelector(".brand-chip-handle");s&&(s.addEventListener("dragstart",o=>{e=v(d.dataset.brand),n=i,d.classList.add("is-dragging"),o.dataTransfer.effectAllowed="move",o.dataTransfer.setData("text/plain",e),o.dataTransfer.setDragImage&&o.dataTransfer.setDragImage(d,16,16)}),s.addEventListener("dragend",()=>{d.classList.remove("is-dragging"),a.querySelectorAll(".brand-chip").forEach(o=>o.classList.remove("is-drag-over")),e=null,n=null}),d.addEventListener("dragover",o=>{o.preventDefault(),o.dataTransfer.dropEffect="move",n===i&&(a.querySelectorAll(".brand-chip").forEach(c=>c.classList.remove("is-drag-over")),d.classList.add("is-drag-over"))}),d.addEventListener("dragleave",()=>{d.classList.remove("is-drag-over")}),d.addEventListener("drop",async o=>{if(o.preventDefault(),d.classList.remove("is-drag-over"),n!==i||!e)return;const c=v(d.dataset.brand);if(e===c)return;const m=[...a.querySelectorAll(".brand-chip")].map(E=>v(E.dataset.brand)),w=m.indexOf(e),x=m.indexOf(c);if(!(w<0||x<0)){m.splice(w,1),m.splice(x,0,e);try{await Z(i,m),l("已更新品牌顺序。")}catch(E){l(E.message),f()}}}))})})}function L(){F(),f(),H(),ee()}function ee(){t.itemCategory.innerHTML=r.categories.map(e=>`<option value="${e.id}">${e.icon} ${e.name}</option>`).join("")}function C(){t.photoGrid.innerHTML=r.draftImages.map((e,n)=>`
    <div class="photo-thumb ${n===0?"is-cover":""}">
      ${n===0?'<span class="cover-badge">Cover</span>':""}
      <img src="${e}" alt="" />
      <button class="photo-remove" data-index="${n}" type="button" aria-label="Remove photo">✕</button>
    </div>
  `).join(""),t.photoGrid.querySelectorAll(".photo-remove").forEach(e=>{e.addEventListener("click",()=>{r.draftImages.splice(Number(e.dataset.index),1),C()})})}function $(e=null){var n;if(r.editingId=e,u(t.editError,""),e){const a=r.products.find(i=>i.id===e);if(!a)return;t.editTitle.textContent="编辑商品",t.itemName.value=a.name,t.itemCategory.value=a.categoryId,p(a.categoryId,a.brand??""),t.itemPrice.value=a.price,t.itemDescription.value=a.description??"",r.draftImages=[...a.images],t.deleteBtn.hidden=!1}else{t.editTitle.textContent="新增商品";const a=r.activeCategory!=="all"?r.activeCategory:((n=r.categories[0])==null?void 0:n.id)??"";t.editForm.reset(),t.itemCategory.value=a,p(a),r.draftImages=[],t.deleteBtn.hidden=!0}C(),t.editModal.classList.add("open"),t.editModal.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"),t.itemName.focus()}function g(){t.editModal.classList.remove("open"),t.editModal.setAttribute("aria-hidden","true"),document.body.classList.remove("modal-open"),r.editingId=null,r.draftImages=[],t.photoInput.value=""}async function te(e){for(const n of e)try{const{url:a}=await Y(n);r.draftImages.push(a)}catch(a){l(a.message)}C()}async function ne(e){if(e.preventDefault(),r.saving)return;u(t.editError,"");const n=t.itemCategory.value,a=h(n),i={name:t.itemName.value,categoryId:n,price:parseFloat(t.itemPrice.value),description:t.itemDescription.value,images:r.draftImages,currency:"CNY"};if(a.length){const d=D(n,t.itemBrand.value);if(!d){u(t.editError,"请选择品牌。");return}i.brand=d}r.saving=!0,t.saveBtn.disabled=!0,t.saveBtn.textContent="正在保存…";try{if(r.editingId){const d=await R(r.editingId,i);M(d),l("已更新商品，顾客现在就能看到。")}else{const d=await U(i);M(d),l("已新增商品！")}g()}catch(d){u(t.editError,d.message)}finally{r.saving=!1,t.saveBtn.disabled=!1,t.saveBtn.textContent="保存"}}async function ae(){if(!r.editingId)return;const e=r.products.find(a=>a.id===r.editingId);if(!(!e||!window.confirm(`确定要删除“${e.name}”吗？

删除后无法恢复。`)))try{await z(r.editingId),W(r.editingId),l("已删除商品。"),g()}catch(a){u(t.editError,a.message)}}async function re(){window.location.protocol==="file:"&&(u(t.loginError,"请打开 http://localhost:3000/admin.html（不要直接打开本地文件）。请先运行 npm run dev。"),t.loginForm.querySelector('button[type="submit"]').disabled=!0);try{const{loggedIn:e}=await N();b(e),e&&await T()}catch{b(!1)}t.loginForm.addEventListener("submit",async e=>{e.preventDefault(),u(t.loginError,"");const n=document.getElementById("password"),a=t.loginForm.querySelector('button[type="submit"]'),i=n.value.trim();if(!i){u(t.loginError,"请输入密码。");return}a.disabled=!0,a.textContent="正在登录…";try{await j(i),b(!0),await T(),n.value=""}catch(d){u(t.loginError,d.message)}finally{a.disabled=!1,a.textContent="登录"}}),t.logoutBtn.addEventListener("click",async()=>{await G(),b(!1)}),t.addBtn.addEventListener("click",()=>$()),t.editClose.addEventListener("click",g),t.editBackdrop.addEventListener("click",g),t.cancelBtn.addEventListener("click",g),t.editForm.addEventListener("submit",ne),t.deleteBtn.addEventListener("click",ae),t.itemCategory.addEventListener("change",()=>{p(t.itemCategory.value)}),t.photoInput.addEventListener("change",async()=>{var e;(e=t.photoInput.files)!=null&&e.length&&(await te([...t.photoInput.files]),t.photoInput.value="")})}re();
