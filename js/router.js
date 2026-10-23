/* TRAM NEN · router.js
   Hash router (#/duong-dan?query) + cơ chế dọn dẹp khi rời trang */

let pageCleanups = [];
const onCleanup = (fn) => pageCleanups.push(fn);

function parseHash() {
  const hash = location.hash.slice(1) || '/';
  const [path, query = ''] = hash.split('?');
  const decode = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
  return { path, parts: path.split('/').filter(Boolean).map(decode), params: new URLSearchParams(query) };
}

/* gán HTML cho #app rồi kích hoạt hiệu ứng (reveal, typewriter, count-up…) */
function mount(app, html) {
  app.innerHTML = html;
  enhance(app);
}

function route() {
  pageCleanups.forEach(fn => { try { fn(); } catch (e) {} });
  pageCleanups = [];
  $$('.tn-modal-backdrop').forEach(m => m.remove());
  document.body.classList.remove('tn-modal-open', 'tn-drawer-open');
  closeSearch();

  const app = $('#app');
  const { parts, params } = parseHash();
  const [a, b, c] = parts;
  document.documentElement.lang = getLang();
  document.body.classList.toggle('is-admin', a === 'admin');

  try {
    if (a === 'admin') return adminRoute(app, parts.slice(1), params);

    if (!a) return renderHome(app);
    if (a === 'about') return renderAbout(app);
    if (a === 'shop') return renderShop(app, params);
    if (a === 'product' && b) return renderProductDetail(app, b);
    if (a === 'sale') return renderSale(app);
    if (a === 'blog') return b ? renderPost(app, b) : renderBlog(app, params);
    if (a === 'members') return renderMembers(app);
    if (a === 'contact') return renderContact(app);
    if (a === 'track') return renderTrack(app, params);
    if (a === 'cart') return renderCart(app);
    if (a === 'search') return renderSearch(app, params);
    if (a === 'policy') return renderPolicy(app);
    render404(app);
  } catch (err) {
    console.error(err);
    mount(app, appShell(`<div class="tn-container"><div class="tn-empty"><h3>${t('err.generic')}</h3><p class="tn-sub">${escapeHTML(err.message)}</p></div></div>`));
  }
}
