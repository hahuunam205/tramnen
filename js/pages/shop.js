/* TRAM NEN · pages/shop.js
   Sản phẩm: bộ lọc (từ khóa, danh mục, nhóm hương, khoảng giá, đang sale) + sắp xếp
   (bán chạy, mới nhất, giá, tên). Kèm trang Sale và trang kết quả tìm kiếm. */

const SHOP_DEFAULT = { q: '', cat: 'all', scent: 'all', min: '', max: '', sort: 'best', saleOnly: false };
let shopState = { ...SHOP_DEFAULT };
const PRICE_PRESETS = [['', 150000], [150000, 300000], [300000, 500000], [500000, '']];

/* giá hiển thị: "từ X" + giá gốc gạch ngang nếu đang sale */
function priceHTML(p, v) {
  const one = !!v;
  const base = one ? v.price : minPrice(p);
  const final = one ? variantPrice(p, v) : minFinalPrice(p);
  const from = !one && new Set((p.variants || []).map(x => x.price)).size > 1 ? `<small>${t('common.from')}</small> ` : '';
  return `<span class="price">${from}<b>${fmtVND(final)}</b>${isOnSale(p) ? `<s>${fmtVND(base)}</s>` : ''}</span>`;
}

function productCardHTML(p, i = 0) {
  const rating = avgRating(p.id);
  const out = totalStock(p) <= 0;
  const href = '#/product/' + encodeURIComponent(p.id);
  const cat = getCategory(p.category);
  return `
    <article class="pc reveal" style="--rd:${(i % 4) * 0.07}s">
      <a class="pc-thumb" href="${href}" style="${paletteStyle(p)}" aria-label="${escapeHTML(L(p, 'name'))}">
        ${thumbHTML(p)}
        <div class="pc-meta-top">
          <span class="pc-chip">${escapeHTML(L(cat || {}, 'name'))}</span>
          ${isOnSale(p) ? `<span class="pc-chip pc-chip--sale">−${p.salePercent}%</span>` : ''}
          ${out ? `<span class="pc-chip pc-chip--out">${t('product.soldOut')}</span>` : ''}
        </div>
        <span class="pc-quick">${t('product.quickView')}</span>
      </a>
      <div class="pc-info">
        <a class="pc-title" href="${href}">${escapeHTML(L(p, 'name'))}</a>
        <div class="pc-scent">${escapeHTML(L(SCENTS[p.scent] || {}, 'name'))} · ${(p.variants || []).map(v => escapeHTML(v.label)).join(' / ')}</div>
        <div class="pc-stats">${rating ? `<span class="pc-star">★ ${rating.toFixed(1)}</span> · ` : ''}${t('product.sold', { n: fmtNum(p.sold || 0) })}</div>
        <div class="pc-foot">
          ${priceHTML(p)}
          <button class="tn-btn tn-btn--primary tn-btn--sm" data-action="quick-view" data-id="${escapeHTML(p.id)}" ${out ? 'disabled' : ''}>
            ${out ? t('product.soldOut') : t('product.choose')}
          </button>
        </div>
      </div>
    </article>
  `;
}

function filterProducts(st) {
  let list = st.q.trim() ? searchProducts(st.q) : visibleProducts();
  if (st.cat !== 'all') list = list.filter(p => p.category === st.cat);
  if (st.scent !== 'all') list = list.filter(p => p.scent === st.scent);
  if (st.saleOnly) list = list.filter(isOnSale);
  const min = st.min === '' ? -Infinity : Number(st.min);
  const max = st.max === '' ? Infinity : Number(st.max);
  if (st.min !== '' || st.max !== '') list = list.filter(p => (p.variants || []).some(v => { const f = variantPrice(p, v); return f >= min && f <= max; }));
  const nameOf = (p) => L(p, 'name');
  const sorters = {
    best:         (a, b) => (b.sold || 0) - (a.sold || 0),
    newest:       (a, b) => b.createdAt - a.createdAt,
    'price-asc':  (a, b) => minFinalPrice(a) - minFinalPrice(b),
    'price-desc': (a, b) => minFinalPrice(b) - minFinalPrice(a),
    'name-asc':   (a, b) => nameOf(a).localeCompare(nameOf(b), getLang()),
    'name-desc':  (a, b) => nameOf(b).localeCompare(nameOf(a), getLang())
  };
  if (!(st.q.trim() && st.sort === 'relevance')) list = list.slice().sort(sorters[st.sort] || sorters.best);
  return list;
}

