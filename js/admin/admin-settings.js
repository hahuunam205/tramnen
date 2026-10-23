/* TRAM NEN · admin/admin-settings.js
   Thông tin shop + mạng xã hội + chính sách, Hộp thư, Quản trị viên (tối đa 3) */

function renderAdminSettings(app) {
  const s = settings();
  const f = (label, key, opts = {}) => `<div class="tn-field"><label>${label}</label>${opts.area
    ? `<textarea id="s-${key}" style="min-height:${opts.h || 80}px">${escapeHTML(s[key] ?? '')}</textarea>`
    : `<input id="s-${key}" type="${opts.type || 'text'}" value="${escapeHTML(s[key] ?? '')}" placeholder="${escapeHTML(opts.ph || '')}">`}</div>`;
  const pair = (label, key, opts) => `<div class="tn-row">${f(label + ' (Tiếng Việt)', key, opts)}${f(label + ' (English)', key + '_en', opts)}</div>`;
  const usage = mediaUsage();
  const subs = store.subscribers();

  adminMount(app, 'settings', 'Thông tin shop', `
    <form id="settings-form" novalidate class="adm-stack">
      <section class="adm-card">
        <h2 class="adm-h2">Thương hiệu</h2>
        ${f('Tên shop', 'name')}
        ${pair('Slogan', 'slogan')}
        ${pair('Giới thiệu ngắn (chân trang)', 'intro', { area: true, h: 60 })}
        ${pair('Câu chuyện thương hiệu (trang Về Trạm)', 'about', { area: true, h: 140 })}
        ${mediaFieldHTML('logo', s.logo, { accept: 'image/*', label: 'Logo tùy chỉnh (không bắt buộc)', hint: 'Để trống sẽ dùng logo TRAM NEN dạng vector (ngọn lửa + cửa vòm). Nên dùng PNG nền trong suốt, dạng ngang.' })}
      </section>

      <section class="adm-card">
        <h2 class="adm-h2">Liên hệ</h2>
        ${pair('Địa chỉ', 'address')}
        <div class="tn-row">${f('Số điện thoại', 'phone', { type: 'tel' })}${f('Email', 'email', { type: 'email' })}</div>
        ${pair('Giờ mở cửa', 'hours')}
      </section>

      <section class="adm-card">
        <h2 class="adm-h2">Mạng xã hội</h2>
        <p class="tn-hint" style="margin-bottom:10px">Dán đường dẫn trang của shop. Để trống mục nào thì biểu tượng đó sẽ ẩn. Ô Zalo có thể nhập số điện thoại.</p>
        <div class="social-fields">
          ${SOCIALS.map(([k, label]) => `<div class="tn-field social-field"><label>${ICONS[k]}${label}</label><input id="s-${k}" value="${escapeHTML(s[k] || '')}" placeholder="${k === 'zalo' ? '0900000000 hoặc https://zalo.me/...' : 'https://' + k + '.com/tramnen'}"></div>`).join('')}
        </div>
      </section>

      <section class="adm-card">
        <h2 class="adm-h2">Giao hàng</h2>
        <div class="tn-row">${f('Phí giao hàng (đồng)', 'shippingFee', { type: 'number' })}${f('Miễn phí giao cho đơn từ (đồng)', 'freeShipFrom', { type: 'number' })}</div>
      </section>

      <section class="adm-card">
        <h2 class="adm-h2">Chính sách (trang Chính sách & chân trang)</h2>
        ${pair('Chính sách giao hàng', 'policyShipping', { area: true })}
        ${pair('Chính sách đổi trả', 'policyReturn', { area: true })}
        ${pair('Chính sách bảo mật', 'policyPrivacy', { area: true })}
      </section>

      <div class="adm-form-actions adm-sticky-actions">
        <button class="tn-btn tn-btn--primary tn-btn--lg" type="submit">Lưu thông tin shop</button>
      </div>
    </form>

    <section class="adm-card">
      <h2 class="adm-h2">Người đăng ký nhận tin (${subs.length})</h2>
      ${subs.length ? `<ul class="adm-list">${subs.slice().reverse().map(x => `<li><span>${escapeHTML(x.email)}</span><span class="tn-muted">${fmtDate(x.at)}</span></li>`).join('')}</ul>`
        : '<p class="tn-muted">Chưa có ai đăng ký ở chân trang.</p>'}
    </section>

    <section class="adm-card">
      <h2 class="adm-h2">Dữ liệu & bộ nhớ</h2>
      <p class="tn-sub">Ảnh/video đã tải lên: <b>${usage.count} file · ${fmtSize(usage.total)}</b>, lưu trong trình duyệt này (IndexedDB).</p>
      <div class="adm-form-actions">
        <button class="tn-btn tn-btn--ghost" data-action="as-clean">Dọn file không còn dùng</button>
        <button class="tn-btn tn-btn--danger" data-action="as-reset">Khôi phục dữ liệu demo ban đầu</button>
      </div>
    </section>
  `);

  const form = $('#settings-form');
  bindMediaFields(form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const next = { ...s };
    ['name', 'slogan', 'slogan_en', 'intro', 'intro_en', 'about', 'about_en', 'address', 'address_en', 'phone', 'email', 'hours', 'hours_en',
     'policyShipping', 'policyShipping_en', 'policyReturn', 'policyReturn_en', 'policyPrivacy', 'policyPrivacy_en', ...SOCIALS.map(x => x[0])]
      .forEach(k => next[k] = ($('#s-' + k)?.value ?? '').trim());
    next.shippingFee = Math.max(0, Number(val('#s-shippingFee')) || 0);
    next.freeShipFrom = Math.max(0, Number(val('#s-freeShipFrom')) || 0);
    next.logo = readHidden(form, 'logo');
    if (!next.name) { toast('Tên shop không được để trống', 'err'); return; }
    if (next.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) { toast('Email không hợp lệ', 'err'); return; }
    const bad = SOCIALS.find(([k]) => next[k] && k !== 'zalo' && !/^https?:\/\//i.test(next[k]));
    if (bad) { toast(`Link ${bad[1]} cần bắt đầu bằng https://`, 'err'); return; }
    if (!saveSettings(next)) return;
    dropReplacedMedia([s.logo], [next.logo]);
    toast('Đã lưu thông tin shop', 'ok');
    route();
  });
}
ADMIN_ACTIONS['as-clean'] = async () => {
  const used = collectMediaRefs();
  const unused = [...mediaCache.keys()].map(id => 'idb:' + id).filter(r => !used.has(r));
  for (const r of unused) await deleteMedia(r);
  toast(unused.length ? `Đã dọn ${unused.length} file không dùng` : 'Không có file thừa', 'ok');
  route();
};
ADMIN_ACTIONS['as-reset'] = async () => {
  if (!confirm('Xóa toàn bộ dữ liệu hiện tại (sản phẩm, đơn hàng, bài viết, ảnh đã tải…) và khôi phục dữ liệu demo?')) return;
  for (const id of [...mediaCache.keys()]) await deleteMedia('idb:' + id);
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  seed();
  toast('Đã khôi phục dữ liệu demo — vui lòng đăng nhập lại', 'ok');
  location.hash = '/admin/login';
  route();
};

