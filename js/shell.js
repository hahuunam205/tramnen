/* TRAM NEN · shell.js
   Header (menu 7 mục, tìm kiếm, cờ ngôn ngữ, giỏ hàng), menu mobile, footer,
   lớp tìm kiếm nhanh và các hiệu ứng khi cuộn (reveal, typewriter, count-up) */

const NAV_LINKS = [
  ['/', 'nav.home'], ['/about', 'nav.about'], ['/shop', 'nav.products'], ['/sale', 'nav.sale'],
  ['/blog', 'nav.blog'], ['/members', 'nav.members'], ['/contact', 'nav.contact']
];

function isActivePath(href) {
  const path = parseHash().path || '/';
  if (href === '/') return path === '/' || path === '';
  if (href === '/shop') return path.startsWith('/shop') || path.startsWith('/product');
  return path === href || path.startsWith(href + '/');
}

function langSwitchHTML(cls = '') {
  const cur = getLang();
  return `<div class="tn-lang ${cls}" role="group" aria-label="${t('lang.label')}">
    ${['vi', 'en'].map(l => `<button type="button" class="tn-flag ${cur === l ? 'active' : ''}" data-lang="${l}" aria-pressed="${cur === l}" title="${l === 'vi' ? 'Tiếng Việt' : 'English'}">${FLAGS[l]}<span>${l.toUpperCase()}</span></button>`).join('')}
  </div>`;
}

function cartButtonHTML() {
  const n = cartCount();
  return `<a href="#/cart" class="tn-icon-btn tn-cart-btn" aria-label="${t('nav.cart')} (${n})">${ICONS.bag}<span class="tn-cart-count" data-count="${n}">${n}</span></a>`;
}
function updateCartBadge() {
  const n = cartCount();
  $$('.tn-cart-count').forEach(el => {
    el.textContent = n; el.dataset.count = n;
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  });
}

function headerHTML() {
  return `
    <header class="tn-header" id="tn-header">
      <div class="tn-header-inner">
        <button class="tn-icon-btn tn-burger" data-ui="drawer" aria-label="${t('nav.menu')}">${ICONS.menu}</button>
        <a href="#/" class="tn-header-logo" aria-label="${escapeHTML(settings().name)}">${logoHTML('dark')}</a>
        <nav class="tn-nav" aria-label="${t('nav.main')}">
          ${NAV_LINKS.map(([href, key]) => `<a href="#${href}" class="${isActivePath(href) ? 'active' : ''} ${href === '/sale' ? 'is-sale' : ''}">${t(key)}</a>`).join('')}
        </nav>
        <div class="tn-header-tools">
          <button class="tn-icon-btn" data-ui="search" aria-label="${t('search.open')}">${ICONS.search}</button>
          ${langSwitchHTML('tn-hide-md')}
          ${cartButtonHTML()}
        </div>
      </div>
    </header>
    <div class="tn-drawer" id="tn-drawer" aria-hidden="true">
      <div class="tn-drawer-panel">
        <div class="tn-drawer-head">
          ${logoHTML('dark')}
          <button class="tn-icon-btn" data-ui="drawer-close" aria-label="${t('common.close')}">${ICONS.close}</button>
        </div>
        <nav class="tn-drawer-nav">
          ${NAV_LINKS.map(([href, key], i) => `<a href="#${href}" class="${isActivePath(href) ? 'active' : ''}" style="--i:${i}">${t(key)}</a>`).join('')}
        </nav>
        <div class="tn-drawer-foot">
          ${langSwitchHTML()}
          ${socialLinksHTML('tn-socials tn-socials--dark')}
        </div>
      </div>
    </div>
  `;
}