function renderShop(app, params) {
  if (params) {
    const cat = params.get('cat'), scent = params.get('scent'), q = params.get('q');
    if (cat !== null) shopState.cat = getCategory(cat) ? cat : 'all';
    if (scent !== null) shopState.scent = SCENTS[scent] ? scent : 'all';
    if (q !== null) shopState.q = q;
    if (params.get('sale')) shopState.saleOnly = true;
  }
  const all = visibleProducts();
  const list = filterProducts(shopState);
  const cats = sortedCategories();
  const active = shopState.q || shopState.cat !== 'all' || shopState.scent !== 'all' || shopState.min !== '' || shopState.max !== '' || shopState.saleOnly;
  const presetActive = (a, b) => String(shopState.min) === String(a) && String(shopState.max) === String(b);
  const radio = (name, val, label, count, cur) => `
    <label class="flt-opt ${cur === val ? 'active' : ''}"><input type="radio" name="${name}" value="${escapeHTML(val)}" ${cur === val ? 'checked' : ''}><span>${label}</span>${count !== null ? `<em>${count}</em>` : ''}</label>`;

  mount(app, appShell(`
    <section class="page-hero page-hero--sm" style="${paletteStyle({ palette: 5 })}">
      ${blobsHTML(7)}
      <div class="tn-container-wide page-hero-inner">
        <nav class="tn-crumbs"><a href="#/">${t('nav.home')}</a><span>/</span><span aria-current="page">${t('nav.products')}</span></nav>
        <h1 class="tn-h1 split">${t('shop.title')}</h1>
        <p class="tn-sub">${t('shop.subtitle', { n: all.length })}</p>
      </div>
    </section>

    <div class="tn-container-wide shop-layout">
      <aside class="shop-filters" id="shop-filters" aria-label="${t('shop.filters')}">
        <div class="flt-head">
          <h2>${icon('filter')} ${t('shop.filters')}</h2>
          ${active ? `<button class="tn-link-btn" id="flt-reset">${t('shop.reset')}</button>` : ''}
          <button class="tn-icon-btn flt-close" id="flt-close" aria-label="${t('common.close')}">${ICONS.close}</button>
        </div>

        <div class="flt-group">
          <label class="flt-title" for="flt-q">${t('shop.keyword')}</label>
          <div class="tn-search">
            ${ICONS.search}
            <input id="flt-q" type="search" value="${escapeHTML(shopState.q)}" placeholder="${t('search.placeholderShort')}">
          </div>
        </div>

        <div class="flt-group">
          <div class="flt-title">${t('shop.category')}</div>
          ${radio('cat', 'all', t('shop.all'), all.length, shopState.cat)}
          ${cats.map(c => radio('cat', c.id, escapeHTML(L(c, 'name')), all.filter(p => p.category === c.id).length, shopState.cat)).join('')}
        </div>

        <div class="flt-group">
          <div class="flt-title">${t('shop.scent')}</div>
          ${radio('scent', 'all', t('shop.allScents'), null, shopState.scent)}
          ${Object.entries(SCENTS).map(([k, s]) => radio('scent', k, escapeHTML(L(s, 'name')), all.filter(p => p.scent === k).length, shopState.scent)).join('')}
        </div>

        <div class="flt-group">
          <div class="flt-title">${t('shop.price')}</div>
          <div class="price-presets">
            ${PRICE_PRESETS.map(([a, b]) => `<button type="button" class="tn-chip-btn ${presetActive(a, b) ? 'active' : ''}" data-min="${a}" data-max="${b}">
              ${a === '' ? t('shop.under', { v: fmtVND(b) }) : b === '' ? t('shop.over', { v: fmtVND(a) }) : `${fmtVND(a)} – ${fmtVND(b)}`}</button>`).join('')}
          </div>
          <form class="price-range" id="price-form">
            <input type="number" id="flt-min" min="0" step="10000" placeholder="${t('shop.min')}" value="${escapeHTML(shopState.min)}" aria-label="${t('shop.min')}">
            <span>–</span>
            <input type="number" id="flt-max" min="0" step="10000" placeholder="${t('shop.max')}" value="${escapeHTML(shopState.max)}" aria-label="${t('shop.max')}">
            <button class="tn-btn tn-btn--ghost tn-btn--sm" type="submit">${t('shop.apply')}</button>
          </form>
        </div>

        <div class="flt-group">
          <label class="flt-switch"><input type="checkbox" id="flt-sale" ${shopState.saleOnly ? 'checked' : ''}><span class="sw"></span>${t('shop.saleOnly')}</label>
        </div>
      </aside>

      <section class="shop-results">
        <div class="shop-toolbar">
          <button class="tn-btn tn-btn--ghost tn-btn--sm flt-open" id="flt-open">${icon('filter')} ${t('shop.filters')}</button>
          <p class="tn-muted">${t('shop.showing', { n: list.length })}${shopState.q ? ` ${t('shop.forQuery', { q: escapeHTML(shopState.q) })}` : ''}</p>
          <label class="sort-wrap">
            <span>${t('shop.sortBy')}</span>
            <select class="tn-select" id="sort-select">
              ${[['best', 'shop.sortBest'], ['newest', 'shop.sortNew'], ['price-asc', 'shop.sortPriceAsc'], ['price-desc', 'shop.sortPriceDesc'], ['name-asc', 'shop.sortNameAsc'], ['name-desc', 'shop.sortNameDesc']]
                .map(([v, k]) => `<option value="${v}" ${shopState.sort === v ? 'selected' : ''}>${t(k)}</option>`).join('')}
            </select>
          </label>
        </div>

        ${list.length ? `<div class="tn-grid tn-grid--products">${list.map((p, i) => productCardHTML(p, i)).join('')}</div>` : `
          <div class="tn-empty">
            <h3>${t('shop.emptyTitle')}</h3>
            <p class="tn-sub">${t('shop.emptyText')}</p>
            <button class="tn-btn tn-btn--ghost" id="clear-filters" style="margin-top:14px">${t('shop.reset')}</button>
          </div>`}
      </section>
    </div>
  `));

  /* ----- sự kiện bộ lọc ----- */
  const rerender = () => renderShop(app);
  const fq = $('#flt-q');
  fq.addEventListener('input', debounce(() => {
    shopState.q = fq.value;
    if (!document.body.contains(fq)) return;
    rerender();
    const el = $('#flt-q');
    if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
  }, 260));
  $$('#shop-filters input[name="cat"]').forEach(r => r.addEventListener('change', () => { shopState.cat = r.value; rerender(); }));
  $$('#shop-filters input[name="scent"]').forEach(r => r.addEventListener('change', () => { shopState.scent = r.value; rerender(); }));
  $$('.price-presets [data-min]').forEach(b => b.addEventListener('click', () => {
    const same = presetActive(b.dataset.min, b.dataset.max);
    shopState.min = same ? '' : b.dataset.min; shopState.max = same ? '' : b.dataset.max; rerender();
  }));
  $('#price-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let a = $('#flt-min').value, b = $('#flt-max').value;
    if (a !== '' && b !== '' && Number(a) > Number(b)) [a, b] = [b, a];
    shopState.min = a; shopState.max = b; rerender();
  });
  $('#flt-sale').addEventListener('change', (e) => { shopState.saleOnly = e.target.checked; rerender(); });
  $('#sort-select').addEventListener('change', (e) => { shopState.sort = e.target.value; rerender(); });
  const reset = () => { shopState = { ...SHOP_DEFAULT }; if (location.hash.includes('?')) location.hash = '/shop'; else rerender(); };
  $('#flt-reset')?.addEventListener('click', reset);
  $('#clear-filters')?.addEventListener('click', reset);
  $('#flt-open').addEventListener('click', () => document.body.classList.add('tn-filters-open'));
  $('#flt-close').addEventListener('click', () => document.body.classList.remove('tn-filters-open'));
  onCleanup(() => document.body.classList.remove('tn-filters-open'));
}