/* ============================================================
   HỘP THƯ (tin nhắn từ trang Liên hệ)
   ============================================================ */
function renderAdminMessages(app) {
  const msgs = store.messages().slice().sort((a, b) => b.createdAt - a.createdAt);
  adminMount(app, 'messages', 'Hộp thư', msgs.length ? `<div class="adm-stack">${msgs.map(m => `
    <article class="adm-card msg-card ${m.read ? '' : 'unread'}">
      <div class="adm-card-head">
        <div><b>${escapeHTML(m.name)}</b> · <span class="tn-muted">${escapeHTML(m.contact)}</span><div class="tn-muted" style="font-size:12px">${new Date(m.createdAt).toLocaleString('vi-VN')}</div></div>
        <div class="tn-actions">
          <button class="tn-btn tn-btn--ghost tn-btn--sm" data-action="am-read" data-id="${escapeHTML(m.id)}">${m.read ? 'Đánh dấu chưa đọc' : 'Đã đọc'}</button>
          <button class="tn-btn tn-btn--danger tn-btn--sm" data-action="amsg-delete" data-id="${escapeHTML(m.id)}">Xóa</button>
        </div>
      </div>
      <p class="msg-body">${escapeHTML(m.message)}</p>
    </article>`).join('')}</div>` : '<div class="tn-empty"><p class="tn-sub">Chưa có tin nhắn nào từ trang Liên hệ.</p></div>');
}
ADMIN_ACTIONS['am-read'] = (id) => { const ms = store.messages(); const m = ms.find(x => x.id === id); if (m) { m.read = !m.read; store.saveMessages(ms); } route(); };
ADMIN_ACTIONS['amsg-delete'] = (id) => { if (!confirm('Xóa tin nhắn này?')) return; store.saveMessages(store.messages().filter(x => x.id !== id)); toast('Đã xóa', 'ok'); route(); };

/* ============================================================
   QUẢN TRỊ VIÊN — tối đa 3 tài khoản
   ============================================================ */
