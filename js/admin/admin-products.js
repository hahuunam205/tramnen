/* TRAM NEN · admin/admin-products.js
   Sản phẩm (danh sách + form có phân loại/giá/tồn kho riêng) và Danh mục */

let adminProductQuery = '';

function renderAdminProducts(app) {
  const all = store.products().slice().sort((a, b) => b.createdAt - a.createdAt);
  const q = normalizeText(adminProductQuery);
  const list = q ? all.filter(p => normalizeText(p.name + ' ' + p.name_en + ' ' + p.id).includes(q)) : all;

  adminMount(app, 'products', 'Sản phẩm', `
    <div class="adm-toolbar">
      <div class="tn-search">${ICONS.search}<input id="ap-q" type="search" placeholder="Tìm sản phẩm…" value="${escapeHTML(adminProductQuery)}"></div>
      <span class="tn-muted">${list.length}/${all.length} sản phẩm</span>
    </div>
    <section class="adm-card adm-card--flush">
      <div class="tn-table-wrap"><table class="tn-table">
        <thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Phân loại · giá · tồn</th><th>Đã bán</th><th>Sale</th><th>Nổi bật</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>
          ${list.map(p => `<tr>
            <td><div class="admin-prod"><div class="admin-thumb" style="${paletteStyle(p)}">${thumbHTML(p)}</div>
              <div><b>${escapeHTML(p.name)}</b><div class="tn-muted" style="font-size:12px">${escapeHTML(p.id)} · ${escapeHTML(SCENTS[p.scent]?.name || '')}${productImage(p) ? ' · có ảnh' : ''}</div></div></div></td>
            <td class="tn-muted">${escapeHTML(getCategory(p.category)?.name || '—')}</td>
            <td><div class="vt">${p.variants.map(v => `<span class="${v.stock <= 0 ? 'txt-danger' : v.stock <= 5 ? 'txt-warn' : ''}"><b>${escapeHTML(v.label)}</b> ${fmtVND(v.price)} · ${v.stock}</span>`).join('')}</div></td>
            <td class="tn-muted">${p.sold || 0}</td>
            <td>${isOnSale(p) ? `<span class="tn-chip tn-chip--cancelled">−${p.salePercent}%</span>` : '<span class="tn-muted">—</span>'}</td>
            <td><button class="star-toggle ${p.featured ? 'on' : ''}" data-action="ap-feature" data-id="${escapeHTML(p.id)}" title="Hiện ở mục Được yêu thích trên trang chủ">★</button></td>
            <td><span class="tn-chip ${p.status === 'active' ? 'tn-chip--done' : 'tn-chip--muted'}">${p.status === 'active' ? 'Đang bán' : 'Đang ẩn'}</span></td>
            <td><div class="tn-actions">
              <a class="tn-btn tn-btn--ghost tn-btn--sm" href="#/admin/products/edit/${encodeURIComponent(p.id)}">Sửa</a>
              <button class="tn-btn tn-btn--ghost tn-btn--sm" data-action="ap-toggle" data-id="${escapeHTML(p.id)}">${p.status === 'active' ? 'Ẩn' : 'Hiện'}</button>
              <button class="tn-btn tn-btn--danger tn-btn--sm" data-action="ap-delete" data-id="${escapeHTML(p.id)}">Xóa</button>
            </div></td>
          </tr>`).join('') || '<tr><td colspan="8" class="tn-muted" style="text-align:center;padding:30px">Không có sản phẩm</td></tr>'}
        </tbody>
      </table></div>
    </section>
  `, `<a href="#/admin/products/new" class="tn-btn tn-btn--primary">+ Thêm sản phẩm</a>`);

  const qi = $('#ap-q');
  qi.addEventListener('input', debounce(() => {
    adminProductQuery = qi.value; renderAdminProducts(app);
    const el = $('#ap-q'); el.focus(); el.setSelectionRange(el.value.length, el.value.length);
  }, 250));
}