/* ============================================================
   SALE
   ============================================================ */
function renderSale(app) {
  const codes = activePublicDiscounts();
  const list = visibleProducts().filter(isOnSale).sort((a, b) => b.salePercent - a.salePercent);
  mount(app, appShell(`
    <section class="page-hero sale-hero">
      ${blobsHTML(51)}
      <div class="tn-container-wide page-hero-inner">
        <nav class="tn-crumbs"><a href="#/">${t('nav.home')}</a><span>/</span><span aria-current="page">${t('nav.sale')}</span></nav>
        <div class="tn-eyebrow tn-eyebrow--light">${t('nav.sale')}</div>
        <h1 class="tn-h1 split">${t('sale.title')}</h1>
        <p>${t('sale.subtitle')}</p>
      </div>
    </section>

    <div class="tn-container-wide">
      ${codes.length ? `
        <section class="home-section">
          <h2 class="tn-h2 reveal">${t('sale.codesTitle')}</h2>
          <div class="coupon-grid">
            ${codes.map((d, i) => `
              <div class="coupon reveal" style="--rd:${i * 0.08}s">
                <div class="coupon-left"><b>−${d.percent}%</b><span>${t('sale.off')}</span></div>
                <div class="coupon-right">
                  <code>${escapeHTML(d.code)}</code>
                  <p>${escapeHTML(L(d, 'note'))}</p>
                  ${d.expiresAt ? `<small>${t('sale.until', { d: fmtDate(d.expiresAt) })}</small>` : ''}
                  <button class="tn-btn tn-btn--primary tn-btn--sm" data-action="copy-code" data-id="${escapeHTML(d.code)}">${icon('copy')} ${t('sale.copy')}</button>
                </div>
              </div>`).join('')}
          </div>
        </section>` : ''}

      <section class="home-section">
        <h2 class="tn-h2 reveal">${t('sale.productsTitle')}</h2>
        ${list.length
          ? `<div class="tn-grid tn-grid--products" style="margin-top:18px">${list.map((p, i) => productCardHTML(p, i)).join('')}</div>`
          : `<div class="tn-empty" style="margin-top:18px"><p class="tn-sub">${t('sale.none')}</p><a href="#/shop" class="tn-btn tn-btn--primary" style="margin-top:14px">${t('home.ctaShop')}</a></div>`}
      </section>
    </div>
  `));
}

