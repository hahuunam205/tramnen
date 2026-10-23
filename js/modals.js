/* TRAM NEN · modals.js
   Hộp thoại: xem nhanh (chọn phân loại, thắp thử), đặt hàng, đặt thành công, xem ảnh/video */

let openModalCount = 0;

function mountModal(html, opts = {}) {
  const backdrop = document.createElement('div');
  backdrop.className = 'tn-modal-backdrop' + (opts.dark ? ' tn-modal-backdrop--dark' : '');
  backdrop.innerHTML = `<div class="tn-modal ${opts.cls || ''}" role="dialog" aria-modal="true" tabindex="-1">${html}</div>`;
  document.body.appendChild(backdrop);
  const modal = backdrop.firstElementChild;
  const prevFocus = document.activeElement;
  openModalCount++;
  document.body.classList.add('tn-modal-open');

  let closed = false;
  const onKey = (e) => {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const focusable = $$('button:not([disabled]),[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])', modal)
      .filter(el => el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  const close = () => {
    if (closed) return;
    closed = true;
    $$('video', backdrop).forEach(v => v.pause());
    backdrop.remove();
    document.removeEventListener('keydown', onKey);
    openModalCount = Math.max(0, openModalCount - 1);
    if (!$('.tn-modal-backdrop')) { openModalCount = 0; document.body.classList.remove('tn-modal-open'); }
    if (prevFocus && document.body.contains(prevFocus)) prevFocus.focus();
  };
  document.addEventListener('keydown', onKey);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.closest('[data-modal-close]')) close();
  });
  modal.focus();
  return { backdrop, modal, close };
}

/* ----- 1. Xem nhanh: chọn phân loại + thắp thử ----- */
function openQuickView(p) {
  const lit = ['jar', 'tealight'].includes(productArtType(p));
  let v = p.variants.find(x => x.stock > 0) || p.variants[0];
  const { backdrop, close } = mountModal(`
    <div class="tn-modal-head">
      <div>
        <h3 class="tn-h3">${escapeHTML(L(p, 'name'))}</h3>
        <div class="tn-muted" style="font-size:12.5px">${escapeHTML(L(SCENTS[p.scent] || {}, 'name'))} · ${escapeHTML(Object.values(getLang() === 'en' && p.notes_en ? p.notes_en : p.notes || {}).join(', '))}</div>
      </div>
      <button class="tn-modal-close" data-modal-close aria-label="${t('common.close')}">${ICONS.close}</button>
    </div>
    <div class="tn-modal-body" style="padding:14px">
      <div class="burn-stage" style="${paletteStyle(p)}">
        ${thumbHTML(p)}
        <span class="burn-badge">${lit ? t('product.lighting') : t('product.lookClose')}</span>
        ${lit && !productImage(p) ? `<div class="burn-bar" aria-hidden="true"><i></i></div>` : ''}
      </div>
      <div class="pd-label" style="margin-top:14px">${t('product.variant')}</div>
      <div class="variant-pills variant-pills--sm" id="qv-variants">
        ${p.variants.map(x => `<button type="button" class="variant-pill ${x.id === v.id ? 'active' : ''}" data-vid="${escapeHTML(x.id)}" ${x.stock <= 0 ? 'data-out="1"' : ''}>
          <b>${escapeHTML(x.label)}</b><span>${fmtVND(variantPrice(p, x))}</span>${x.stock <= 0 ? `<em>${t('product.soldOut')}</em>` : ''}</button>`).join('')}
      </div>
      <div class="qv-foot">
        <div class="qv-price" id="qv-price">${priceHTML(p, v)}</div>
        <div style="display:flex;gap:8px">
          <a href="#/product/${encodeURIComponent(p.id)}" class="tn-btn tn-btn--ghost" data-modal-close>${t('product.details')}</a>
          <button class="tn-btn tn-btn--primary" id="qv-add">${t('product.addToCart')}</button>
        </div>
      </div>
    </div>
  `, { cls: 'tn-modal--wide' });

  const paint = () => {
    $$('#qv-variants .variant-pill', backdrop).forEach(b => b.classList.toggle('active', b.dataset.vid === v.id));
    backdrop.querySelector('#qv-price').innerHTML = priceHTML(p, v);
    backdrop.querySelector('#qv-add').disabled = v.stock <= 0;
  };
  paint();
  $$('#qv-variants .variant-pill', backdrop).forEach(b => b.addEventListener('click', () => { v = getVariant(p, b.dataset.vid); paint(); }));
  backdrop.querySelector('#qv-add').addEventListener('click', () => {
    if (addToCart(p.id, v.id, 1)) { toast(t('cart.added', { name: `${L(p, 'name')} (${v.label})` }), 'ok'); close(); }
  });
}

