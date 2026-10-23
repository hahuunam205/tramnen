/* TRAM NEN · pages/product.js
   Chi tiết sản phẩm: chọn phân loại (100g/200g/300g), số lượng, tháp hương, đánh giá, gợi ý */

function renderProductDetail(app, id) {
  const p = getProductById(id);
  if (!p || p.status !== 'active') return render404(app);
  const cat = getCategory(p.category) || {};
  const scent = SCENTS[p.scent] || {};
  const reviews = getReviewsForProduct(p.id).sort((a, b) => b.createdAt - a.createdAt);
  const rating = avgRating(p.id);
  const notes = getLang() === 'en' && p.notes_en ? p.notes_en : p.notes;
  let vSel = (p.variants.find(v => v.stock > 0) || p.variants[0]);
  const lit = ['jar', 'tealight'].includes(productArtType(p));

  let related = visibleProducts().filter(x => x.id !== p.id && x.scent === p.scent);
  related = related.concat(visibleProducts().filter(x => x.id !== p.id && x.category === p.category && !related.includes(x))).slice(0, 4);

  mount(app, appShell(`
    <div class="tn-container-wide" style="padding-top:28px">
      <nav class="tn-crumbs" aria-label="Breadcrumb">
        <a href="#/">${t('nav.home')}</a><span>/</span>
        <a href="#/shop">${t('nav.products')}</a><span>/</span>
        <a href="#/shop?cat=${encodeURIComponent(p.category)}">${escapeHTML(L(cat, 'name'))}</a><span>/</span>
        <span aria-current="page">${escapeHTML(L(p, 'name'))}</span>
      </nav>

      <div class="pd-layout">
        <div class="pd-media reveal">
          <div class="pd-preview" style="${paletteStyle(p)}">
            ${thumbHTML(p)}
            ${isOnSale(p) ? `<span class="pd-sale">−${p.salePercent}%</span>` : ''}
            <button class="pd-try" data-action="quick-view" data-id="${escapeHTML(p.id)}">${icon(lit ? 'flame' : 'leaf')} ${lit ? t('product.tryLight') : t('product.lookClose')}</button>
          </div>
        </div>

        <div class="pd-info">
          <div class="tn-eyebrow">${escapeHTML(L(cat, 'name'))}</div>
          <h1 class="tn-h1">${escapeHTML(L(p, 'name'))}</h1>
          <div class="pd-rating">
            ${starsHTML(rating)}
            <span>${rating ? `${rating.toFixed(1)} · ${t('product.reviewCount', { n: reviews.length })}` : t('product.noReviews')}</span>
            <span class="tn-muted">· ${t('product.sold', { n: fmtNum(p.sold || 0) })}</span>
          </div>

          <div class="pd-price" id="pd-price">${priceHTML(p, vSel)}</div>
          <p class="tn-sub">${escapeHTML(L(p, 'desc'))}</p>

          <div class="pd-variants">
            <div class="pd-label">${t('product.variant')}: <b id="pd-vlabel">${escapeHTML(vSel.label)}</b></div>
            <div class="variant-pills" role="radiogroup" aria-label="${t('product.variant')}">
              ${p.variants.map(v => `
                <button type="button" class="variant-pill ${v.id === vSel.id ? 'active' : ''}" data-vid="${escapeHTML(v.id)}" role="radio" aria-checked="${v.id === vSel.id}" ${v.stock <= 0 ? 'data-out="1"' : ''}>
                  <b>${escapeHTML(v.label)}</b>
                  <span>${fmtVND(variantPrice(p, v))}</span>
                  ${v.stock <= 0 ? `<em>${t('product.soldOut')}</em>` : ''}
                </button>`).join('')}
            </div>
          </div>

          <div class="pd-notes" aria-label="${t('product.notes')}">
            <div class="pd-note" style="--w:62%"><span>${t('product.top')}</span><b>${escapeHTML(notes?.top || '—')}</b></div>
            <div class="pd-note" style="--w:81%;animation-delay:.1s"><span>${t('product.mid')}</span><b>${escapeHTML(notes?.mid || '—')}</b></div>
            <div class="pd-note" style="--w:100%;animation-delay:.2s"><span>${t('product.base')}</span><b>${escapeHTML(notes?.base || '—')}</b></div>
          </div>

          <dl class="pd-specs">
            <div><dt>${t('product.scentFamily')}</dt><dd><a href="#/shop?scent=${p.scent}">${escapeHTML(L(scent, 'name'))}</a></dd></div>
            <div><dt>${t('product.variant')}</dt><dd id="pd-vlabel2">${escapeHTML(vSel.label)}</dd></div>
            <div><dt>${t('product.detail')}</dt><dd id="pd-vnote">${escapeHTML(vSel.note || '—')}</dd></div>
            <div><dt>${t('product.stock')}</dt><dd id="pd-stock"></dd></div>
          </dl>

          <div class="pd-buy">
            <div class="tn-qty" role="group" aria-label="${t('cart.qty')}">
              <button type="button" data-step="-1" aria-label="−">−</button>
              <input id="pd-qty" type="number" min="1" value="1" inputmode="numeric" aria-label="${t('cart.qty')}">
              <button type="button" data-step="1" aria-label="+">+</button>
            </div>
            <button class="tn-btn tn-btn--primary tn-btn--lg" id="pd-add" style="flex:1">${icon('bag')} ${t('product.addToCart')}</button>
          </div>
          <button class="tn-btn tn-btn--ghost tn-btn--block tn-btn--lg" id="pd-buy" style="margin-top:10px">${t('product.buyNow')}</button>
          <ul class="pd-perks">
            <li>${icon('truck')} ${t('product.perkShip', { v: fmtVND(settings().freeShipFrom) })}</li>
            <li>${icon('gift')} ${t('product.perkGift')}</li>
          </ul>
        </div>
      </div>

      <section class="home-section" id="reviews">
        <div class="section-head">
          <h2 class="tn-h2">${t('product.reviewsTitle')}</h2>
          ${rating ? `<div class="pd-rating">${starsHTML(rating)} <b>${rating.toFixed(1)}/5</b></div>` : ''}
        </div>
        <div class="review-layout">
          <div>
            ${reviews.length ? reviews.map(r => `
              <div class="review-card reveal">
                <div class="review-head">
                  <div class="tn-avatar">${escapeHTML(initials(r.name))}</div>
                  <div><b>${escapeHTML(r.name)}</b><div class="tn-muted" style="font-size:12px">${fmtRelative(r.createdAt)}</div></div>
                  <div style="margin-left:auto">${starsHTML(r.rating)}</div>
                </div>
                <p>${escapeHTML(r.comment)}</p>
              </div>`).join('') : `<div class="tn-empty"><p class="tn-sub">${t('product.noReviewsYet')}</p></div>`}
          </div>
          <form class="tn-card tn-pad review-form" id="review-form" novalidate>
            <h3 class="tn-h3">${t('product.writeReview')}</h3>
            <div class="star-picker" id="star-picker" role="radiogroup" aria-label="${t('product.rating')}">
              ${[1, 2, 3, 4, 5].map(i => `<span data-star="${i}" role="radio" tabindex="0" aria-checked="false" aria-label="${i}">★</span>`).join('')}
            </div>
            <div class="tn-field"><label for="rv-name">${t('form.name')}</label><input id="rv-name" maxlength="40"></div>
            <div class="tn-field"><label for="rv-text">${t('product.yourReview')}</label><textarea id="rv-text" maxlength="500" placeholder="${t('product.reviewPh')}"></textarea></div>
            <button class="tn-btn tn-btn--primary" type="submit">${t('product.submitReview')}</button>
          </form>
        </div>
      </section>

      ${related.length ? `
        <section class="home-section">
          <h2 class="tn-h2">${t('product.related')}</h2>
          <div class="tn-grid tn-grid--products" style="margin-top:18px">${related.map((x, i) => productCardHTML(x, i)).join('')}</div>
        </section>` : ''}
    </div>
  `));

  /* ----- chọn phân loại + số lượng ----- */
  const qtyInput = $('#pd-qty');
  const paintVariant = () => {
    $$('.variant-pill').forEach(b => { const on = b.dataset.vid === vSel.id; b.classList.toggle('active', on); b.setAttribute('aria-checked', on); });
    $('#pd-price').innerHTML = priceHTML(p, vSel);
    $('#pd-vlabel').textContent = vSel.label;
    $('#pd-vlabel2').textContent = vSel.label;
    $('#pd-vnote').textContent = vSel.note || '—';
    const out = vSel.stock <= 0;
    $('#pd-stock').innerHTML = out ? `<span style="color:var(--danger)">${t('product.soldOut')}</span>` : t('product.inStock', { n: vSel.stock });
    $('#pd-add').disabled = out; $('#pd-buy').disabled = out;
    qtyInput.max = Math.max(1, vSel.stock);
    if (Number(qtyInput.value) > vSel.stock) qtyInput.value = Math.max(1, vSel.stock);
  };
  paintVariant();
  $$('.variant-pill').forEach(b => b.addEventListener('click', () => { vSel = getVariant(p, b.dataset.vid); paintVariant(); }));

  const clampQty = () => {
    let v = parseInt(qtyInput.value, 10);
    if (!Number.isFinite(v) || v < 1) v = 1;
    if (v > vSel.stock) { v = Math.max(1, vSel.stock); toast(t('err.onlyLeft', { n: vSel.stock }), 'err'); }
    qtyInput.value = v;
    return v;
  };
  $$('.pd-buy [data-step]').forEach(b => b.addEventListener('click', () => {
    qtyInput.value = (parseInt(qtyInput.value, 10) || 1) + Number(b.dataset.step); clampQty();
  }));
  qtyInput.addEventListener('change', clampQty);
  $('#pd-add').addEventListener('click', () => {
    if (addToCart(p.id, vSel.id, clampQty())) toast(t('cart.added', { name: `${L(p, 'name')} (${vSel.label})` }), 'ok');
  });
  $('#pd-buy').addEventListener('click', () => { if (addToCart(p.id, vSel.id, clampQty())) location.hash = '/cart'; });

  /* ----- đánh giá ----- */
  let rating0 = 0;
  const stars = $$('#star-picker [data-star]');
  const paint = (n) => stars.forEach(s => { s.classList.toggle('on', +s.dataset.star <= n); s.setAttribute('aria-checked', String(+s.dataset.star === rating0)); });
  stars.forEach(s => {
    s.addEventListener('mouseenter', () => paint(+s.dataset.star));
    s.addEventListener('click', () => { rating0 = +s.dataset.star; paint(rating0); });
    s.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rating0 = +s.dataset.star; paint(rating0); } });
  });
  $('#star-picker').addEventListener('mouseleave', () => paint(rating0));
  $('#review-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#rv-name').value.trim();
    const comment = $('#rv-text').value.trim();
    if (!rating0) { toast(t('err.pickStars'), 'err'); return; }
    if (!name || !comment) { toast(t('err.fillReview'), 'err'); return; }
    const reviews = store.reviews();
    reviews.push({ id: 'r_' + uid(), productId: p.id, name, rating: rating0, comment, createdAt: now() });
    store.saveReviews(reviews);
    toast(t('product.thanksReview'), 'ok');
    renderProductDetail(app, p.id);
    $('#reviews')?.scrollIntoView({ behavior: 'smooth' });
  });
}