function footerHTML() {
  const s = settings();
  const cats = sortedCategories();
  const contacts = [
    s.address && ['pin', L(s, 'address'), `https://www.google.com/maps/search/${encodeURIComponent(s.address)}`],
    s.phone && ['phone', s.phone, 'tel:' + s.phone.replace(/[^0-9+]/g, '')],
    s.email && ['mail', s.email, 'mailto:' + s.email],
    s.hours && ['clock', L(s, 'hours'), '']
  ].filter(Boolean);

  return `
    <footer class="tn-footer">
      <div class="tn-footer-news">
        <div class="tn-footer-news-inner">
          <div>
            <h3>${t('footer.newsTitle')}</h3>
            <p>${t('footer.newsText')}</p>
          </div>
          <form class="tn-news-form" id="news-form" novalidate>
            <input type="email" required placeholder="${t('footer.newsPlaceholder')}" aria-label="Email">
            <button class="tn-btn tn-btn--cream" type="submit">${t('footer.subscribe')}</button>
          </form>
        </div>
      </div>

      <div class="tn-footer-main">
        <div class="tn-footer-brand">
          <a href="#/" aria-label="${escapeHTML(s.name)}">${logoHTML('light')}</a>
          <p class="tn-footer-slogan">${escapeHTML(L(s, 'slogan'))}</p>
          <p class="tn-footer-about">${escapeHTML(L(s, 'intro'))}</p>
          ${socialLinksHTML('tn-socials')}
        </div>
        <div class="tn-footer-col">
          <h4>${t('footer.shop')}</h4>
          <ul>
            ${cats.map(c => `<li><a href="#/shop?cat=${encodeURIComponent(c.id)}">${escapeHTML(L(c, 'name'))}</a></li>`).join('')}
            <li><a href="#/sale">${t('nav.sale')}</a></li>
          </ul>
        </div>
        <div class="tn-footer-col">
          <h4>${t('footer.company')}</h4>
          <ul>
            <li><a href="#/about">${t('nav.about')}</a></li>
            <li><a href="#/blog">${t('nav.blog')}</a></li>
            <li><a href="#/members">${t('nav.members')}</a></li>
            <li><a href="#/contact">${t('nav.contact')}</a></li>
          </ul>
        </div>
        <div class="tn-footer-col">
          <h4>${t('footer.help')}</h4>
          <ul>
            <li><a href="#/track">${t('footer.track')}</a></li>
            <li><a href="#/policy">${t('policy.shipping')}</a></li>
            <li><a href="#/policy">${t('policy.return')}</a></li>
            <li><a href="#/policy">${t('policy.privacy')}</a></li>
          </ul>
        </div>
        <div class="tn-footer-col tn-footer-contact">
          <h4>${t('footer.contact')}</h4>
          <ul>
            ${contacts.map(([ic, text, href]) => `<li>${icon(ic)}${href ? `<a href="${escapeHTML(href)}" ${href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${escapeHTML(text)}</a>` : `<span>${escapeHTML(text)}</span>`}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="tn-footer-bottom">
        <div class="tn-footer-bottom-inner">
          <span>© ${new Date().getFullYear()} ${escapeHTML(s.name)}. ${t('footer.rights')}</span>
          <div class="tn-footer-pay" aria-label="${t('footer.payments')}">
            <span>${t('pay.cod')}</span><span>${t('pay.bank')}</span>
          </div>
          <div class="tn-footer-bottom-right">
            ${langSwitchHTML('tn-lang--light')}
            <a href="#/admin" class="tn-footer-admin">${t('footer.admin')}</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

function appShell(content, opts = {}) {
  return `
    <div class="tn-app ${opts.home ? 'is-home' : ''}">
      ${headerHTML()}
      <main class="tn-main" id="main">${content}</main>
      ${footerHTML()}
    </div>
  `;
}

/* ============================================================
   TÌM KIẾM NHANH (overlay)
   ============================================================ */
/* trả về sản phẩm chứa BẤT KỲ từ khóa nào khách nhập (không phân biệt dấu, hoa/thường) */
function searchProducts(q) {
  const norm = normalizeText(q).trim();
  if (!norm) return [];
  let tokens = norm.split(/\s+/).filter(Boolean);
  const longTokens = tokens.filter(w => w.length > 1);
  if (longTokens.length) tokens = longTokens;
  return visibleProducts().map(p => {
    const cat = getCategory(p.category);
    const sc = SCENTS[p.scent] || {};
    const hay = ' ' + normalizeText([
      p.name, p.name_en, p.desc, p.desc_en,
      ...Object.values(p.notes || {}), ...Object.values(p.notes_en || {}),
      sc.name, sc.name_en, cat?.name, cat?.name_en, ...(p.variants || []).map(v => v.label)
    ].join(' ')) + ' ';
    let score = 0;
    tokens.forEach(w => { if (hay.includes(w)) score += hay.includes(' ' + w + ' ') ? 2 : 1; });
    if (normalizeText(p.name + ' ' + p.name_en).includes(norm)) score += 5;
    return { p, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || (b.p.sold || 0) - (a.p.sold || 0)).map(x => x.p);
}

function openSearch() {
  const layer = $('#search-layer');
  layer.classList.add('open');
  layer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('tn-modal-open');
  const input = $('#search-input-global');
  input.value = '';
  renderSearchResults('');
  setTimeout(() => input.focus(), 50);
}
function closeSearch() {
  const layer = $('#search-layer');
  if (!layer || !layer.classList.contains('open')) return;
  layer.classList.remove('open');
  layer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('tn-modal-open');
}
function renderSearchResults(q) {
  const box = $('#search-results');
  if (!q.trim()) {
    const popular = visibleProducts().sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 4);
    box.innerHTML = `<div class="sr-label">${t('search.popular')}</div>
      <div class="sr-tags">${['vani', 'gỗ', 'hoa nhài', 'cam', 'quà tặng', '200g'].map(w => `<button type="button" class="sr-tag" data-q="${w}">${w}</button>`).join('')}</div>
      <div class="sr-list">${popular.map(searchItemHTML).join('')}</div>`;
    return;
  }
  const res = searchProducts(q);
  box.innerHTML = res.length
    ? `<div class="sr-label">${t('search.found', { n: res.length })}</div>
       <div class="sr-list">${res.slice(0, 6).map(searchItemHTML).join('')}</div>
       ${res.length > 6 ? `<a class="sr-all" href="#/search?q=${encodeURIComponent(q)}">${t('search.viewAll', { n: res.length })} →</a>` : ''}`
    : `<div class="sr-empty">${t('search.none', { q: escapeHTML(q) })}</div>`;
}
function searchItemHTML(p) {
  return `<a class="sr-item" href="#/product/${encodeURIComponent(p.id)}">
    <span class="sr-thumb" style="${paletteStyle(p)}">${thumbHTML(p)}</span>
    <span class="sr-text"><b>${escapeHTML(L(p, 'name'))}</b><small>${escapeHTML(L(getCategory(p.category) || {}, 'name'))}</small></span>
    <span class="sr-price">${priceHTML(p)}</span>
  </a>`;
}
function searchLayerHTML() {
  return `<div class="tn-search-layer" id="search-layer" aria-hidden="true">
    <div class="tn-search-panel" role="dialog" aria-label="${t('search.open')}">
      <form class="tn-search-bar" id="search-form">
        ${ICONS.search}
        <input id="search-input-global" type="search" autocomplete="off" placeholder="${t('search.placeholder')}">
        <button type="button" class="tn-icon-btn" data-ui="search-close" aria-label="${t('common.close')}">${ICONS.close}</button>
      </form>
      <div class="tn-search-results" id="search-results"></div>
    </div>
  </div>`;
}

/* ============================================================
   HIỆU ỨNG KHI CUỘN
   ============================================================ */
const reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function enhance(root) {
  /* 4. tách chữ để hiện từng ký tự */
  $$('.split', root).forEach(el => {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    const words = el.textContent.trim().split(/\s+/);
    let i = 0;
    if (!el.classList.contains('reveal') && !el.closest('.reveal')) el.classList.add('reveal');
    el.innerHTML = words.map(w => `<span class="sw">${Array.from(w).map(ch => `<span class="sc" style="--d:${(i++) * 0.022}s">${escapeHTML(ch)}</span>`).join('')}</span>`).join(' ');
  });
  /* 1. hiện dần khi cuộn tới */
  const revealEls = $$('.reveal', root);
  if (reducedMotion() || !('IntersectionObserver' in window)) revealEls.forEach(el => el.classList.add('in'));
  else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
    onCleanup(() => io.disconnect());
  }

  /* 2. đếm số */
  $$('.countup', root).forEach(el => {
    const to = Number(el.dataset.to) || 0;
    const run = () => {
      if (reducedMotion()) { el.textContent = fmtNum(to); return; }
      const start = performance.now(), dur = 1400;
      const step = (ts) => {
        const k = Math.min(1, (ts - start) / dur);
        el.textContent = fmtNum(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) return run();
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    onCleanup(() => io.disconnect());
  });

  /* 3. chữ gõ máy (typewriter) */
  $$('.typer', root).forEach(el => {
    let words = [];
    try { words = JSON.parse(el.dataset.words || '[]'); } catch {}
    if (!words.length) return;
    if (reducedMotion()) { el.textContent = words[0]; return; }
    let wi = 0, ci = 0, del = false, timer;
    const tick = () => {
      const w = Array.from(words[wi]);
      el.textContent = w.slice(0, ci).join('');
      if (!del && ci < w.length) { ci++; timer = setTimeout(tick, 70); }
      else if (!del) { del = true; timer = setTimeout(tick, 1600); }
      else if (ci > 0) { ci--; timer = setTimeout(tick, 35); }
      else { del = false; wi = (wi + 1) % words.length; timer = setTimeout(tick, 300); }
    };
    tick();
    onCleanup(() => clearTimeout(timer));
  });

}

/* chuỗi phân tách bằng dấu phẩy → mảng */
const listOf = (s) => String(s || '').split(',').map(x => x.trim()).filter(Boolean);

/* ============================================================
   SỰ KIỆN GIAO DIỆN CHUNG
   ============================================================ */
function initShellEvents() {
  document.body.insertAdjacentHTML('beforeend', searchLayerHTML());
  document.body.insertAdjacentHTML('beforeend', `<button class="tn-totop" id="tn-totop" aria-label="${t('footer.top')}">${ICONS.arrowUp}</button>`);

  document.addEventListener('click', (e) => {
    const ui = e.target.closest('[data-ui]');
    if (ui) {
      const k = ui.dataset.ui;
      if (k === 'drawer') { document.body.classList.add('tn-drawer-open'); $('#tn-drawer')?.setAttribute('aria-hidden', 'false'); }
      if (k === 'drawer-close') document.body.classList.remove('tn-drawer-open');
      if (k === 'search') openSearch();
      if (k === 'search-close') closeSearch();
      if (k === 'scroll-intro') $('#home-intro')?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
      return;
    }
    if (e.target.id === 'tn-drawer') document.body.classList.remove('tn-drawer-open');
    if (e.target.id === 'search-layer') closeSearch();
    const tag = e.target.closest('.sr-tag');
    if (tag) { $('#search-input-global').value = tag.dataset.q; renderSearchResults(tag.dataset.q); }
    if (e.target.closest('.sr-item, .sr-all')) closeSearch();

    const flag = e.target.closest('[data-lang]');
    if (flag && flag.dataset.lang !== getLang()) { setLang(flag.dataset.lang); }

    if (e.target.closest('#tn-totop')) window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSearch(); document.body.classList.remove('tn-drawer-open'); }
  });

  document.addEventListener('input', debounce((e) => {
    if (e.target.id === 'search-input-global') renderSearchResults(e.target.value);
  }, 160));

  document.addEventListener('submit', (e) => {
    if (e.target.id === 'search-form') {
      e.preventDefault();
      const q = $('#search-input-global').value.trim();
      if (q) { closeSearch(); location.hash = '/search?q=' + encodeURIComponent(q); }
    }
    if (e.target.id === 'news-form') {
      e.preventDefault();
      const input = e.target.querySelector('input');
      const email = input.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast(t('err.email'), 'err'); return; }
      const subs = store.subscribers();
      if (!subs.some(x => x.email === email)) { subs.push({ email, at: now() }); store.saveSubscribers(subs); }
      input.value = '';
      toast(t('footer.subscribed'), 'ok');
    }
  });

  /* header thu gọn + nút lên đầu trang */
  const onScroll = () => {
    const y = window.scrollY;
    $('#tn-header')?.classList.toggle('scrolled', y > 10);
    $('#tn-totop')?.classList.toggle('show', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}
