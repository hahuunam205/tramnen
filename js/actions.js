/* TRAM NEN · actions.js
   Một trình xử lý click chung cho mọi phần tử có [data-action] (event delegation) */

const GLOBAL_ACTIONS = {
  'quick-view'(id) { const p = getProductById(id); if (p) openQuickView(p); },
  'cart-inc'(key) {
    const [pid, vid] = key.split('|');
    const line = store.cart().find(l => l.productId === pid && l.variantId === vid);
    const v = getVariant(getProductById(pid), vid);
    if (line && v && line.qty >= v.stock) { toast(t('err.onlyLeft', { n: v.stock }), 'err'); return; }
    if (line) setCartQty(pid, vid, line.qty + 1);
    route();
  },
  'cart-dec'(key) {
    const [pid, vid] = key.split('|');
    const line = store.cart().find(l => l.productId === pid && l.variantId === vid);
    if (line) setCartQty(pid, vid, line.qty - 1);
    route();
  },
  'cart-remove'(key) {
    const [pid, vid] = key.split('|');
    setCartQty(pid, vid, 0);
    toast(t('cart.removed'), 'ok');
    route();
  },
  'checkout'() { openCheckoutModal(); },
  'copy-code'(code) { copyText(code, t('sale.copied', { c: code })); },
  'copy-link'() { copyText(location.href, t('blog.linkCopied')); },
  'lightbox'(ref) { openLightbox(ref); },
  'play-video'() { const h = homeContent(); if (h.video) openLightbox(h.video); }
};

function copyText(text, okMsg) {
  const done = () => toast(okMsg, 'ok');
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => fallback());
  else fallback();
  function fallback() {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch { toast(text, ''); }
    ta.remove();
  }
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;
  const fn = GLOBAL_ACTIONS[el.dataset.action] || (typeof ADMIN_ACTIONS !== 'undefined' && ADMIN_ACTIONS[el.dataset.action]);
  if (fn) { e.preventDefault(); fn(el.dataset.id, el); }
});
