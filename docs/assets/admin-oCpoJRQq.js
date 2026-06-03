import{c as k,l as P,e as S,f as q,u as F,b as H,d as N,g as j,a as A,r as D}from"./api-DzLQHKF5.js";const r={loggedIn:!1,categories:[],products:[],activeCategory:"all",editingId:null,draftImages:[],saving:!1},t={loginScreen:document.getElementById("login-screen"),loginForm:document.getElementById("login-form"),loginError:document.getElementById("login-error"),dashboard:document.getElementById("dashboard"),logoutBtn:document.getElementById("logout-btn"),categoryTabs:document.getElementById("category-tabs"),productList:document.getElementById("product-list"),addBtn:document.getElementById("add-btn"),editModal:document.getElementById("edit-modal"),editBackdrop:document.getElementById("edit-backdrop"),editClose:document.getElementById("edit-close"),editTitle:document.getElementById("edit-title"),editForm:document.getElementById("edit-form"),itemName:document.getElementById("item-name"),itemCategory:document.getElementById("item-category"),itemBrandGroup:document.getElementById("item-brand-group"),itemBrand:document.getElementById("item-brand"),itemPrice:document.getElementById("item-price"),itemDescription:document.getElementById("item-description"),photoGrid:document.getElementById("photo-grid"),photoInput:document.getElementById("photo-input"),editError:document.getElementById("edit-error"),deleteBtn:document.getElementById("delete-btn"),cancelBtn:document.getElementById("cancel-btn"),saveBtn:document.getElementById("save-btn"),toast:document.getElementById("toast"),brandManagerList:document.getElementById("brand-manager-list")};function G(e){return new Intl.NumberFormat("zh-CN",{style:"currency",currency:"CNY"}).format(e)}function l(e){t.toast.textContent=e,t.toast.hidden=!1,t.toast.classList.add("show"),setTimeout(()=>{t.toast.classList.remove("show"),setTimeout(()=>{t.toast.hidden=!0},300)},3e3)}function s(e,n){n?(e.textContent=n,e.hidden=!1):(e.hidden=!0,e.textContent="")}function p(e){r.loggedIn=e,t.loginScreen.hidden=e,t.dashboard.hidden=!e}async function f(){const e=await q();r.categories=e.categories,r.products=e.products,r.activeCategory==="all"&&r.categories.length,Y()}function z(){return r.activeCategory==="all"?r.products:r.products.filter(e=>e.categoryId===r.activeCategory)}function w(e){var n;return((n=r.categories.find(a=>a.id===e))==null?void 0:n.name)??"未知分类"}function b(e){var n;return((n=r.categories.find(a=>a.id===e))==null?void 0:n.brands)??[]}function C(e){return(e??"").trim().toLowerCase()}function B(e,n){return C(e)===C(n)}function M(e,n){const a=(n??"").trim();return a?b(e).find(d=>B(d,a))??a:""}function m(e,n=""){const a=b(e),i=M(e,n);if(!a.length){t.itemBrandGroup.hidden=!0,t.itemBrand.required=!1,t.itemBrand.innerHTML="";return}t.itemBrandGroup.hidden=!1,t.itemBrand.required=!0,t.itemBrand.innerHTML=[`<option value="" disabled ${i?"":"selected"}>请选择品牌</option>`,...a.map(d=>`<option value="${d}" ${B(d,i)?"selected":""}>${d}</option>`)].join("")}function L(e){const n=e.images[0]?`<img src="${e.images[0]}" alt="" />`:'<div class="no-photo">暂无图片</div>',a=e.brand?e.brand:'<span class="admin-product-missing-brand">未分配品牌</span>';return`
    <article class="admin-product-card">
      <div class="admin-product-thumb">${n}</div>
      <div class="admin-product-info">
        <p class="admin-product-section">${w(e.categoryId)} · ${a}</p>
        <h3>${e.name}</h3>
        <p class="admin-product-price">${G(e.price)}</p>
        <p class="admin-product-desc">${e.description||"暂无描述"}</p>
        <p class="admin-product-photos">${e.images.length} 张图片</p>
      </div>
      <button class="btn btn-secondary edit-product-btn" data-id="${e.id}" type="button">
        编辑
      </button>
    </article>
  `}function T(){const e=[{id:"all",name:"全部商品",icon:"📦"},...r.categories.map(n=>({id:n.id,name:n.name,icon:n.icon}))];t.categoryTabs.innerHTML=e.map(n=>`
    <button
      class="category-tab ${n.id===r.activeCategory?"active":""}"
      data-category="${n.id}"
      type="button"
    >
      <span aria-hidden="true">${n.icon}</span> ${n.name}
    </button>
  `).join(""),t.categoryTabs.querySelectorAll(".category-tab").forEach(n=>{n.addEventListener("click",()=>{r.activeCategory=n.dataset.category,T(),x()})})}function x(){var n;const e=z();if(e.length===0){t.productList.innerHTML=`
      <div class="empty-list">
        <p>这里还没有商品。</p>
        <button class="btn btn-primary" type="button" id="empty-add-btn">+ 添加第一件商品</button>
      </div>
    `,(n=document.getElementById("empty-add-btn"))==null||n.addEventListener("click",()=>I());return}if(r.activeCategory!=="all"){const a=b(r.activeCategory);if(a.length){const i=new Set,d=a.map(o=>{const g=e.filter(h=>!h.brand||!B(h.brand,o)?!1:(i.add(h.id),!0));return{brand:o,products:g}}),c=e.filter(o=>!i.has(o.id));c.length&&d.push({brand:"未分配品牌",products:c}),t.productList.innerHTML=d.map(({brand:o,products:g})=>`
        <section class="admin-brand-section">
          <h3 class="admin-brand-section-title">${o}</h3>
          <div class="admin-brand-section-list">
            ${g.length?g.map(L).join(""):'<p class="admin-brand-section-empty">该品牌暂无商品</p>'}
          </div>
        </section>
      `).join(""),$();return}}t.productList.innerHTML=e.map(L).join(""),$()}function $(){t.productList.querySelectorAll(".edit-product-btn").forEach(e=>{e.addEventListener("click",()=>I(e.dataset.id))})}function y(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function v(){t.brandManagerList.innerHTML=r.categories.map(e=>{const n=e.brands??[],a=n.length?n.map(i=>`
          <span class="brand-chip">
            <span>${y(i)}</span>
            <button
              class="brand-chip-remove"
              type="button"
              data-category="${e.id}"
              data-brand="${y(i)}"
              aria-label="删除品牌 ${y(i)}"
            >✕</button>
          </span>
        `).join(""):'<p class="brand-manager-empty">暂无品牌，请添加。</p>';return`
        <article class="brand-manager-card" data-category="${e.id}">
          <div class="brand-manager-card-header">
            <h3><span aria-hidden="true">${e.icon}</span> ${y(e.name)}</h3>
          </div>
          <div class="brand-chip-list">${a}</div>
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
      `}).join(""),t.brandManagerList.querySelectorAll(".brand-add-form").forEach(e=>{e.addEventListener("submit",async n=>{n.preventDefault();const i=e.querySelector(".brand-add-input").value.trim();if(i)try{const d=await A(e.dataset.category,i),c=r.categories.findIndex(o=>o.id===d.id);c!==-1&&(r.categories[c]=d),v(),m(e.dataset.category,i),l(`已添加品牌「${i}」。`)}catch(d){l(d.message)}})}),t.brandManagerList.querySelectorAll(".brand-chip-remove").forEach(e=>{e.addEventListener("click",async()=>{const{category:n,brand:a}=e.dataset;if(window.confirm(`确定从「${w(n)}」中删除品牌「${a}」吗？`))try{const d=await D(n,a),c=r.categories.findIndex(o=>o.id===d.id);c!==-1&&(r.categories[c]=d),v(),m(n),l(`已删除品牌「${a}」。`)}catch(d){l(d.message)}})})}function Y(){T(),v(),x(),R()}function R(){t.itemCategory.innerHTML=r.categories.map(e=>`<option value="${e.id}">${e.icon} ${e.name}</option>`).join("")}function E(){t.photoGrid.innerHTML=r.draftImages.map((e,n)=>`
    <div class="photo-thumb ${n===0?"is-cover":""}">
      ${n===0?'<span class="cover-badge">Cover</span>':""}
      <img src="${e}" alt="" />
      <button class="photo-remove" data-index="${n}" type="button" aria-label="Remove photo">✕</button>
    </div>
  `).join(""),t.photoGrid.querySelectorAll(".photo-remove").forEach(e=>{e.addEventListener("click",()=>{r.draftImages.splice(Number(e.dataset.index),1),E()})})}function I(e=null){var n;if(r.editingId=e,s(t.editError,""),e){const a=r.products.find(i=>i.id===e);if(!a)return;t.editTitle.textContent="编辑商品",t.itemName.value=a.name,t.itemCategory.value=a.categoryId,m(a.categoryId,a.brand??""),t.itemPrice.value=a.price,t.itemDescription.value=a.description??"",r.draftImages=[...a.images],t.deleteBtn.hidden=!1}else{t.editTitle.textContent="新增商品";const a=r.activeCategory!=="all"?r.activeCategory:((n=r.categories[0])==null?void 0:n.id)??"";t.editForm.reset(),t.itemCategory.value=a,m(a),r.draftImages=[],t.deleteBtn.hidden=!0}E(),t.editModal.classList.add("open"),t.editModal.setAttribute("aria-hidden","false"),document.body.classList.add("modal-open"),t.itemName.focus()}function u(){t.editModal.classList.remove("open"),t.editModal.setAttribute("aria-hidden","true"),document.body.classList.remove("modal-open"),r.editingId=null,r.draftImages=[],t.photoInput.value=""}async function U(e){for(const n of e)try{const{url:a}=await j(n);r.draftImages.push(a)}catch(a){l(a.message)}E()}async function V(e){if(e.preventDefault(),r.saving)return;s(t.editError,"");const n=t.itemCategory.value,a=b(n),i={name:t.itemName.value,categoryId:n,price:parseFloat(t.itemPrice.value),description:t.itemDescription.value,images:r.draftImages,currency:"CNY"};if(a.length){const d=M(n,t.itemBrand.value);if(!d){s(t.editError,"请选择品牌。");return}i.brand=d}r.saving=!0,t.saveBtn.disabled=!0,t.saveBtn.textContent="正在保存…";try{r.editingId?(await F(r.editingId,i),l("已更新商品，顾客现在就能看到。")):(await H(i),l("已新增商品！")),await f(),u()}catch(d){s(t.editError,d.message)}finally{r.saving=!1,t.saveBtn.disabled=!1,t.saveBtn.textContent="保存"}}async function J(){if(!r.editingId)return;const e=r.products.find(a=>a.id===r.editingId);if(!(!e||!window.confirm(`确定要删除“${e.name}”吗？

删除后无法恢复。`)))try{await N(r.editingId),l("已删除商品。"),await f(),u()}catch(a){s(t.editError,a.message)}}async function K(){window.location.protocol==="file:"&&(s(t.loginError,"请打开 http://localhost:3000/admin.html（不要直接打开本地文件）。请先运行 npm run dev。"),t.loginForm.querySelector('button[type="submit"]').disabled=!0);try{const{loggedIn:e}=await k();p(e),e&&await f()}catch{p(!1)}t.loginForm.addEventListener("submit",async e=>{e.preventDefault(),s(t.loginError,"");const n=document.getElementById("password"),a=t.loginForm.querySelector('button[type="submit"]'),i=n.value.trim();if(!i){s(t.loginError,"请输入密码。");return}a.disabled=!0,a.textContent="正在登录…";try{await P(i),p(!0),await f(),n.value=""}catch(d){s(t.loginError,d.message)}finally{a.disabled=!1,a.textContent="登录"}}),t.logoutBtn.addEventListener("click",async()=>{await S(),p(!1)}),t.addBtn.addEventListener("click",()=>I()),t.editClose.addEventListener("click",u),t.editBackdrop.addEventListener("click",u),t.cancelBtn.addEventListener("click",u),t.editForm.addEventListener("submit",V),t.deleteBtn.addEventListener("click",J),t.itemCategory.addEventListener("change",()=>{m(t.itemCategory.value)}),t.photoInput.addEventListener("change",async()=>{var e;(e=t.photoInput.files)!=null&&e.length&&(await U([...t.photoInput.files]),t.photoInput.value="")})}K();
