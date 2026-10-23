/* TRAM NEN · pages/info.js
   Về Trạm, Thành viên, Liên hệ, Tra cứu đơn hàng, Chính sách */

function pageHeroHTML(titleKeyOrText, sub, palette = 3, crumbKey) {
  return `<section class="page-hero" style="${paletteStyle({ palette })}">
    ${blobsHTML(palette + 30)}
    <div class="tn-container-wide page-hero-inner">
      <nav class="tn-crumbs"><a href="#/">${t('nav.home')}</a><span>/</span><span aria-current="page">${t(crumbKey)}</span></nav>
      <h1 class="tn-h1 split">${titleKeyOrText}</h1>
      ${sub ? `<p class="tn-sub">${sub}</p>` : ''}
    </div>
  </section>`;
}

/* ============================================================
   VỀ TRẠM
   ============================================================ */
function renderAbout(app) {
  const s = settings();
  const h = homeContent();
  const paragraphs = String(L(s, 'about')).split(/\n{2,}/).filter(Boolean);
  const values = [
    ['flame', 'about.v1t', 'about.v1d'], ['leaf', 'about.v2t', 'about.v2d'], ['gift', 'about.v3t', 'about.v3d']
  ];
  const tips = ['about.tip1', 'about.tip2', 'about.tip3', 'about.tip4'];
  const members = store.members().slice().sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 4);

  mount(app, appShell(`
    ${pageHeroHTML(escapeHTML(L(s, 'slogan')), escapeHTML(L(s, 'intro')), 3, 'nav.about')}

    <section class="tn-container-wide about-story">
      <div class="about-logo reveal reveal--left">
        <div class="about-logo-card">${logoHTML('dark')}</div>
      </div>
      <div class="reveal">
        <div class="tn-eyebrow">${t('about.storyEyebrow')}</div>
        <h2 class="tn-h2">${escapeHTML(L(h, 'introTitle'))}</h2>
        ${paragraphs.map(p => `<p class="tn-sub" style="margin-top:12px">${escapeHTML(p)}</p>`).join('')}
        <h3 class="tn-h3" style="margin-top:22px">${t('about.logoTitle')}</h3>
        <p class="tn-sub" style="margin-top:6px">${t('about.logoText')}</p>
        <div class="about-swatches" aria-label="${t('about.palette')}">
          ${['#92523b', '#935035', '#ffedcf', '#4b3224'].map(c => `<span style="background:${c}"><i>${c}</i></span>`).join('')}
        </div>
      </div>
    </section>

    <section class="tn-section-band">
      <div class="tn-container-wide">
        <div class="section-head reveal"><div><div class="tn-eyebrow">${t('about.valuesEyebrow')}</div><h2 class="tn-h2 split">${t('about.valuesTitle')}</h2></div></div>
        <div class="tn-grid tn-grid--3">
          ${values.map(([ic, tk, dk], i) => `
            <div class="value-card reveal" style="--rd:${i * 0.1}s">
              <span class="value-icon">${ICONS[ic]}</span>
              <h3 class="tn-h3">${t(tk)}</h3>
              <p class="tn-sub">${t(dk)}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <section class="tn-container-wide home-section">
      <div class="section-head reveal"><div><div class="tn-eyebrow">${t('about.tipsEyebrow')}</div><h2 class="tn-h2 split">${t('about.tipsTitle')}</h2></div></div>
      <div class="tn-grid tn-grid--2">
        ${tips.map((k, i) => `
          <div class="tip-card reveal" style="--rd:${(i % 2) * 0.08}s">
            <span class="tip-num">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="tn-h3">${t(k + 't')}</h3>
            <p class="tn-sub">${t(k + 'd')}</p>
          </div>`).join('')}
      </div>
    </section>

    ${members.length ? `
      <section class="tn-section-band">
        <div class="tn-container-wide">
          <div class="section-head reveal"><div><div class="tn-eyebrow">${t('nav.members')}</div><h2 class="tn-h2 split">${t('members.title')}</h2></div>
            <a href="#/members" class="tn-link-arrow">${t('common.viewAll')} ${icon('arrowRight')}</a></div>
          <div class="member-grid">${members.map(memberCardHTML).join('')}</div>
        </div>
      </section>` : ''}

    <div class="tn-container-wide">
      <div class="cta-band reveal">
        <div><h2 class="tn-h2">${t('about.ctaTitle')}</h2><p class="tn-sub">${t('about.ctaText')}</p></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <a href="#/shop" class="tn-btn tn-btn--primary tn-btn--lg">${t('home.ctaShop')}</a>
          <a href="#/contact" class="tn-btn tn-btn--ghost tn-btn--lg">${t('nav.contact')}</a>
        </div>
      </div>
    </div>
  `));
}

/* ============================================================
   THÀNH VIÊN
   ============================================================ */
function memberCardHTML(m, i = 0) {
  const photo = mediaURL(m.photo);
  return `<div class="member-card reveal" style="--rd:${(i % 4) * 0.08}s">
    <div class="member-photo" style="${paletteStyle({ palette: [3, 7, 4, 8, 1, 9][i % 6] })}">
      ${photo ? `<img src="${escapeHTML(photo)}" alt="${escapeHTML(m.name)}" loading="lazy">` : `${blobsHTML(i + 60)}<span class="member-initials">${escapeHTML(initials(m.name))}</span>`}
    </div>
    <div class="member-body">
      <h3>${escapeHTML(m.name)}</h3>
      <div class="member-role">${escapeHTML(L(m, 'role'))}</div>
      ${L(m, 'bio') ? `<p>${escapeHTML(L(m, 'bio'))}</p>` : ''}
    </div>
  </div>`;
}

function renderMembers(app) {
  const members = store.members().slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  mount(app, appShell(`
    ${pageHeroHTML(t('members.title'), t('members.subtitle'), 7, 'nav.members')}
    <div class="tn-container-wide home-section">
      ${members.length ? `<div class="member-grid">${members.map(memberCardHTML).join('')}</div>`
        : `<div class="tn-empty"><p class="tn-sub">${t('members.empty')}</p></div>`}
    </div>
  `));
}

/* ============================================================
   LIÊN HỆ
   ============================================================ */
function renderContact(app) {
  const s = settings();
  const cards = [
    s.address && ['pin', t('contact.address'), L(s, 'address'), `https://www.google.com/maps/search/${encodeURIComponent(s.address)}`, t('contact.map')],
    s.phone && ['phone', t('contact.phone'), s.phone, 'tel:' + s.phone.replace(/[^0-9+]/g, ''), t('contact.call')],
    s.email && ['mail', 'Email', s.email, 'mailto:' + s.email, t('contact.write')],
    s.hours && ['clock', t('contact.hours'), L(s, 'hours'), '', '']
  ].filter(Boolean);

  mount(app, appShell(`
    ${pageHeroHTML(t('contact.title'), t('contact.subtitle'), 1, 'nav.contact')}
    <div class="tn-container-wide home-section contact-layout">
      <div>
        <div class="contact-cards">
          ${cards.map(([ic, label, val, href, cta], i) => `
            <div class="contact-card reveal" style="--rd:${i * 0.07}s">
              <span class="contact-icon">${ICONS[ic]}</span>
              <div><small>${label}</small><b>${escapeHTML(val)}</b>${href ? `<a href="${escapeHTML(href)}" ${href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${cta} →</a>` : ''}</div>
            </div>`).join('')}
        </div>
        <div class="contact-social reveal">
          <h3 class="tn-h3">${t('contact.follow')}</h3>
          ${socialLinksHTML('tn-socials tn-socials--big')}
        </div>
        <a class="track-teaser reveal" href="#/track">${icon('truck')}<div><b>${t('footer.track')}</b><span>${t('track.teaser')}</span></div>${icon('arrowRight')}</a>
      </div>
      <form class="tn-card tn-pad contact-form reveal" id="contact-form" novalidate>
        <h2 class="tn-h2">${t('contact.formTitle')}</h2>
        <p class="tn-sub" style="margin-bottom:6px">${t('contact.formText')}</p>
        <div class="tn-row">
          <div class="tn-field"><label for="ct-name">${t('form.name')} *</label><input id="ct-name" autocomplete="name"></div>
          <div class="tn-field"><label for="ct-contact">${t('contact.phoneOrEmail')} *</label><input id="ct-contact"></div>
        </div>
        <div class="tn-field"><label for="ct-msg">${t('contact.message')} *</label><textarea id="ct-msg" maxlength="1000"></textarea></div>
        <button class="tn-btn tn-btn--primary tn-btn--lg" type="submit">${t('contact.send')}</button>
      </form>
    </div>
  `));

  $('#contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#ct-name').value.trim(), contact = $('#ct-contact').value.trim(), message = $('#ct-msg').value.trim();
    if (!name || !contact || !message) { toast(t('err.fillAll'), 'err'); return; }
    const msgs = store.messages();
    msgs.push({ id: 'msg_' + uid(), name, contact, message, read: false, createdAt: now() });
    store.saveMessages(msgs);
    e.target.reset();
    toast(t('contact.sent'), 'ok');
  });
}

