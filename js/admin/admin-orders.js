/* TRAM NEN · admin/admin-orders.js
   Đơn hàng (lọc, chuyển trạng thái, hủy, XÓA, xem chi tiết) và Mã giảm giá */

let adminOrderFilter = 'all';
let adminOrderQuery = '';

function renderAdminOrders(app) {
  const all = store.orders().slice().sort((a, b) => b.createdAt - a.createdAt);
  let list = adminOrderFilter === 'all' ? all : all.filter(o => o.status === adminOrderFilter);
  const q = normalizeText(adminOrderQuery);
  if (q) list = list.filter(o => normalizeText(`${o.code} ${o.customer.name} ${o.customer.phone}`).includes(q));
  const NEXT_LABEL = { pending: 'Xác nhận', confirmed: 'Giao hàng', shipping: 'Hoàn tất' };

  adminMount(app, 'orders', 'Đơn hàng', `
    <div class="adm-toolbar">
      <div class="tn-chips" id="ord-filter">
        ${[['all', 'Tất cả'], ...Object.entries(ADMIN_STATUS)].map(([k, l]) => {
          const n = k === 'all' ? all.length : all.filter(o => o.status === k).length;
          return `<button class="tn-chip-btn ${adminOrderFilter === k ? 'active' : ''}" data-f="${k}">${l} (${n})</button>`;
        }).join('')}
      </div>
      <div class="tn-search">${ICONS.search}<input id="ord-q" type="search" placeholder="Mã đơn, tên, SĐT…" value="${escapeHTML(adminOrderQuery)}"></div>
    </div>
    <section class="adm-card adm-card--flush">
      <div class="tn-table-wrap"><table class="tn-table">
        <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Tổng</th><th>Thanh toán</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>
          ${list.map(o => `<tr>
            <td><button class="tn-link-btn" data-action="ao-view" data-id="${escapeHTML(o.id)}"><b>${escapeHTML(o.code)}</b></button><div class="tn-muted" style="font-size:12px">${fmtRelative(o.createdAt)}</div></td>
            <td>${escapeHTML(o.customer.name)}<div class="tn-muted" style="font-size:12px">${escapeHTML(o.customer.phone)}</div></td>
            <td class="tn-muted" style="font-size:13px;max-width:260px">${o.items.map(i => `${escapeHTML(i.name)} <b>${escapeHTML(i.variantLabel || '')}</b> ×${i.qty}`).join('<br>')}</td>
            <td><b>${fmtVND(o.total)}</b>${o.discountCode ? `<div class="tn-muted" style="font-size:12px">${escapeHTML(o.discountCode)} −${o.discountPercent}%</div>` : ''}</td>
            <td class="tn-muted">${o.payment === 'bank' ? 'Chuyển khoản' : 'COD'}</td>
            <td>${adminStatusChip(o.status)}</td>
            <td><div class="tn-actions">
              ${NEXT_STATUS[o.status] ? `<button class="tn-btn tn-btn--primary tn-btn--sm" data-action="ao-next" data-id="${escapeHTML(o.id)}">${NEXT_LABEL[o.status]}</button>` : ''}
              ${['pending', 'confirmed'].includes(o.status) ? `<button class="tn-btn tn-btn--ghost tn-btn--sm" data-action="ao-cancel" data-id="${escapeHTML(o.id)}">Hủy</button>` : ''}
              <button class="tn-btn tn-btn--danger tn-btn--sm" data-action="ao-delete" data-id="${escapeHTML(o.id)}">Xóa</button>
            </div></td>
          </tr>`).join('') || '<tr><td colspan="7" class="tn-muted" style="text-align:center;padding:30px">Không có đơn hàng</td></tr>'}
        </tbody>
      </table></div>
    </section>
  `);
  $$('#ord-filter [data-f]').forEach(b => b.addEventListener('click', () => { adminOrderFilter = b.dataset.f; renderAdminOrders(app); }));
  const qi = $('#ord-q');
  qi.addEventListener('input', debounce(() => {
    adminOrderQuery = qi.value; renderAdminOrders(app);
    const el = $('#ord-q'); el.focus(); el.setSelectionRange(el.value.length, el.value.length);
  }, 250));
}

