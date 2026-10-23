/* TRAM NEN · admin/admin-core.js
   Định tuyến khu quản trị, đăng nhập, bố cục thanh bên, tổng quan, ô tải ảnh/video dùng chung */

const ADMIN_NAV = [
  ['', 'Tổng quan', 'leaf'],
  ['products', 'Sản phẩm', 'bag'],
  ['categories', 'Danh mục', 'tag'],
  ['orders', 'Đơn hàng', 'truck'],
  ['discounts', 'Mã giảm giá', 'gift'],
  ['blog', 'Blog', 'copy'],
  ['home', 'Trang chủ', 'play'],
  ['members', 'Thành viên', 'flame'],
  ['settings', 'Thông tin shop', 'pin'],
  ['messages', 'Hộp thư', 'mail'],
  ['accounts', 'Quản trị viên', 'phone']
];
const ADMIN_ACTIONS = {};

function adminRoute(app, parts, params) {
  const [a, b, c] = parts;
  if (a === 'login') return renderAdminLogin(app);
  const u = currentAdmin();
  if (!u) { location.hash = '/admin/login'; return; }

  if (!a) return renderAdminDashboard(app);
  if (a === 'products') return b === 'new' ? renderAdminProductForm(app) : b === 'edit' && c ? renderAdminProductForm(app, c) : renderAdminProducts(app, params);
  if (a === 'categories') return renderAdminCategories(app, b);
  if (a === 'orders') return renderAdminOrders(app);
  if (a === 'discounts') return renderAdminDiscounts(app, b);
  if (a === 'blog') return b === 'new' ? renderAdminPostForm(app) : b === 'edit' && c ? renderAdminPostForm(app, c) : renderAdminBlog(app);
  if (a === 'home') return renderAdminHome(app);
  if (a === 'members') return renderAdminMembers(app, b);
  if (a === 'settings') return renderAdminSettings(app);
  if (a === 'messages') return renderAdminMessages(app);
  if (a === 'accounts') return renderAdminAccounts(app);
  renderAdminDashboard(app);
}

function adminShell(active, title, content, actionsHTML = '') {
  const u = currentAdmin();
  const pending = store.orders().filter(o => o.status === 'pending').length;
  const unread = store.messages().filter(m => !m.read).length;
  const badge = { orders: pending, messages: unread };
  return `
    <div class="adm">
      <aside class="adm-side" id="adm-side">
        <a href="#/admin" class="adm-logo">${logoHTML('light')}</a>
        <nav class="adm-nav">
          ${ADMIN_NAV.map(([k, label, ic]) => `<a href="#/admin${k ? '/' + k : ''}" class="${active === k ? 'active' : ''}">${icon(ic)}<span>${label}</span>${badge[k] ? `<em>${badge[k]}</em>` : ''}</a>`).join('')}
        </nav>
        <div class="adm-side-foot">
          <a href="#/" class="adm-view">${icon('arrowRight')} Xem website</a>
          <div class="adm-user"><span class="tn-avatar">${escapeHTML(initials(u.displayName))}</span><div><b>${escapeHTML(u.displayName)}</b><small>${escapeHTML(u.email)}</small></div></div>
          <button class="tn-btn tn-btn--ghost tn-btn--sm tn-btn--block" data-action="admin-logout">Đăng xuất</button>
        </div>
      </aside>
      <div class="adm-main">
        <header class="adm-top">
          <button class="tn-icon-btn adm-burger" data-action="admin-menu" aria-label="Menu">${ICONS.menu}</button>
          <h1>${title}</h1>
          <div class="adm-top-actions">${actionsHTML}</div>
        </header>
        <div class="adm-content">${content}</div>
      </div>
    </div>`;
}
const adminMount = (app, active, title, content, actions) => mount(app, adminShell(active, title, content, actions));

ADMIN_ACTIONS['admin-logout'] = () => { setSession(null); toast('Đã đăng xuất', 'ok'); location.hash = '/'; };
ADMIN_ACTIONS['admin-menu'] = () => document.body.classList.toggle('adm-menu-open');

/* ============================================================
   ĐĂNG NHẬP QUẢN TRỊ
   ============================================================ */