const updateProduct = (id, fn) => {
  const ps = store.products(); const p = ps.find(x => x.id === id);
  if (!p) return null; fn(p); store.saveProducts(ps); return p;
};
ADMIN_ACTIONS['ap-feature'] = (id) => { const p = updateProduct(id, p => p.featured = !p.featured); toast(p.featured ? 'Đã đưa vào “Được yêu thích”' : 'Đã bỏ khỏi “Được yêu thích”', 'ok'); route(); };
ADMIN_ACTIONS['ap-toggle'] = (id) => { const p = updateProduct(id, p => p.status = p.status === 'active' ? 'hidden' : 'active'); toast(p.status === 'active' ? 'Sản phẩm đã hiện' : 'Đã ẩn sản phẩm', 'ok'); route(); };
ADMIN_ACTIONS['ap-delete'] = (id) => {
  const p = getProductById(id);
  if (!p) return;
  if (store.orders().some(o => o.items.some(i => i.productId === id))) { toast('Sản phẩm đã có đơn hàng — hãy “Ẩn” thay vì xóa', 'err'); return; }
  if (!confirm(`Xóa “${p.name}”? Không thể hoàn tác.`)) return;
  store.saveProducts(store.products().filter(x => x.id !== id));
  store.saveReviews(store.reviews().filter(r => r.productId !== id));
  store.saveCart(store.cart().filter(l => l.productId !== id));
  dropReplacedMedia([p.image], []);
  toast('Đã xóa sản phẩm', 'ok'); route();
};

/* ============================================================
   FORM SẢN PHẨM
   ============================================================ */
function variantRowHTML(v = {}) {
  return `<tr class="var-row">
    <td><input class="var-label" value="${escapeHTML(v.label || '')}" placeholder="vd: 100g" maxlength="30"></td>
    <td><input class="var-price" type="number" min="1000" step="1000" value="${escapeHTML(v.price ?? '')}" placeholder="159000"></td>
    <td><input class="var-stock" type="number" min="0" step="1" value="${escapeHTML(v.stock ?? 10)}"></td>
    <td><input class="var-note" value="${escapeHTML(v.note || '')}" placeholder="vd: 20–25 giờ đốt" maxlength="60"></td>
    <td><button type="button" class="tn-icon-btn var-del" aria-label="Xóa phân loại">${ICONS.close}</button><input type="hidden" class="var-id" value="${escapeHTML(v.id || '')}"></td>
  </tr>`;
}