/* ----- 2. Đặt hàng (khách vãng lai, mô phỏng) ----- */
function openCheckoutModal() {
  const lines = cartLines();
  if (!lines.length) { toast(t('cart.emptyTitle'), 'err'); return; }
  const tot = cartTotals(lines);

  const { backdrop, close } = mountModal(`
    <div class="tn-modal-head">
      <h3 class="tn-h3">${t('checkout.title')}</h3>
      <button class="tn-modal-close" data-modal-close aria-label="${t('common.close')}">${ICONS.close}</button>
    </div>
    <form id="checkout-form" novalidate>
      <div class="tn-modal-body">
        <div class="tn-form" style="max-width:none">
          <div class="tn-row">
            <div class="tn-field"><label for="co-name">${t('form.name')} *</label><input id="co-name" autocomplete="name"></div>
            <div class="tn-field"><label for="co-phone">${t('form.phone')} *</label><input id="co-phone" type="tel" autocomplete="tel" placeholder="09xx xxx xxx"></div>
          </div>
          <div class="tn-field"><label for="co-email">Email</label><input id="co-email" type="email" autocomplete="email" placeholder="${t('checkout.emailPh')}"></div>
          <div class="tn-field"><label for="co-address">${t('checkout.address')} *</label><input id="co-address" autocomplete="street-address" placeholder="${t('checkout.addressPh')}"></div>
          <div class="tn-field"><label for="co-note">${t('checkout.note')}</label><textarea id="co-note" maxlength="200" style="min-height:64px" placeholder="${t('checkout.notePh')}"></textarea></div>
          <div class="tn-field">
            <label>${t('checkout.payment')}</label>
            <div class="pay-options">
              <label class="pay-option"><input type="radio" name="pay" value="cod" checked><span><b>${t('pay.cod')}</b><small>${t('pay.codHint')}</small></span></label>
              <label class="pay-option"><input type="radio" name="pay" value="bank"><span><b>${t('pay.bank')}</b><small>${t('pay.bankHint')}</small></span></label>
            </div>
          </div>
        </div>
        <div class="co-summary">
          ${lines.map(l => `<div class="sum-row"><span>${escapeHTML(L(l.product, 'name'))} · ${escapeHTML(l.variant.label)} × ${l.qty}</span><span>${fmtVND(variantPrice(l.product, l.variant) * l.qty)}</span></div>`).join('')}
          ${tot.discount ? `<div class="sum-row sum-row--discount"><span>${t('cart.discount')} (${escapeHTML(tot.discount.code)})</span><span>−${fmtVND(tot.discountAmount)}</span></div>` : ''}
          <div class="sum-row"><span>${t('cart.shipping')}</span><span>${tot.shipping ? fmtVND(tot.shipping) : t('cart.free')}</span></div>
          <div class="sum-row sum-row--total"><span>${t('cart.total')}</span><span>${fmtVND(tot.total)}</span></div>
        </div>
        <p class="tn-hint" style="margin-top:10px">${t('cart.demoNote')}</p>
      </div>
      <div class="tn-modal-foot">
        <button type="button" class="tn-btn tn-btn--ghost" data-modal-close>${t('common.back')}</button>
        <button type="submit" class="tn-btn tn-btn--primary" id="co-submit">${t('checkout.place')} · ${fmtVND(tot.total)}</button>
      </div>
    </form>
  `);

  backdrop.querySelector('#checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#co-name').value.trim();
    const phone = $('#co-phone').value.replace(/[\s.-]/g, '');
    const email = $('#co-email').value.trim();
    const address = $('#co-address').value.trim();
    if (!name || !address) { toast(t('err.nameAddress'), 'err'); return; }
    if (!/^(\+?84|0)\d{9,10}$/.test(phone)) { toast(t('err.phone'), 'err'); return; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast(t('err.email'), 'err'); return; }

    const fresh = cartLines();
    const short = fresh.find(l => l.qty > l.variant.stock);
    if (short) { toast(t('err.onlyLeft', { n: short.variant.stock }), 'err'); close(); route(); return; }
    const totals = cartTotals(fresh);
    const btn = $('#co-submit'); btn.disabled = true; btn.textContent = t('checkout.processing');

    const order = {
      id: 'o_' + uid(), code: 'TN' + String(now()).slice(-6),
      items: fresh.map(l => ({ productId: l.product.id, variantId: l.variant.id, variantLabel: l.variant.label,
        name: l.product.name, name_en: l.product.name_en, price: variantPrice(l.product, l.variant), qty: l.qty })),
      subtotal: totals.subtotal, discountCode: totals.discount?.code || '', discountPercent: totals.discount?.percent || 0,
      discountAmount: totals.discountAmount, shipping: totals.shipping, total: totals.total,
      customer: { name, phone, email, address }, note: $('#co-note').value.trim(),
      payment: backdrop.querySelector('input[name="pay"]:checked').value,
      status: 'pending', createdAt: now(), updatedAt: now()
    };
    const products = store.products();
    order.items.forEach(it => {
      const p = products.find(x => x.id === it.productId);
      const v = p && getVariant(p, it.variantId);
      if (v) { v.stock -= it.qty; p.sold = (p.sold || 0) + it.qty; }
    });
    store.saveProducts(products);
    if (totals.discount) {
      const ds = store.discounts();
      const d = ds.find(x => x.id === totals.discount.id);
      if (d) { d.used = (d.used || 0) + 1; store.saveDiscounts(ds); }
    }
    const orders = store.orders(); orders.push(order); store.saveOrders(orders);
    clearCart();
    close();
    route();
    openOrderSuccess(order);
  });
}