function renderAdminLogin(app) {
  if (currentAdmin()) { location.hash = '/admin'; return; }
  mount(app, `
    <div class="adm-login">
      <div class="adm-login-card">
        <a href="#/" class="adm-login-logo">${logoHTML('dark')}</a>
        <h1>Đăng nhập quản trị</h1>
        <p class="tn-sub">Khu vực dành riêng cho quản trị viên ${escapeHTML(settings().name)}.</p>
        <form class="tn-form" id="admin-login" novalidate style="max-width:none">
          <div class="tn-field"><label for="al-email">Email</label><input id="al-email" type="email" autocomplete="username"></div>
          <div class="tn-field"><label for="al-pass">Mật khẩu</label><input id="al-pass" type="password" autocomplete="current-password"></div>
          <button class="tn-btn tn-btn--primary tn-btn--lg tn-btn--block" type="submit">Đăng nhập</button>
        </form>
        <div class="demo-creds"><b>Tài khoản demo</b>admin@tramnen.vn · demo1234
          <button type="button" id="al-fill">Điền sẵn</button></div>
        <p class="tn-hint" style="margin-top:14px">Tối đa ${MAX_ADMINS} tài khoản quản trị. Tài khoản mới do quản trị viên hiện có tạo trong mục “Quản trị viên”.</p>
        <a href="#/" class="tn-link-arrow" style="margin-top:10px">← Về trang chủ</a>
      </div>
    </div>`);
  $('#al-fill').addEventListener('click', () => { $('#al-email').value = 'admin@tramnen.vn'; $('#al-pass').value = 'demo1234'; });
  $('#admin-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#al-email').value.trim().toLowerCase(), pass = $('#al-pass').value;
    const u = store.admins().find(a => a.email.toLowerCase() === email && a.password === pass);
    if (!u) { toast('Email hoặc mật khẩu không đúng', 'err'); return; }
    setSession(u.id);
    toast('Xin chào ' + u.displayName, 'ok');
    location.hash = '/admin';
  });
}

/* ============================================================
   TỔNG QUAN
   ============================================================ */
function renderAdminDashboard(app) {
  const orders = store.orders().slice().sort((a, b) => b.createdAt - a.createdAt);
  const products = store.products();
  const done = orders.filter(o => o.status === 'done');
  const revenue = done.reduce((s, o) => s + o.total, 0);
  const pending = orders.filter(o => o.status === 'pending');
  const low = [];
  products.filter(p => p.status === 'active').forEach(p => p.variants.forEach(v => { if (v.stock <= 5) low.push({ p, v }); }));
  const usage = mediaUsage();
  const unread = store.messages().filter(m => !m.read).length;

  adminMount(app, '', 'Tổng quan', `
    <div class="adm-stats">
      <div class="tn-stat"><div class="tn-stat-label">Doanh thu (đơn hoàn tất)</div><div class="tn-stat-value">${fmtVND(revenue)}</div><div class="tn-stat-delta">${done.length} đơn hoàn tất</div></div>
      <div class="tn-stat"><div class="tn-stat-label">Đơn chờ xác nhận</div><div class="tn-stat-value">${pending.length}</div><div class="tn-stat-delta">${orders.length} đơn tất cả</div></div>
      <div class="tn-stat"><div class="tn-stat-label">Sản phẩm đang bán</div><div class="tn-stat-value">${products.filter(p => p.status === 'active').length}</div><div class="tn-stat-delta">${products.filter(isOnSale).length} đang sale</div></div>
      <div class="tn-stat"><div class="tn-stat-label">Tin nhắn chưa đọc</div><div class="tn-stat-value">${unread}</div><div class="tn-stat-delta">${store.subscribers().length} người đăng ký nhận tin</div></div>
    </div>

    <div class="adm-grid-2">
      <section class="adm-card">
        <div class="adm-card-head"><h2>Đơn hàng mới</h2><a href="#/admin/orders" class="tn-link-arrow">Tất cả →</a></div>
        <div class="tn-table-wrap"><table class="tn-table">
          <thead><tr><th>Mã</th><th>Khách</th><th>Tổng</th><th>Trạng thái</th></tr></thead>
          <tbody>${orders.slice(0, 6).map(o => `<tr><td><b>${escapeHTML(o.code)}</b><div class="tn-muted" style="font-size:12px">${fmtRelative(o.createdAt)}</div></td>
            <td>${escapeHTML(o.customer.name)}</td><td>${fmtVND(o.total)}</td><td>${adminStatusChip(o.status)}</td></tr>`).join('') || '<tr><td colspan="4" class="tn-muted">Chưa có đơn</td></tr>'}</tbody>
        </table></div>
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><h2>Sắp hết hàng (≤ 5)</h2><a href="#/admin/products" class="tn-link-arrow">Sản phẩm →</a></div>
        ${low.length ? `<ul class="adm-list">${low.slice(0, 8).map(({ p, v }) => `<li><a href="#/admin/products/edit/${encodeURIComponent(p.id)}">${escapeHTML(p.name)} · <b>${escapeHTML(v.label)}</b></a><span class="${v.stock <= 0 ? 'txt-danger' : 'txt-warn'}">còn ${v.stock}</span></li>`).join('')}</ul>`
          : '<p class="tn-muted">Tất cả phân loại đều còn hàng.</p>'}
      </section>
    </div>

    <section class="adm-card">
      <div class="adm-card-head"><h2>Lối tắt</h2></div>
      <div class="adm-shortcuts">
        <a href="#/admin/products/new">${icon('bag')}Thêm sản phẩm</a>
        <a href="#/admin/blog/new">${icon('copy')}Viết bài blog</a>
        <a href="#/admin/discounts">${icon('gift')}Tạo mã giảm giá</a>
        <a href="#/admin/home">${icon('play')}Ảnh & video trang chủ</a>
        <a href="#/admin/settings">${icon('pin')}Thông tin shop</a>
      </div>
      <p class="tn-hint" style="margin-top:12px">Kho ảnh/video đã tải lên: ${usage.count} file · ${fmtSize(usage.total)} (lưu trong trình duyệt này).</p>
    </section>
  `);
}

