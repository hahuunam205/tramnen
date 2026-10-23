/* TRAM NEN · pages/home.js
   Trang chủ: hero carousel trụ xoay (giữ engine gốc) + các phần cuộn bên dưới */

function renderHome(app) {
  const h = homeContent();
  const s = settings();
  const slogan = L(s, 'slogan');
  const cut = slogan.indexOf(',');
  const line1 = cut > 0 ? slogan.slice(0, cut + 1) : slogan;
  const line2 = cut > 0 ? slogan.slice(cut + 1).trim() : '';

  const products = visibleProducts();
  let favorites = products.filter(p => p.featured);
  if (favorites.length < 4) favorites = favorites.concat(products.filter(p => !p.featured).sort((a, b) => (b.sold || 0) - (a.sold || 0))).slice(0, 4);
  favorites = favorites.slice(0, 8);
  const cats = sortedCategories().map(c => ({ ...c, count: products.filter(p => p.category === c.id).length }));
  const posts = publishedPosts().slice(0, 3);
  const codes = activePublicDiscounts();
  const saleProducts = products.filter(isOnSale);
  const totalSold = products.reduce((a, p) => a + (p.sold || 0), 0);
  const marquee = listOf(L(h, 'marquee'));
  const rotating = listOf(L(h, 'rotating'));
  const gallery = (h.gallery || []).filter(r => mediaURL(r));

  const marqueeRow = marquee.map(w => `<span>${escapeHTML(w)}</span><i aria-hidden="true">✦</i>`).join('');

  mount(app, appShell(`
    <!-- ============ HERO (carousel trụ xoay) ============ -->
    <section class="hero" aria-label="${escapeHTML(s.name)}">
      <div class="frame">
        <div class="carousel" id="carousel" aria-hidden="true"></div>

        <div class="badge">${escapeHTML(L(h, 'heroBadge'))}</div>
        <h1 class="headline">${escapeHTML(line1)}${line2 ? `<span class="l2">${escapeHTML(line2)}</span>` : ''}</h1>
        <p class="subline">${escapeHTML(L(h, 'heroText'))}</p>

        <svg class="doodles" viewBox="0 0 1440 1080" aria-hidden="true">
          <path pathLength="1" d="M262 365 Q269 346 277 329" style="animation-delay:.45s"/>
          <path pathLength="1" d="M287 371 Q294 352 302 335" style="animation-delay:.58s"/>
          <path pathLength="1" d="M1295 402 C1372 426 1400 482 1352 540" style="animation-delay:1.15s;animation-duration:1.05s"/>
          <path pathLength="1" d="M1368.6 531.7 L1352 540 L1357 522.1" style="animation-delay:2.05s;animation-duration:.35s"/>
          <path pathLength="1" d="M566 914 C552 882 532 854 510 830" style="animation-delay:1.8s;animation-duration:.75s"/>
          <path pathLength="1" d="M526 837 L510 830 L515.6 846.5" style="animation-delay:2.4s;animation-duration:.3s"/>
        </svg>
        <div class="note note--seen">${t('home.note1')}</div>
        <div class="note note--zero">${t('home.note2')}</div>

        <div class="hero-cta">
          <a href="#/shop">${t('home.ctaShop')} →</a>
          <a href="#/about" class="ghost">${t('home.ctaAbout')}</a>
        </div>

        <!-- hero rút gọn cho màn hình nhỏ -->
        <div class="lm-mobile" aria-hidden="true">
          <div class="lm-cards">
            ${[['tealight', 4], ['jar', 0], ['oil', 7]].map(([art, pal], i) => {
              const img = (h.carousel || []).filter(r => mediaURL(r))[i];
              return `<div class="lm-card lm-card--${i + 1}" style="${paletteStyle({ palette: pal })}">
                ${img ? `<img class="tn-photo" src="${escapeHTML(mediaURL(img))}" alt="">` : thumbHTML({ id: 'm' + i, palette: pal }, { art, noPhoto: true })}
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>
      <button type="button" class="hero-scroll" data-ui="scroll-intro" aria-label="${t('home.scroll')}"><span></span></button>
    </section>

    <!-- ============ DẢI CHỮ CHẠY ============ -->
    <div class="marquee" aria-hidden="true">
      <div class="marquee-track">${marqueeRow}${marqueeRow}</div>
    </div>

    <!-- ============ GIỚI THIỆU THƯƠNG HIỆU ============ -->
    <section class="home-intro tn-container-wide" id="home-intro">
      <div class="intro-media reveal reveal--left">
        ${h.introMedia && mediaURL(h.introMedia)
          ? mediaHTML(h.introMedia, { cls: 'intro-media-el', alt: L(h, 'introTitle') })
          : `<div class="intro-illus" style="${paletteStyle({ palette: 3 })}">
               ${blobsHTML(21)}
               <div class="intro-illus-art">${artSVG('jar')}</div>
               <div class="intro-illus-logo">${logoMarkSVG()}</div>
             </div>`}
        <div class="intro-badge">${logoMarkSVG()}<span>${t('home.since')}</span></div>
      </div>
      <div class="intro-text">
        <div class="tn-eyebrow reveal">${t('nav.about')}</div>
        <h2 class="tn-h2 split reveal">${escapeHTML(L(h, 'introTitle'))}</h2>
        <p class="tn-sub reveal" style="--rd:.1s">${escapeHTML(L(h, 'introText'))}</p>
        ${rotating.length ? `<p class="intro-typer reveal" style="--rd:.15s">${t('home.lightUp')} <span class="typer" data-words="${escapeHTML(JSON.stringify(rotating))}"></span><span class="typer-caret"></span></p>` : ''}
        <div class="intro-stats reveal" style="--rd:.2s">
          <div><b class="countup" data-to="${products.length}">0</b><span>${t('home.statProducts')}</span></div>
          <div><b class="countup" data-to="${Object.keys(SCENTS).length}">0</b><span>${t('home.statScents')}</span></div>
          <div><b class="countup" data-to="${totalSold}">0</b><span>${t('home.statSold')}</span></div>
        </div>
        <a href="#/about" class="tn-btn tn-btn--primary tn-btn--lg reveal" style="--rd:.25s">${t('home.readStory')} ${icon('arrowRight')}</a>
      </div>
    </section>

    <!-- ============ DANH MỤC ============ -->
    <section class="tn-section-band">
      <div class="tn-container-wide">
        <div class="section-head reveal">
          <div>
            <div class="tn-eyebrow">${t('home.catEyebrow')}</div>
            <h2 class="tn-h2 split">${t('home.catTitle')}</h2>
          </div>
          <a href="#/shop" class="tn-link-arrow">${t('common.viewAll')} ${icon('arrowRight')}</a>
        </div>
        <div class="cat-grid">
          ${cats.map((c, i) => `
            <a class="cat-card reveal" href="#/shop?cat=${encodeURIComponent(c.id)}" style="--rd:${i * 0.08}s;${paletteStyle({ palette: [3, 4, 8, 7, 1, 5][i % 6] })}">
              <div class="cat-art">${blobsHTML(i + 5)}<div class="tn-art-wrap">${artSVG(c.art)}</div>
                ${c.image && mediaURL(c.image) ? `<img class="tn-photo" src="${escapeHTML(mediaURL(c.image))}" alt="">` : ''}</div>
              <div class="cat-body">
                <h3>${escapeHTML(L(c, 'name'))}</h3>
                <p>${t('home.catCount', { n: c.count })}</p>
              </div>
              <span class="cat-arrow">${ICONS.arrowRight}</span>
            </a>`).join('')}
        </div>
      </div>
    </section>

    <!-- ============ SẢN PHẨM ĐƯỢC YÊU THÍCH ============ -->
    <section class="tn-container-wide home-section">
      <div class="section-head reveal">
        <div>
          <div class="tn-eyebrow">${t('home.favEyebrow')}</div>
          <h2 class="tn-h2 split">${t('home.favTitle')}</h2>
        </div>
        <a href="#/shop" class="tn-link-arrow">${t('common.viewAll')} ${icon('arrowRight')}</a>
      </div>
      <div class="tn-grid tn-grid--products">${favorites.map((p, i) => productCardHTML(p, i)).join('')}</div>
    </section>

    <!-- ============ VIDEO ============ -->
    <section class="home-video reveal" style="${paletteStyle({ palette: 8 })}">
      ${h.video && mediaURL(h.video)
        ? mediaHTML(h.video, { cls: 'home-video-bg', poster: h.videoPoster })
        : `<div class="home-video-placeholder">${blobsHTML(33)}<div class="hv-candles">
             <div>${artSVG('tealight')}</div><div>${artSVG('jar')}</div><div>${artSVG('jar')}</div></div></div>`}
      <div class="home-video-shade"></div>
      <div class="home-video-text">
        <div class="tn-eyebrow tn-eyebrow--light">${escapeHTML(s.name)}</div>
        <h2 class="split reveal">${escapeHTML(L(h, 'videoTitle'))}</h2>
        <p class="reveal" style="--rd:.15s">${escapeHTML(L(h, 'videoText'))}</p>
        ${h.video && mediaURL(h.video) ? `<button class="hv-play" data-action="play-video" aria-label="${t('home.playVideo')}">${ICONS.play}</button>` : ''}
      </div>
    </section>

    <!-- ============ SALE ============ -->
    ${codes.length || saleProducts.length ? `
      <section class="tn-container-wide home-section">
        <div class="sale-banner reveal">
          <div class="sale-banner-text">
            <div class="tn-eyebrow tn-eyebrow--light">${t('nav.sale')}</div>
            <h2>${t('home.saleTitle')}</h2>
            <p>${saleProducts.length ? t('home.saleText', { n: saleProducts.length }) : t('home.saleTextCodes')}</p>
            <div class="code-chips">
              ${codes.slice(0, 3).map(d => `<button class="code-chip" data-action="copy-code" data-id="${escapeHTML(d.code)}">${icon('tag')}<b>${escapeHTML(d.code)}</b><span>−${d.percent}%</span></button>`).join('')}
            </div>
            <a href="#/sale" class="tn-btn tn-btn--cream tn-btn--lg">${t('home.saleCta')} ${icon('arrowRight')}</a>
          </div>
          <div class="sale-banner-art" aria-hidden="true">
            <div class="sale-percent">−${Math.max(...codes.map(d => d.percent), ...saleProducts.map(p => p.salePercent), 0)}%</div>
            <div class="sale-gift">${artSVG('gift')}</div>
          </div>
        </div>
      </section>` : ''}

    <!-- ============ THƯ VIỆN ẢNH ============ -->
    <section class="tn-container-wide home-section">
      <div class="section-head reveal">
        <div>
          <div class="tn-eyebrow">${t('home.galleryEyebrow')}</div>
          <h2 class="tn-h2 split">${escapeHTML(L(h, 'galleryTitle'))}</h2>
        </div>
        ${socialLinksHTML('tn-socials tn-socials--dark')}
      </div>
      <div class="gallery-grid">
        ${(gallery.length ? gallery : [0, 1, 2, 3, 4, 5]).slice(0, 9).map((g, i, arr) => gallery.length
          ? `<button class="gallery-item reveal ${gallerySpan(i, arr.length) ? 'span2' : ''}" style="--rd:${(i % 3) * 0.08}s" data-action="lightbox" data-id="${escapeHTML(g)}">
               ${mediaHTML(g, { alt: '' })}${isVideoRef(g) ? `<span class="gallery-play">${ICONS.play}</span>` : ''}
             </button>`
          : `<div class="gallery-item gallery-item--ph reveal" style="--rd:${(i % 3) * 0.08}s;${paletteStyle({ palette: [0, 3, 7, 9, 4, 8][i] })}">
               ${blobsHTML(40 + i)}<div class="tn-art-wrap">${artSVG(['jar', 'oil', 'tealight', 'gift', 'jar', 'tealight'][i])}</div>
             </div>`).join('')}
      </div>
    </section>

    <!-- ============ BLOG ============ -->
    ${posts.length ? `
      <section class="tn-section-band">
        <div class="tn-container-wide">
          <div class="section-head reveal">
            <div>
              <div class="tn-eyebrow">${t('nav.blog')}</div>
              <h2 class="tn-h2 split">${t('home.blogTitle')}</h2>
            </div>
            <a href="#/blog" class="tn-link-arrow">${t('common.viewAll')} ${icon('arrowRight')}</a>
          </div>
          <div class="tn-grid tn-grid--3">${posts.map((p, i) => postCardHTML(p, i)).join('')}</div>
        </div>
      </section>` : ''}
  `, { home: true }));

  initHeroCarousel();
}

/* ô cao gấp đôi để lưới thư viện luôn kín (bội số của 3 ô) */
function gallerySpan(i, n) {
  const need = (3 - n % 3) % 3;
  const spots = n >= 5 ? [0, 4] : [0];
  return spots.slice(0, need).includes(i);
}

/* ----- carousel trụ xoay (cylinder, kéo thả, quán tính) — engine giữ từ bản gốc ----- */
function initHeroCarousel() {
  const carousel = $('#carousel');
  if (!carousel) return;

  const N = 10, PITCH = 196, SPAN = N * PITCH, CX = 720, HALF = 706, EH = 520, K = 0.2929, AUTO = 50;
  const ORDER = ['jar', 'tealight', 'jar', 'oil', 'gift', 'jar', 'tealight', 'oil', 'jar', 'gift'];
  const images = (homeContent().carousel || []).map(mediaURL).filter(Boolean);
  const cards = [];

  for (let i = 0; i < N; i++) {
    const el = document.createElement('div');
    el.className = 'card';
    const [c1, c2] = PALETTES[i % PALETTES.length];
    const img = images.length ? images[i % images.length] : '';
    el.innerHTML = `<div class="clip" style="--c1:${c1};--c2:${c2}">${blobsHTML(i)}
      ${img ? `<img class="tn-photo" src="${escapeHTML(img)}" alt="" draggable="false">` : `<div class="clip-art">${artSVG(ORDER[i])}</div>`}</div>`;
    carousel.appendChild(el);
    cards.push(el);
  }

  let S = 0, vel = AUTO, dragging = false, pointerId = null, lastPX = 0, lastMoveT = 0, pxPerU = 1;
  const U = (n) => `calc(${n.toFixed(2)} * var(--u))`;

  function updateScale() {
    const w = carousel.getBoundingClientRect().width;
    pxPerU = (w > 0 ? w / 1440 : 1);
  }
  updateScale();
  window.addEventListener('resize', updateScale);

  function render() {
    for (let i = 0; i < N; i++) {
      const el = cards[i];
      const tt = ((i * PITCH - S) % SPAN + SPAN) % SPAN - SPAN / 2;
      const nt = tt / HALF;
      const x = CX + tt * (1 + 0.083 * nt * nt);
      const d = Math.abs(x - CX) / HALF;
      const w = 170 + 48 * d * d;
      const left = x - w / 2, right = left + w;
      const qL = Math.abs(left - CX) / HALF, qR = Math.abs(right - CX) / HALF;
      const hL = 280 + 92 * Math.pow(qL, 2.6);
      const hR = 280 + 92 * Math.pow(qR, 2.6);
      const cy = 657 - 12 * d * d;
      const top = cy - EH / 2;
      const tL = (EH - hL) / 2, bL = (EH + hL) / 2;
      const tR = (EH - hR) / 2, bR = (EH + hR) / 2;
      const rr = Math.min(20, hL * 0.22, hR * 0.22, w * 0.22);
      const pts = [
        [0, tL + rr], [K * rr, tL + K * rr], [rr, tL],
        [w - rr, tR], [w - K * rr, tR + K * rr], [w, tR + rr],
        [w, bR - rr], [w - K * rr, bR - K * rr], [w - rr, bR],
        [rr, bL], [K * rr, bL - K * rr], [0, bL - rr]
      ];
      let poly = '';
      for (let p = 0; p < pts.length; p++) {
        poly += (p ? ',' : '') + (pts[p][0] / w * 100).toFixed(2) + '% ' + (pts[p][1] / EH * 100).toFixed(2) + '%';
      }
      el.style.left = U(left);
      el.style.top = U(top);
      el.style.width = U(w);
      el.style.clipPath = 'polygon(' + poly + ')';
    }
  }

  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true; pointerId = e.pointerId;
    try { carousel.setPointerCapture(e.pointerId); } catch (err) {}
    carousel.classList.add('grabbing');
    lastPX = e.clientX; lastMoveT = performance.now(); vel = 0;
    e.preventDefault();
  };
  const onMove = (e) => {
    if (!dragging || e.pointerId !== pointerId) return;
    const n = performance.now();
    const dt = Math.max((n - lastMoveT) / 1000, 0.001);
    const dxu = (e.clientX - lastPX) / pxPerU;
    S -= dxu;
    vel = vel * 0.55 + (-dxu / dt) * 0.45;
    lastPX = e.clientX; lastMoveT = n;
  };
  const onEnd = (e) => {
    if (!dragging) return;
    if (e && e.pointerId !== undefined && e.pointerId !== pointerId) return;
    dragging = false; pointerId = null; carousel.classList.remove('grabbing');
    if (performance.now() - lastMoveT > 110) vel = 0;
    vel = Math.max(-3600, Math.min(3600, vel));
  };
  carousel.addEventListener('pointerdown', onDown);
  carousel.addEventListener('pointermove', onMove);
  carousel.addEventListener('pointerup', onEnd);
  carousel.addEventListener('pointercancel', onEnd);
  carousel.addEventListener('lostpointercapture', onEnd);

  let last = performance.now(), raf = null;
  function tick(ts) {
    const dt = Math.min((ts - last) / 1000, 0.05); last = ts;
    /* ẩn trên điện thoại hoặc đã cuộn khỏi màn hình — không tốn khung hình */
    const r = carousel.getBoundingClientRect();
    if (!carousel.offsetParent || r.bottom < 0) { raf = requestAnimationFrame(tick); return; }
    if (!dragging) {
      vel = AUTO + (vel - AUTO) * Math.pow(0.05, dt);
      if (Math.abs(vel - AUTO) < 0.4) vel = AUTO;
    }
    S += vel * dt;
    render();
    raf = requestAnimationFrame(tick);
  }
  render();
  raf = requestAnimationFrame(tick);

  onCleanup(() => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', updateScale);
  });
}
