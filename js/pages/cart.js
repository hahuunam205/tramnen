/* TRAM NEN · pages/cart.js
   Giỏ hàng: số lượng theo phân loại, mã giảm giá, tiến độ miễn phí giao hàng */

function renderCart(app) {
  const lines = cartLines();
  const s = settings();
  const tot = cartTotals(lines);
  const code = store.get(KEYS.cartCode, null);
  const remain = Math.max(0, s.freeShipFrom - (tot.subtotal - tot.discountAmount));
  const pct = s.freeShipFrom ? Math.min(100, Math.round((tot.subtotal - tot.discountAmount) / s.freeShipFrom * 100)) : 100;

  if (!lines.length) {
    mount(app, appShell(`
      <div class="tn-container">
        <div class="tn-empty cart-empty">
          <div class="nf-art" style="${paletteStyle({ palette: 5 })}">${thumbHTML({ id: 'empty', palette: 5 }, { art: 'jar', lit: false, noPhoto: true })}</div>
          <h3>${t('cart.emptyTitle')}</h3>
          <p class="tn-sub">${t('cart.emptyText')}</p>
          <a href="#/shop" class="tn-btn tn-btn--primary" style="margin-top:16px">${t('home.ctaShop')}</a>
        </div>
      </div>`));
    return;
  }

  mount(app, appShell(`
    <div class="tn-container-wide" style="padding-top:32px;padding-bottom:70px">
      <div class="tn-eyebrow">${t('nav.cart')}</div>
      <h1 class="tn-h1">${t('cart.title')}</h1>
      <p class="tn-sub">${t('cart.count', { n: cartCount() })}</p>

      <div class="cart-layout">
        <div class="tn-card cart-list">
          ${lines.map(l => {
            const p = l.product, v = l.variant;
            const key = `${escapeHTML(p.id)}|${escapeHTML(v.id)}`;
            return `
              <div class="cart-line">
                <a class="cart-thumb" href="#/product/${encodeURIComponent(p.id)}" style="${paletteStyle(p)}">${thumbHTML(p)}</a>
                <div class="cart-info">
                  <a href="#/product/${encodeURIComponent(p.id)}" class="cart-name">${escapeHTML(L(p, 'name'))}</a>
                  <div class="tn-muted">${t('product.variant')}: <b>${escapeHTML(v.label)}</b></div>
                  <div class="cart-unit">${priceHTML(p, v)}</div>
                </div>
                <div class="tn-qty tn-qty--sm" role="group" aria-label="${t('cart.qty')}">
                  <button type="button" data-action="cart-dec" data-id="${key}" aria-label="−">−</button>
                  <input type="text" value="${l.qty}" readonly aria-label="${t('cart.qty')}">
                  <button type="button" data-action="cart-inc" data-id="${key}" aria-label="+" ${l.qty >= v.stock ? 'disabled' : ''}>+</button>
                </div>
                <div class="cart-line-total">${fmtVND(variantPrice(p, v) * l.qty)}</div>
                <button class="cart-remove" data-action="cart-remove" data-id="${key}" aria-label="${t('cart.remove')}">${ICONS.close}</button>
              </div>`;
          }).join('')}
        </div>

        <aside class="tn-card tn-pad cart-summary">
          <h3 class="tn-h3">${t('cart.summary')}</h3>
          <div class="ship-progress">
            <p>${remain > 0 ? t('cart.moreForFree', { v: fmtVND(remain) }) : t('cart.freeShip')}</p>
            <div class="ship-bar"><i style="--pct:${pct}%"></i></div>
          </div>

          <form class="code-form" id="code-form">
            ${tot.discount ? `
              <div class="code-applied">${icon('tag')}<b>${escapeHTML(tot.discount.code)}</b><span>−${tot.discount.percent}%</span>
                <button type="button" class="tn-link-btn" id="code-remove">${t('cart.remove')}</button></div>`
            : `<input id="code-input" placeholder="${t('cart.codePh')}" value="${escapeHTML(code && !tot.discount ? code : '')}" autocomplete="off">
               <button class="tn-btn tn-btn--ghost tn-btn--sm" type="submit">${t('shop.apply')}</button>`}
          </form>

          <div class="sum-row"><span>${t('cart.subtotal')}</span><span>${fmtVND(tot.subtotal)}</span></div>
          ${tot.discount ? `<div class="sum-row sum-row--discount"><span>${t('cart.discount')} (${escapeHTML(tot.discount.code)})</span><span>−${fmtVND(tot.discountAmount)}</span></div>` : ''}
          <div class="sum-row"><span>${t('cart.shipping')}</span><span>${tot.shipping ? fmtVND(tot.shipping) : t('cart.free')}</span></div>
          <div class="sum-row sum-row--total"><span>${t('cart.total')}</span><span>${fmtVND(tot.total)}</span></div>
          <button class="tn-btn tn-btn--primary tn-btn--block tn-btn--lg" data-action="checkout" style="margin-top:14px">${t('cart.checkout')}</button>
          <a href="#/shop" class="tn-btn tn-btn--ghost tn-btn--block" style="margin-top:10px">${t('cart.continue')}</a>
          <p class="tn-hint" style="margin-top:12px">${t('cart.demoNote')}</p>
        </aside>
      </div>
    </div>
  `));

  $('#code-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = $('#code-input')?.value || '';
    const r = findDiscount(val);
    if (r.error) { toast(t(r.error), 'err'); return; }
    store.set(KEYS.cartCode, r.discount.code);
    toast(t('code.applied', { c: r.discount.code, p: r.discount.percent }), 'ok');
    renderCart(app);
  });
  $('#code-remove')?.addEventListener('click', () => { store.set(KEYS.cartCode, null); renderCart(app); });
}