const ADMIN_STATUS = { pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', shipping: 'Đang giao', done: 'Hoàn tất', cancelled: 'Đã hủy' };
const adminStatusChip = (s) => `<span class="tn-chip tn-chip--${s}">${ADMIN_STATUS[s] || s}</span>`;

/* ============================================================
   Ô TẢI ẢNH / VIDEO DÙNG CHUNG (lưu vào IndexedDB — nhận file lớn)
   ============================================================ */
function mediaPreviewHTML(ref) {
  const url = mediaURL(ref);
  if (!url) return `<span class="mf-empty">${icon('play')}Chưa có file</span>`;
  return isVideoRef(ref) ? `<video src="${escapeHTML(url)}" muted loop autoplay playsinline></video>` : `<img src="${escapeHTML(url)}" alt="">`;
}
function mediaFieldHTML(name, ref, { accept = 'image/*', label = '', hint = '' } = {}) {
  const info = mediaInfo(ref);
  return `<div class="mf" data-mf="${name}">
    ${label ? `<div class="mf-label">${label}</div>` : ''}
    <input type="hidden" name="${name}" value="${escapeHTML(ref || '')}">
    <div class="mf-row">
      <div class="mf-preview">${mediaPreviewHTML(ref)}</div>
      <div class="mf-side">
        <div class="mf-actions">
          <label class="tn-btn tn-btn--ghost tn-btn--sm mf-upload">Tải file lên<input type="file" accept="${accept}" hidden></label>
          <button type="button" class="tn-btn tn-btn--danger tn-btn--sm" data-mf-remove ${ref ? '' : 'hidden'}>Bỏ</button>
        </div>
        <div class="mf-info">${info ? `${escapeHTML(info.name)} · ${fmtSize(info.size)}` : ''}</div>
        <input type="text" class="mf-url" placeholder="hoặc đường dẫn: img/... hay https://..." value="${escapeHTML(ref && !String(ref).startsWith('idb:') ? ref : '')}">
        ${hint ? `<p class="tn-hint">${hint}</p>` : ''}
      </div>
    </div>
  </div>`;
}
function mediaListHTML(name, refs = [], { accept = 'image/*', max = 10, label = '' } = {}) {
  refs = (refs || []).filter(Boolean);
  return `<div class="ml" data-ml="${name}" data-max="${max}" data-accept="${accept}">
    ${label ? `<div class="mf-label">${label} <span class="tn-muted">(${refs.length}/${max})</span></div>` : ''}
    <input type="hidden" name="${name}" value="${escapeHTML(JSON.stringify(refs))}">
    <div class="ml-grid">
      ${refs.map((r, i) => `<div class="ml-item">${mediaPreviewHTML(r)}<button type="button" data-ml-remove="${i}" aria-label="Xóa">${ICONS.close}</button>
        ${i > 0 ? `<button type="button" class="ml-left" data-ml-left="${i}" aria-label="Lên trước">‹</button>` : ''}</div>`).join('')}
      ${refs.length < max ? `<label class="ml-add">+<span>Thêm</span><input type="file" accept="${accept}" multiple hidden></label>` : ''}
    </div>
  </div>`;
}

/* gắn sự kiện cho mọi ô media trong root; onChange gọi sau mỗi thay đổi */
function bindMediaFields(root, onChange = () => {}) {
  $$('.mf', root).forEach(box => bindMediaField(box, onChange));
  $$('.ml', root).forEach(box => bindMediaList(box, onChange));
}

function bindMediaField(box, onChange) {
  const hidden = box.querySelector('input[type=hidden]');
  const paint = () => {
    const ref = hidden.value;
    box.querySelector('.mf-preview').innerHTML = mediaPreviewHTML(ref);
    const info = mediaInfo(ref);
    box.querySelector('.mf-info').textContent = info ? `${info.name} · ${fmtSize(info.size)}` : '';
    box.querySelector('[data-mf-remove]').hidden = !ref;
    onChange();
  };
  box.querySelector('input[type=file]').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const lbl = box.querySelector('.mf-upload');
    lbl.classList.add('loading');
    try {
      hidden.value = await saveMedia(file);
      box.querySelector('.mf-url').value = '';
      const inf = mediaInfo(hidden.value);
      toast(inf && inf.size < file.size ? `Đã tải lên & tối ưu ${file.name}: ${fmtSize(file.size)} → ${fmtSize(inf.size)}` : `Đã tải lên ${file.name} (${fmtSize(file.size)})`, 'ok');
    } catch (err) { toast(err.message, 'err'); }
    lbl.classList.remove('loading');
    e.target.value = '';
    paint();
  });
  box.querySelector('.mf-url').addEventListener('change', (e) => { hidden.value = e.target.value.trim(); paint(); });
  box.querySelector('[data-mf-remove]').addEventListener('click', () => { hidden.value = ''; box.querySelector('.mf-url').value = ''; paint(); });
}