/* ============================================================
   KẾT QUẢ TÌM KIẾM
   ============================================================ */
function renderSearch(app, params) {
  const q = (params.get('q') || '').trim();
  const res = q ? searchProducts(q) : [];
  mount(app, appShell(`
    <div class="tn-container-wide" style="padding-top:36px;padding-bottom:70px">
      <div class="tn-eyebrow">${t('search.title')}</div>
      <h1 class="tn-h1">${q ? t('search.resultsFor', { q: escapeHTML(q) }) : t('search.title')}</h1>
      <form class="search-page-form" id="search-page-form">
        <div class="tn-search">${ICONS.search}<input id="search-page-input" type="search" value="${escapeHTML(q)}" placeholder="${t('search.placeholder')}"></div>
        <button class="tn-btn tn-btn--primary" type="submit">${t('search.go')}</button>
      </form>
      <p class="tn-muted" style="margin:6px 0 20px">${q ? t('search.found', { n: res.length }) : t('search.hint')}</p>
      ${res.length ? `<div class="tn-grid tn-grid--products">${res.map((p, i) => productCardHTML(p, i)).join('')}</div>`
        : q ? `<div class="tn-empty"><h3>${t('search.none', { q: escapeHTML(q) })}</h3><p class="tn-sub">${t('search.tryOther')}</p><a href="#/shop" class="tn-btn tn-btn--primary" style="margin-top:14px">${t('home.ctaShop')}</a></div>` : ''}
    </div>
  `));
  $('#search-page-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('#search-page-input').value.trim();
    location.hash = '/search?q=' + encodeURIComponent(v);
  });
}