const updateOrder = (id, fn) => {
  const os = store.orders(); const o = os.find(x => x.id === id);
  if (!o) return null; fn(o); o.updatedAt = now(); store.saveOrders(os); return o;
};
ADMIN_ACTIONS['ao-next'] = (id) => { const o = updateOrder(id, o => { if (NEXT_STATUS[o.status]) o.status = NEXT_STATUS[o.status]; }); toast(`Đơn ${o.code}: ${ADMIN_STATUS[o.status]}`, 'ok'); route(); };
ADMIN_ACTIONS['ao-cancel'] = (id) => {
  const o = store.orders().find(x => x.id === id);
  if (!o || !confirm(`Hủy đơn ${o.code}? Hàng sẽ được trả lại kho.`)) return;
  updateOrder(id, x => x.status = 'cancelled'); restoreStock(o);
  toast(`Đã hủy đơn ${o.code}`, 'ok'); route();
};
ADMIN_ACTIONS['ao-delete'] = (id) => {
  const o = store.orders().find(x => x.id === id);
  if (!o) return;
  const active = !['done', 'cancelled'].includes(o.status);
  if (!confirm(`Xóa vĩnh viễn đơn ${o.code}?${active ? '\nĐơn chưa hoàn tất — số lượng sẽ được trả lại kho.' : ''}`)) return;
  if (active) restoreStock(o);
  store.saveOrders(store.orders().filter(x => x.id !== id));
  toast(`Đã xóa đơn ${o.code}`, 'ok'); route();
};
ADMIN_ACTIONS['ao-view'] = (id) => {
  const o = store.orders().find(x => x.id === id);
  if (!o) return;
  mountModal(`
    <div class="tn-modal-head"><div><h3 class="tn-h3">Đơn ${escapeHTML(o.code)}</h3><div class="tn-muted" style="font-size:12.5px">${new Date(o.createdAt).toLocaleString('vi-VN')}</div></div>
      <button class="tn-modal-close" data-modal-close aria-label="Đóng">${ICONS.close}</button></div>
    <div class="tn-modal-body">
      <div style="margin-bottom:12px">${adminStatusChip(o.status)}</div>
      <dl class="profile-list">
        <div><dt>Khách hàng</dt><dd>${escapeHTML(o.customer.name)} · ${escapeHTML(o.customer.phone)}${o.customer.email ? ' · ' + escapeHTML(o.customer.email) : ''}</dd></div>
        <div><dt>Địa chỉ</dt><dd>${escapeHTML(o.customer.address)}</dd></div>
        <div><dt>Thanh toán</dt><dd>${o.payment === 'bank' ? 'Chuyển khoản' : 'Thanh toán khi nhận hàng'}</dd></div>
        ${o.note ? `<div><dt>Ghi chú</dt><dd>${escapeHTML(o.note)}</dd></div>` : ''}
      </dl>
      <div class="co-summary">
        ${o.items.map(i => `<div class="sum-row"><span>${escapeHTML(i.name)} · ${escapeHTML(i.variantLabel || '')} × ${i.qty}</span><span>${fmtVND(i.price * i.qty)}</span></div>`).join('')}
        <div class="sum-row"><span>Tạm tính</span><span>${fmtVND(o.subtotal)}</span></div>
        ${o.discountCode ? `<div class="sum-row sum-row--discount"><span>Mã ${escapeHTML(o.discountCode)} (−${o.discountPercent}%)</span><span>−${fmtVND(o.discountAmount)}</span></div>` : ''}
        <div class="sum-row"><span>Phí giao</span><span>${o.shipping ? fmtVND(o.shipping) : 'Miễn phí'}</span></div>
        <div class="sum-row sum-row--total"><span>Tổng</span><span>${fmtVND(o.total)}</span></div>
      </div>
    </div>`);
};

/* ============================================================
   MÃ GIẢM GIÁ
   ============================================================ */