function bindMediaList(box, onChange) {
  const name = box.dataset.ml, max = Number(box.dataset.max) || 10;
  const accept = box.dataset.accept || box.querySelector('input[type=file]')?.accept || 'image/*';
  const labelEl = box.querySelector('.mf-label');
  const label = labelEl ? labelEl.childNodes[0].textContent.trim() : '';
  const hidden = box.querySelector('input[type=hidden]');
  const get = () => { try { return JSON.parse(hidden.value || '[]'); } catch { return []; } };
  const rebuild = (arr) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = mediaListHTML(name, arr, { accept, max, label });
    const fresh = tmp.firstElementChild;
    fresh.dataset.accept = accept;
    box.replaceWith(fresh);
    bindMediaList(fresh, onChange);
    onChange();
  };
  box.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-ml-remove]');
    const lf = e.target.closest('[data-ml-left]');
    if (rm) { const a = get(); a.splice(+rm.dataset.mlRemove, 1); rebuild(a); }
    if (lf) { const a = get(), i = +lf.dataset.mlLeft; [a[i - 1], a[i]] = [a[i], a[i - 1]]; rebuild(a); }
  });
  box.querySelector('input[type=file]')?.addEventListener('change', async (e) => {
    const arr = get();
    const files = Array.from(e.target.files).slice(0, max - arr.length);
    box.querySelector('.ml-add')?.classList.add('loading');
    let ok = 0;
    for (const f of files) {
      try { arr.push(await saveMedia(f)); ok++; } catch (err) { toast(`${f.name}: ${err.message}`, 'err'); }
    }
    if (ok) toast(`Đã tải lên ${ok} file`, 'ok');
    rebuild(arr);
  });
}
const readHidden = (root, name) => root.querySelector(`input[type=hidden][name="${name}"]`)?.value || '';
const readList = (root, name) => { try { return JSON.parse(readHidden(root, name) || '[]'); } catch { return []; } };

/* xóa file cũ trong IndexedDB khi đã được thay thế */
function dropReplacedMedia(oldRefs, newRefs) {
  const keep = new Set([].concat(newRefs).filter(Boolean));
  /* chạy sau khi dữ liệu mới đã được lưu, để kiểm tra tham chiếu chính xác */
  setTimeout(() => {
    const used = collectMediaRefs();
    [].concat(oldRefs).filter(Boolean).forEach(r => { if (!keep.has(r) && !used.has(r)) deleteMedia(r); });
  }, 0);
}
/* tìm mọi tham chiếu media đang được dùng trong dữ liệu */
function collectMediaRefs() {
  const refs = new Set();
  const scan = (v) => {
    if (typeof v === 'string') { if (v.startsWith('idb:')) refs.add(v); }
    else if (Array.isArray(v)) v.forEach(scan);
    else if (v && typeof v === 'object') Object.values(v).forEach(scan);
  };
  ['products', 'categories', 'posts', 'members'].forEach(k => scan(store[k]()));
  scan(store.get(KEYS.home, {})); scan(store.get(KEYS.settings, {}));
  return refs;
}
const isMediaReferenced = (ref) => collectMediaRefs().has(ref);

/* bộ chọn màu nền minh họa */
function palettePickerHTML(cur) {
  return `<div class="palette-picker" id="palette-picker">
    ${PALETTES.map((c, i) => `<button type="button" class="palette-swatch ${i === Number(cur) ? 'active' : ''}" data-idx="${i}" style="background:linear-gradient(135deg,${c[0]},${c[1]})" aria-label="Bảng màu ${i + 1}"></button>`).join('')}
  </div>`;
}
function bindPalettePicker(root, onPick) {
  $$('#palette-picker .palette-swatch', root).forEach(sw => sw.addEventListener('click', () => {
    $$('#palette-picker .palette-swatch', root).forEach(s => s.classList.toggle('active', s === sw));
    onPick(+sw.dataset.idx);
  }));
}
const val = (sel) => ($(sel)?.value ?? '').trim();