function renderAdminProductForm(app, id) {
  const editing = id ? getProductById(id) : null;
  if (id && !editing) return adminMount(app, 'products', 'Không tìm thấy', '<div class="tn-empty">Sản phẩm không tồn tại.</div>');
  const cats = sortedCategories();
  const p = editing ? JSON.parse(JSON.stringify(editing)) : {
    name: '', name_en: '', category: cats[0]?.id || '', scent: 'go-am', status: 'active', featured: false, salePercent: 0,
    notes: { top: '', mid: '', base: '' }, notes_en: { top: '', mid: '', base: '' }, desc: '', desc_en: '',
    variants: DEFAULT_VARIANTS.map((label, i) => ({ id: '', label, price: '', stock: 10, note: '' })), palette: 0, image: ''
  };
  let palette = Number(p.palette) || 0;
  const opt = (pairs, cur) => pairs.map(([k, l]) => `<option value="${escapeHTML(k)}" ${cur === k ? 'selected' : ''}>${escapeHTML(l)}</option>`).join('');

  adminMount(app, 'products', editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm', `
    <form class="pf-layout" id="product-form" novalidate>
      <div class="pf-main">
        <section class="adm-card">
          <h2 class="adm-h2">Thông tin cơ bản</h2>
          <div class="tn-row">
            <div class="tn-field"><label>Tên sản phẩm (Tiếng Việt) *</label><input id="f-name" maxlength="80" value="${escapeHTML(p.name)}"></div>
            <div class="tn-field"><label>Tên (English)</label><input id="f-name-en" maxlength="80" value="${escapeHTML(p.name_en || '')}"></div>
          </div>
          <div class="tn-row tn-row--3">
            <div class="tn-field"><label>Danh mục <a href="#/admin/categories" class="tn-link">(quản lý)</a></label><select id="f-cat">${opt(cats.map(c => [c.id, c.name]), p.category)}</select></div>
            <div class="tn-field"><label>Nhóm hương</label><select id="f-scent">${opt(Object.entries(SCENTS).map(([k, s]) => [k, s.name]), p.scent)}</select></div>
            <div class="tn-field"><label>Trạng thái</label><select id="f-status">${opt([['active', 'Đang bán'], ['hidden', 'Ẩn']], p.status)}</select></div>
          </div>
          <div class="tn-row">
            <div class="tn-field"><label>Giảm giá sản phẩm (%)</label><input id="f-sale" type="number" min="0" max="90" step="1" value="${escapeHTML(p.salePercent || 0)}"><p class="tn-hint">0 = không sale. Sản phẩm có % &gt; 0 sẽ hiện trong trang Sale.</p></div>
            <div class="tn-field"><label>&nbsp;</label><label class="flt-switch"><input type="checkbox" id="f-featured" ${p.featured ? 'checked' : ''}><span class="sw"></span>Hiện ở “Được yêu thích” trên trang chủ</label></div>
          </div>
        </section>

        <section class="adm-card">
          <div class="adm-card-head"><h2 class="adm-h2">Phân loại, giá & tồn kho</h2><button type="button" class="tn-btn tn-btn--ghost tn-btn--sm" id="var-add">+ Thêm phân loại</button></div>
          <div class="tn-table-wrap"><table class="var-table">
            <thead><tr><th>Phân loại</th><th>Giá (đồng)</th><th>Tồn kho</th><th>Ghi chú (thời gian đốt, số viên…)</th><th></th></tr></thead>
            <tbody id="var-body">${p.variants.map(variantRowHTML).join('')}</tbody>
          </table></div>
          <p class="tn-hint">Mặc định 3 phân loại ${DEFAULT_VARIANTS.join(' / ')} — có thể đổi tên, thêm hoặc bớt (tối thiểu 1).</p>
        </section>

        <section class="adm-card">
          <h2 class="adm-h2">Mùi hương & mô tả</h2>
          <div class="tn-row tn-row--3">
            <div class="tn-field"><label>Hương đầu</label><input id="f-top" value="${escapeHTML(p.notes?.top || '')}"></div>
            <div class="tn-field"><label>Hương giữa</label><input id="f-mid" value="${escapeHTML(p.notes?.mid || '')}"></div>
            <div class="tn-field"><label>Hương cuối</label><input id="f-base" value="${escapeHTML(p.notes?.base || '')}"></div>
          </div>
          <div class="tn-row tn-row--3">
            <div class="tn-field"><label>Top note (EN)</label><input id="f-top-en" value="${escapeHTML(p.notes_en?.top || '')}"></div>
            <div class="tn-field"><label>Middle note (EN)</label><input id="f-mid-en" value="${escapeHTML(p.notes_en?.mid || '')}"></div>
            <div class="tn-field"><label>Base note (EN)</label><input id="f-base-en" value="${escapeHTML(p.notes_en?.base || '')}"></div>
          </div>
          <div class="tn-field"><label>Mô tả (Tiếng Việt)</label><textarea id="f-desc" maxlength="800">${escapeHTML(p.desc || '')}</textarea></div>
          <div class="tn-field"><label>Description (English)</label><textarea id="f-desc-en" maxlength="800">${escapeHTML(p.desc_en || '')}</textarea></div>
        </section>

        <section class="adm-card">
          <h2 class="adm-h2">Hình ảnh</h2>
          ${mediaFieldHTML('image', p.image, { accept: 'image/*', label: 'Ảnh sản phẩm', hint: 'Nhận ảnh dung lượng lớn (tối đa 50MB, tự động tối ưu). Nên dùng tỉ lệ 4:5. Để trống sẽ dùng hình minh họa có logo.' })}
          <div class="tn-field" style="margin-top:14px"><label>Màu nền (khi chưa có ảnh)</label>${palettePickerHTML(palette)}</div>
        </section>

        <div class="adm-form-actions">
          <button class="tn-btn tn-btn--primary tn-btn--lg" type="submit">${editing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button>
          <a href="#/admin/products" class="tn-btn tn-btn--ghost tn-btn--lg">Hủy</a>
          ${editing && editing.status === 'active' ? `<a href="#/product/${encodeURIComponent(editing.id)}" class="tn-link-arrow" style="margin-left:auto">Xem trên web →</a>` : ''}
        </div>
      </div>
      <aside class="pf-preview"><div class="mf-label">Xem trước</div><div id="pf-card"></div></aside>
    </form>
  `);

  const form = $('#product-form');
  const readVariants = () => $$('#var-body .var-row').map((r, i) => ({
    id: r.querySelector('.var-id').value || 'v' + slugify(r.querySelector('.var-label').value || String(i)) + (i ? '' : ''),
    label: r.querySelector('.var-label').value.trim(),
    price: Number(r.querySelector('.var-price').value) || 0,
    stock: Math.max(0, parseInt(r.querySelector('.var-stock').value, 10) || 0),
    note: r.querySelector('.var-note').value.trim()
  }));
  const read = () => ({
    ...p,
    id: editing ? editing.id : 'preview',
    name: val('#f-name') || 'Tên sản phẩm', name_en: val('#f-name-en'),
    category: val('#f-cat'), scent: val('#f-scent'), status: val('#f-status'),
    salePercent: clamp(parseInt(val('#f-sale'), 10) || 0, 0, 90), featured: $('#f-featured').checked,
    notes: { top: val('#f-top'), mid: val('#f-mid'), base: val('#f-base') },
    notes_en: { top: val('#f-top-en'), mid: val('#f-mid-en'), base: val('#f-base-en') },
    desc: val('#f-desc'), desc_en: val('#f-desc-en'),
    variants: readVariants(), palette, image: readHidden(form, 'image')
  });
  const preview = () => {
    if (!document.body.contains(form)) return;
    const d = read();
    if (!d.variants.length || d.variants.some(v => !v.price)) d.variants = d.variants.map(v => ({ ...v, price: v.price || 0 }));
    if (!d.variants.length) d.variants = [{ id: 'x', label: '—', price: 0, stock: 0 }];
    $('#pf-card').innerHTML = productCardHTML(d);
    $$('#pf-card .reveal').forEach(el => el.classList.add('in'));
    $$('#pf-card [data-action]').forEach(b => { b.removeAttribute('data-action'); b.disabled = true; });
    $$('#pf-card a').forEach(a => a.removeAttribute('href'));
  };
  preview();
  form.addEventListener('input', debounce(preview, 120));
  form.addEventListener('change', preview);
  bindMediaFields(form, preview);
  bindPalettePicker(form, (i) => { palette = i; preview(); });

  $('#var-add').addEventListener('click', () => {
    $('#var-body').insertAdjacentHTML('beforeend', variantRowHTML({ label: '', price: '', stock: 10 }));
    $('#var-body .var-row:last-child .var-label').focus();
  });
  $('#var-body').addEventListener('click', (e) => {
    const del = e.target.closest('.var-del');
    if (!del) return;
    if ($$('#var-body .var-row').length <= 1) { toast('Cần ít nhất 1 phân loại', 'err'); return; }
    del.closest('tr').remove(); preview();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = read();
    if (!val('#f-name')) { toast('Vui lòng nhập tên sản phẩm', 'err'); return; }
    if (!d.category) { toast('Vui lòng tạo danh mục trước', 'err'); return; }
    if (d.variants.some(v => !v.label)) { toast('Mỗi phân loại cần có tên (vd: 100g)', 'err'); return; }
    if (d.variants.some(v => v.price < 1000)) { toast('Giá mỗi phân loại phải từ 1.000₫', 'err'); return; }
    const labels = d.variants.map(v => v.label.toLowerCase());
    if (new Set(labels).size !== labels.length) { toast('Tên phân loại bị trùng', 'err'); return; }
    /* id phân loại: giữ id cũ, tạo id mới duy nhất cho dòng mới */
    const used = new Set();
    d.variants.forEach(v => {
      let vid = v.id && !used.has(v.id) ? v.id : 'v' + slugify(v.label);
      while (used.has(vid)) vid += '_';
      v.id = vid; used.add(vid);
    });

    const products = store.products();
    if (editing) {
      const i = products.findIndex(x => x.id === editing.id);
      products[i] = { ...products[i], ...d, id: editing.id };
      dropReplacedMedia([editing.image], [d.image]);
      toast('Đã lưu sản phẩm', 'ok');
    } else {
      products.push({ ...d, id: 'p_' + uid(), sold: 0, createdAt: now() });
      toast('Đã thêm sản phẩm', 'ok');
    }
    store.saveProducts(products);
    location.hash = '/admin/products';
  });
}

/* ============================================================
   DANH MỤC
   ============================================================ */
function renderAdminCategories(app, editId) {
  const cats = sortedCategories();
  const products = store.products();
  const editing = editId ? cats.find(c => c.id === editId) : null;
  const c = editing || { name: '', name_en: '', art: 'jar', desc: '', desc_en: '', image: '', order: cats.length + 1 };

  adminMount(app, 'categories', 'Danh mục sản phẩm', `
    <div class="adm-grid-2 adm-grid-2--wide">
      <section class="adm-card adm-card--flush">
        <div class="tn-table-wrap"><table class="tn-table">
          <thead><tr><th>Thứ tự</th><th>Danh mục</th><th>Kiểu minh họa</th><th>Sản phẩm</th><th></th></tr></thead>
          <tbody>${cats.map(x => `<tr class="${editing && editing.id === x.id ? 'row-active' : ''}">
            <td class="tn-muted">${x.order || 0}</td>
            <td><b>${escapeHTML(x.name)}</b><div class="tn-muted" style="font-size:12px">${escapeHTML(x.name_en || '')} · ${escapeHTML(x.id)}</div></td>
            <td class="tn-muted">${ART_TYPES[x.art] || x.art}</td>
            <td>${products.filter(p => p.category === x.id).length}</td>
            <td><div class="tn-actions">
              <a class="tn-btn tn-btn--ghost tn-btn--sm" href="#/admin/categories/${encodeURIComponent(x.id)}">Sửa</a>
              <button class="tn-btn tn-btn--danger tn-btn--sm" data-action="ac-delete" data-id="${escapeHTML(x.id)}">Xóa</button>
            </div></td></tr>`).join('') || '<tr><td colspan="5" class="tn-muted">Chưa có danh mục</td></tr>'}</tbody>
        </table></div>
      </section>

      <form class="adm-card" id="cat-form" novalidate>
        <h2 class="adm-h2">${editing ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h2>
        <div class="tn-field"><label>Tên (Tiếng Việt) *</label><input id="c-name" value="${escapeHTML(c.name)}" maxlength="60"></div>
        <div class="tn-field"><label>Tên (English)</label><input id="c-name-en" value="${escapeHTML(c.name_en || '')}" maxlength="60"></div>
        <div class="tn-row">
          <div class="tn-field"><label>Kiểu hình minh họa</label><select id="c-art">${Object.entries(ART_TYPES).map(([k, l]) => `<option value="${k}" ${c.art === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
          <div class="tn-field"><label>Thứ tự hiển thị</label><input id="c-order" type="number" value="${escapeHTML(c.order || 1)}"></div>
        </div>
        <div class="tn-field"><label>Mô tả ngắn</label><input id="c-desc" value="${escapeHTML(c.desc || '')}" maxlength="120"></div>
        <div class="tn-field"><label>Description (EN)</label><input id="c-desc-en" value="${escapeHTML(c.desc_en || '')}" maxlength="120"></div>
        ${mediaFieldHTML('cimage', c.image, { label: 'Ảnh danh mục (không bắt buộc)', hint: 'Hiện trên thẻ danh mục ở trang chủ.' })}
        <div class="adm-form-actions">
          <button class="tn-btn tn-btn--primary" type="submit">${editing ? 'Lưu' : 'Thêm danh mục'}</button>
          ${editing ? `<a href="#/admin/categories" class="tn-btn tn-btn--ghost">Hủy</a>` : ''}
        </div>
      </form>
    </div>
  `);

  const form = $('#cat-form');
  bindMediaFields(form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = val('#c-name');
    if (!name) { toast('Vui lòng nhập tên danh mục', 'err'); return; }
    const data = { name, name_en: val('#c-name-en'), art: val('#c-art'), order: Number(val('#c-order')) || 0,
      desc: val('#c-desc'), desc_en: val('#c-desc-en'), image: readHidden(form, 'cimage') };
    const all = store.categories();
    if (editing) {
      const i = all.findIndex(x => x.id === editing.id);
      all[i] = { ...all[i], ...data };
      dropReplacedMedia([editing.image], [data.image]);
    } else {
      let cid = slugify(name) || 'dm';
      while (all.some(x => x.id === cid)) cid += '-2';
      all.push({ id: cid, ...data });
    }
    store.saveCategories(all);
    toast(editing ? 'Đã lưu danh mục' : 'Đã thêm danh mục', 'ok');
    location.hash = '/admin/categories';
    if (!editing) route();
  });
}
ADMIN_ACTIONS['ac-delete'] = (id) => {
  const c = getCategory(id);
  if (!c) return;
  const n = store.products().filter(p => p.category === id).length;
  if (n) { toast(`Danh mục đang có ${n} sản phẩm — chuyển sản phẩm sang danh mục khác trước khi xóa`, 'err'); return; }
  if (!confirm(`Xóa danh mục “${c.name}”?`)) return;
  store.saveCategories(store.categories().filter(x => x.id !== id));
  dropReplacedMedia([c.image], []);
  toast('Đã xóa danh mục', 'ok');
  location.hash = '/admin/categories'; route();
};