function openOrderSuccess(order) {
  mountModal(`
    <div class="tn-modal-body success-body">
      <svg class="success-check" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" pathLength="1"/><path d="M15 27l7 7 15-16" pathLength="1"/></svg>
      <h3 class="tn-h2">${t('checkout.successTitle')}</h3>
      <p class="tn-sub" style="margin-top:6px">${t('checkout.successText', { code: `<b>${escapeHTML(order.code)}</b>`, phone: escapeHTML(order.customer.phone) })}</p>
      <p class="success-slogan">${escapeHTML(L(settings(), 'slogan'))}</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px">
        <a href="#/track?code=${encodeURIComponent(order.code)}&phone=${encodeURIComponent(order.customer.phone)}" class="tn-btn tn-btn--primary" data-modal-close>${t('footer.track')}</a>
        <a href="#/shop" class="tn-btn tn-btn--ghost" data-modal-close>${t('cart.continue')}</a>
      </div>
    </div>
  `);
}

/* ----- 3. Xem ảnh / video toàn màn hình ----- */
function openLightbox(ref) {
  const url = mediaURL(ref);
  if (!url) return;
  mountModal(`
    <button class="tn-modal-close lb-close" data-modal-close aria-label="${t('common.close')}">${ICONS.close}</button>
    ${isVideoRef(ref) ? `<video src="${escapeHTML(url)}" controls autoplay playsinline></video>` : `<img src="${escapeHTML(url)}" alt="">`}
  `, { cls: 'tn-lightbox', dark: true });
}