/* ============================================================
   TRA CỨU ĐƠN HÀNG (thay cho tài khoản khách)
   ============================================================ */
function orderStepsHTML(status) {
  if (status === 'cancelled') return `<div class="order-cancelled">${t('status.cancelled')}</div>`;
  const idx = ORDER_FLOW.indexOf(status);
  return `<ol class="order-steps" style="--progress:${(idx / (ORDER_FLOW.length - 1)) * 100}%">
    ${ORDER_FLOW.map((st, i) => `<li class="${i <= idx ? 'done' : ''} ${i === idx ? 'current' : ''}"><span></span>${t('status.' + st)}</li>`).join('')}
  </ol>`;
}

function renderTrack(app, params) {
  const code = (params?.get('code') || '').trim().toUpperCase();
  const phone = (params?.get('phone') || '').replace(/[^0-9]/g, '');
  const order = code && phone ? store.orders().find(o => o.code.toUpperCase() === code && o.customer.phone.replace(/[^0-9]/g, '') === phone) : null;

  mount(app, appShell(`
    ${pageHeroHTML(t('footer.track'), t('track.subtitle'), 0, 'footer.track')}
    <div class="tn-container-narrow home-section">
      <form class="tn-card tn-pad track-form" id="track-form" novalidate>
        <div class="tn-field"><label for="tr-code">${t('track.code')}</label><input id="tr-code" value="${escapeHTML(code)}" placeholder="TN240101"></div>
        <div class="tn-field"><label for="tr-phone">${t('form.phone')}</label><input id="tr-phone" type="tel" value="${escapeHTML(params?.get('phone') || '')}"></div>
        <button class="tn-btn tn-btn--primary tn-btn--lg" type="submit">${t('track.go')}</button>
      </form>
      ${code && phone ? (order ? `
        <article class="tn-card order-card reveal" style="margin-top:22px">
          <header class="order-head">
            <div><div class="order-code">${t('track.order')} ${escapeHTML(order.code)}</div>
              <div class="tn-muted">${fmtDate(order.createdAt)} · ${order.payment === 'bank' ? t('pay.bank') : t('pay.cod')}</div></div>
            ${statusChip(order.status)}
          </header>
          ${orderStepsHTML(order.status)}
          <div class="order-items">
            ${order.items.map(it => `<div class="order-item"><div style="flex:1"><b>${escapeHTML(L(it, 'name'))}</b> <span class="tn-muted">(${escapeHTML(it.variantLabel)})</span></div><span class="tn-muted">${it.qty} × ${fmtVND(it.price)}</span></div>`).join('')}
          </div>
          <footer class="order-foot"><span class="tn-muted">${escapeHTML(order.customer.address)}</span><span class="order-total">${t('cart.total')}: <b>${fmtVND(order.total)}</b></span></footer>
        </article>` : `<div class="tn-empty" style="margin-top:22px"><p class="tn-sub">${t('track.notFound')}</p></div>`) : ''}
    </div>
  `));
  $('#track-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const c = $('#tr-code').value.trim(), ph = $('#tr-phone').value.trim();
    if (!c || !ph) { toast(t('err.fillAll'), 'err'); return; }
    location.hash = `/track?code=${encodeURIComponent(c)}&phone=${encodeURIComponent(ph)}`;
  });
}