function renderAdminDiscounts(app, editId) {
  const list = store.discounts().slice().sort((a, b) => b.createdAt - a.createdAt);
  const editing = editId ? list.find(d => d.id === editId) : null;
  const d = editing || { code: '', percent: 10, active: true, public: true, limit: 0, expiresAt: null, note: '', note_en: '' };
  const expired = (x) => x.expiresAt && x.expiresAt < now();
  const dateVal = d.expiresAt ? new Date(d.expiresAt - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10) : '';

  adminMount(app, 'discounts', 'Mã giảm giá', `
    <div class="adm-grid-2 adm-grid-2--wide">
      <section class="adm-card adm-card--flush">
        <div class="tn-table-wrap"><table class="tn-table">
          <thead><tr><th>Mã</th><th>Giảm</th><th>Đã dùng</th><th>Hết hạn</th><th>Công khai</th><th>Bật</th><th></th></tr></thead>
          <tbody>${list.map(x => `<tr class="${editing && editing.id === x.id ? 'row-active' : ''}">
            <td><code class="code-tag">${escapeHTML(x.code)}</code><div class="tn-muted" style="font-size:12px">${escapeHTML(x.note || '')}</div></td>
            <td><b>${x.percent}%</b></td>
            <td>${x.used || 0}${x.limit ? ' / ' + x.limit : ''}</td>
            <td class="${expired(x) ? 'txt-danger' : 'tn-muted'}">${x.expiresAt ? fmtDate(x.expiresAt) : 'Không'}</td>
            <td><label class="flt-switch"><input type="checkbox" data-action="ad-public" data-id="${escapeHTML(x.id)}" ${x.public ? 'checked' : ''}><span class="sw"></span></label></td>
            <td><label class="flt-switch"><input type="checkbox" data-action="ad-active" data-id="${escapeHTML(x.id)}" ${x.active ? 'checked' : ''}><span class="sw"></span></label></td>
            <td><div class="tn-actions">
              <a class="tn-btn tn-btn--ghost tn-btn--sm" href="#/admin/discounts/${encodeURIComponent(x.id)}">Sửa</a>
              <button class="tn-btn tn-btn--danger tn-btn--sm" data-action="ad-delete" data-id="${escapeHTML(x.id)}">Xóa</button>
            </div></td></tr>`).join('') || '<tr><td colspan="7" class="tn-muted" style="text-align:center;padding:30px">Chưa có mã</td></tr>'}</tbody>
        </table></div>
      </section>

      <form class="adm-card" id="disc-form" novalidate>
        <h2 class="adm-h2">${editing ? 'Sửa mã giảm giá' : 'Tạo mã giảm giá'}</h2>
        <div class="tn-row">
          <div class="tn-field"><label>Mã *</label><input id="d-code" value="${escapeHTML(d.code)}" maxlength="20" placeholder="VD: TRAMNEN20" style="text-transform:uppercase"></div>
          <div class="tn-field"><label>Mức giảm (%) *</label><input id="d-percent" type="number" min="1" max="90" value="${escapeHTML(d.percent)}"></div>
        </div>
        <div class="tn-row">
          <div class="tn-field"><label>Giới hạn lượt dùng</label><input id="d-limit" type="number" min="0" value="${escapeHTML(d.limit || 0)}"><p class="tn-hint">0 = không giới hạn</p></div>
          <div class="tn-field"><label>Ngày hết hạn</label><input id="d-exp" type="date" value="${dateVal}"><p class="tn-hint">Để trống = không hết hạn</p></div>
        </div>
        <div class="tn-field"><label>Mô tả (Tiếng Việt)</label><input id="d-note" value="${escapeHTML(d.note || '')}" maxlength="80" placeholder="VD: Giảm 20% mùa lễ hội"></div>
        <div class="tn-field"><label>Description (EN)</label><input id="d-note-en" value="${escapeHTML(d.note_en || '')}" maxlength="80"></div>
        <label class="flt-switch"><input type="checkbox" id="d-active" ${d.active ? 'checked' : ''}><span class="sw"></span>Kích hoạt (khách dùng được)</label>
        <label class="flt-switch"><input type="checkbox" id="d-public" ${d.public ? 'checked' : ''}><span class="sw"></span>Hiện công khai ở trang Sale & trang chủ</label>
        <div class="adm-form-actions">
          <button class="tn-btn tn-btn--primary" type="submit">${editing ? 'Lưu' : 'Tạo mã'}</button>
          ${editing ? `<a href="#/admin/discounts" class="tn-btn tn-btn--ghost">Hủy</a>` : ''}
        </div>
      </form>
    </div>
  `);

  $('#disc-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = val('#d-code').toUpperCase().replace(/\s+/g, '');
    const percent = parseInt(val('#d-percent'), 10);
    if (!/^[A-Z0-9_-]{3,20}$/.test(code)) { toast('Mã gồm 3–20 ký tự chữ/số (không dấu, không khoảng trắng)', 'err'); return; }
    if (!(percent >= 1 && percent <= 90)) { toast('Mức giảm từ 1% đến 90%', 'err'); return; }
    const all = store.discounts();
    if (all.some(x => x.code === code && x.id !== editing?.id)) { toast('Mã này đã tồn tại', 'err'); return; }
    const exp = val('#d-exp');
    const data = { code, percent, limit: Math.max(0, parseInt(val('#d-limit'), 10) || 0),
      expiresAt: exp ? new Date(exp + 'T23:59:59').getTime() : null,
      note: val('#d-note'), note_en: val('#d-note-en'), active: $('#d-active').checked, public: $('#d-public').checked };
    if (editing) { const i = all.findIndex(x => x.id === editing.id); all[i] = { ...all[i], ...data }; }
    else all.push({ id: 'd_' + uid(), used: 0, createdAt: now(), ...data });
    store.saveDiscounts(all);
    toast(editing ? 'Đã lưu mã' : `Đã tạo mã ${code}`, 'ok');
    location.hash = '/admin/discounts';
    if (!editing) route();
  });
}
const updateDiscount = (id, fn) => { const ds = store.discounts(); const d = ds.find(x => x.id === id); if (d) { fn(d); store.saveDiscounts(ds); } return d; };
ADMIN_ACTIONS['ad-active'] = (id, el) => { const d = updateDiscount(id, d => d.active = !d.active); toast(`${d.code}: ${d.active ? 'đã kích hoạt' : 'đã tắt'}`, 'ok'); route(); };
ADMIN_ACTIONS['ad-public'] = (id) => { const d = updateDiscount(id, d => d.public = !d.public); toast(`${d.code}: ${d.public ? 'hiện công khai' : 'chỉ khách biết mã mới dùng được'}`, 'ok'); route(); };
ADMIN_ACTIONS['ad-delete'] = (id) => {
  const d = store.discounts().find(x => x.id === id);
  if (!d || !confirm(`Xóa mã ${d.code}?`)) return;
  store.saveDiscounts(store.discounts().filter(x => x.id !== id));
  if (store.get(KEYS.cartCode, null) === d.code) store.set(KEYS.cartCode, null);
  toast('Đã xóa mã', 'ok'); location.hash = '/admin/discounts'; route();
};