function renderAdminAccounts(app) {
  const me = currentAdmin();
  const admins = store.admins();
  const full = admins.length >= MAX_ADMINS;

  adminMount(app, 'accounts', 'Quản trị viên', `
    <div class="adm-grid-2 adm-grid-2--wide">
      <section class="adm-card">
        <div class="adm-card-head"><h2 class="adm-h2">Tài khoản quản trị</h2><span class="slot-count ${full ? 'full' : ''}">${admins.length}/${MAX_ADMINS}</span></div>
        <div class="slot-bar">${Array.from({ length: MAX_ADMINS }, (_, i) => `<i class="${i < admins.length ? 'on' : ''}"></i>`).join('')}</div>
        <ul class="adm-accounts">
          ${admins.map(a => `<li>
            <span class="tn-avatar">${escapeHTML(initials(a.displayName))}</span>
            <div><b>${escapeHTML(a.displayName)}</b>${a.id === me.id ? ' <span class="tn-chip tn-chip--done">Bạn</span>' : ''}<small>${escapeHTML(a.email)} · tạo ${fmtDate(a.createdAt)}</small></div>
            ${a.id !== me.id ? `<button class="tn-btn tn-btn--danger tn-btn--sm" data-action="aa-delete" data-id="${escapeHTML(a.id)}">Xóa</button>` : ''}
          </li>`).join('')}
        </ul>
        <p class="tn-hint">Mỗi website chỉ có tối đa ${MAX_ADMINS} quản trị viên. Muốn thêm người mới khi đã đủ, hãy xóa một tài khoản trước.</p>
      </section>

      <div class="adm-stack">
        <form class="adm-card" id="admin-add" novalidate>
          <h2 class="adm-h2">Đăng ký thêm quản trị viên</h2>
          ${full ? `<div class="tn-flash tn-flash--warn">Đã đủ ${MAX_ADMINS} tài khoản quản trị. Xóa một tài khoản để đăng ký người mới.</div>` : ''}
          <fieldset ${full ? 'disabled' : ''} class="plain-fieldset">
            <div class="tn-field"><label>Họ tên *</label><input id="aa-name" maxlength="60"></div>
            <div class="tn-field"><label>Email đăng nhập *</label><input id="aa-email" type="email" autocomplete="off"></div>
            <div class="tn-row">
              <div class="tn-field"><label>Mật khẩu *</label><input id="aa-pass" type="password" minlength="6" autocomplete="new-password"></div>
              <div class="tn-field"><label>Nhập lại mật khẩu *</label><input id="aa-pass2" type="password" autocomplete="new-password"></div>
            </div>
            <button class="tn-btn tn-btn--primary" type="submit">Tạo tài khoản quản trị</button>
          </fieldset>
        </form>

        <form class="adm-card" id="admin-pass" novalidate>
          <h2 class="adm-h2">Đổi mật khẩu của bạn</h2>
          <div class="tn-field"><label>Mật khẩu hiện tại</label><input id="ap-old" type="password" autocomplete="current-password"></div>
          <div class="tn-row">
            <div class="tn-field"><label>Mật khẩu mới</label><input id="ap-new" type="password" autocomplete="new-password"></div>
            <div class="tn-field"><label>Nhập lại</label><input id="ap-new2" type="password" autocomplete="new-password"></div>
          </div>
          <button class="tn-btn tn-btn--ghost" type="submit">Đổi mật khẩu</button>
        </form>
      </div>
    </div>
  `);

  $('#admin-add').addEventListener('submit', (e) => {
    e.preventDefault();
    const list = store.admins();
    if (list.length >= MAX_ADMINS) { toast(`Đã đủ ${MAX_ADMINS} quản trị viên — xóa bớt một tài khoản trước`, 'err'); return; }
    const name = val('#aa-name'), email = val('#aa-email').toLowerCase(), p1 = $('#aa-pass').value, p2 = $('#aa-pass2').value;
    if (!name || !email || !p1) { toast('Vui lòng điền đủ thông tin', 'err'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('Email không hợp lệ', 'err'); return; }
    if (p1.length < 6) { toast('Mật khẩu tối thiểu 6 ký tự', 'err'); return; }
    if (p1 !== p2) { toast('Mật khẩu nhập lại không khớp', 'err'); return; }
    if (list.some(a => a.email.toLowerCase() === email)) { toast('Email này đã là quản trị viên', 'err'); return; }
    list.push({ id: 'a_' + uid(), email, password: p1, displayName: name, createdAt: now() });
    store.saveAdmins(list);
    toast(`Đã tạo tài khoản cho ${name} (${list.length}/${MAX_ADMINS})`, 'ok');
    route();
  });

  $('#admin-pass').addEventListener('submit', (e) => {
    e.preventDefault();
    const list = store.admins();
    const u = list.find(a => a.id === me.id);
    if ($('#ap-old').value !== u.password) { toast('Mật khẩu hiện tại không đúng', 'err'); return; }
    const n1 = $('#ap-new').value;
    if (n1.length < 6) { toast('Mật khẩu mới tối thiểu 6 ký tự', 'err'); return; }
    if (n1 !== $('#ap-new2').value) { toast('Mật khẩu nhập lại không khớp', 'err'); return; }
    u.password = n1; store.saveAdmins(list);
    e.target.reset(); toast('Đã đổi mật khẩu', 'ok');
  });
}
ADMIN_ACTIONS['aa-delete'] = (id) => {
  const me = currentAdmin();
  const a = store.admins().find(x => x.id === id);
  if (!a || a.id === me.id) return;
  if (!confirm(`Xóa quyền quản trị của ${a.displayName} (${a.email})?`)) return;
  store.saveAdmins(store.admins().filter(x => x.id !== id));
  toast('Đã xóa tài khoản — có thể đăng ký người mới', 'ok'); route();
};