function statusChip(status) {
  return `<span class="tn-chip tn-chip--${status}">${t('status.' + status)}</span>`;
}
function starsHTML(rating) {
  const r = Math.round(rating || 0);
  return `<span class="stars" aria-label="${(rating || 0).toFixed(1)} / 5">${'★'.repeat(r)}<span class="stars-off">${'★'.repeat(5 - r)}</span></span>`;
}

/* ============================================================
   CHÍNH SÁCH
   ============================================================ */
function renderPolicy(app) {
  const s = settings();
  const items = [['policy.shipping', 'policyShipping', 'truck'], ['policy.return', 'policyReturn', 'gift'], ['policy.privacy', 'policyPrivacy', 'leaf']];
  mount(app, appShell(`
    ${pageHeroHTML(t('policy.title'), '', 5, 'policy.title')}
    <div class="tn-container-narrow home-section">
      ${items.map(([k, f, ic], i) => `
        <section class="policy-block reveal" style="--rd:${i * 0.08}s">
          <span class="value-icon">${ICONS[ic]}</span>
          <div><h2 class="tn-h3">${t(k)}</h2>${String(L(s, f)).split(/\n+/).map(p => `<p class="tn-sub">${escapeHTML(p)}</p>`).join('')}</div>
        </section>`).join('')}
    </div>
  `));
}

/* ============================================================
   404
   ============================================================ */
function render404(app) {
  mount(app, appShell(`
    <div class="tn-container nf-wrap">
      <div class="nf-art" style="${paletteStyle({ palette: 2 })}">${thumbHTML({ id: '404', palette: 2 }, { art: 'jar', lit: false, noPhoto: true })}</div>
      <div class="nf-code">404</div>
      <h1 class="tn-h2">${t('nf.title')}</h1>
      <p class="tn-sub" style="margin-top:8px">${t('nf.text')}</p>
      <a href="#/shop" class="tn-btn tn-btn--primary" style="margin-top:20px">${t('home.ctaShop')}</a>
    </div>
  `));
}
