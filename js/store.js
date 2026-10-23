/* TRAM NEN · store.js
   localStorage mock backend: cài đặt shop, danh mục, sản phẩm (phân loại), đơn hàng,
   đánh giá, bài viết, mã giảm giá, thành viên, quản trị viên, nội dung trang chủ, giỏ hàng */

const KEYS = {
  settings:    'tn2_settings',
  categories:  'tn2_categories',
  products:    'tn2_products',
  orders:      'tn2_orders',
  reviews:     'tn2_reviews',
  posts:       'tn2_posts',
  discounts:   'tn2_discounts',
  members:     'tn2_members',
  admins:      'tn2_admins',
  home:        'tn2_home',
  messages:    'tn2_messages',
  subscribers: 'tn2_subscribers',
  cart:        'tn2_cart',
  cartCode:    'tn2_cart_code',
  session:     'tn2_session',
  seeded:      'tn2_seeded_v1'
};

const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch (e) { console.warn(e); toast(t('err.storage'), 'err'); return false; }
  }
};
/* tạo getter/setter cho từng bộ dữ liệu: store.products(), store.saveProducts(v) … */
['categories', 'products', 'orders', 'reviews', 'posts', 'discounts', 'members', 'admins', 'messages', 'subscribers', 'cart']
  .forEach(k => {
    store[k] = () => store.get(KEYS[k], []);
    store['save' + k[0].toUpperCase() + k.slice(1)] = (v) => store.set(KEYS[k], v);
  });
const settings = () => ({ ...DEFAULT_SETTINGS, ...store.get(KEYS.settings, {}) });
const saveSettings = (v) => store.set(KEYS.settings, v);
const homeContent = () => ({ ...DEFAULT_HOME, ...store.get(KEYS.home, {}) });
const saveHome = (v) => store.set(KEYS.home, v);

/* ----- phiên đăng nhập (chỉ dành cho quản trị viên) ----- */
function currentAdmin() {
  const s = store.get(KEYS.session, null);
  if (!s) return null;
  return store.admins().find(u => u.id === s.userId) || null;
}
const setSession = (userId) => store.set(KEYS.session, userId ? { userId, at: now() } : null);

/* ----- danh mục ----- */
const getCategory = (id) => store.categories().find(c => c.id === id);
const sortedCategories = () => store.categories().slice().sort((a, b) => (a.order || 0) - (b.order || 0));

/* ----- sản phẩm & phân loại ----- */
const getProductById = (id) => store.products().find(p => p.id === id);
const visibleProducts = () => store.products().filter(p => p.status === 'active');
const getVariant = (p, vid) => (p?.variants || []).find(v => v.id === vid) || (p?.variants || [])[0];
const salePrice = (price, p) => Math.round(price * (1 - (Number(p?.salePercent) || 0) / 100) / 1000) * 1000;
const variantPrice = (p, v) => salePrice((v || getVariant(p)).price, p);
const minPrice = (p) => Math.min(...(p.variants || []).map(v => v.price));
const minFinalPrice = (p) => Math.min(...(p.variants || []).map(v => variantPrice(p, v)));
const totalStock = (p) => (p.variants || []).reduce((s, v) => s + (Number(v.stock) || 0), 0);
const isOnSale = (p) => (Number(p.salePercent) || 0) > 0;

/* ----- đánh giá ----- */
const getReviewsForProduct = (pid) => store.reviews().filter(r => r.productId === pid);
const avgRating = (pid) => {
  const rs = getReviewsForProduct(pid);
  return rs.length ? rs.reduce((a, r) => a + r.rating, 0) / rs.length : null;
};

/* ----- bài viết ----- */
const publishedPosts = () => store.posts().filter(p => p.status === 'published').sort((a, b) => b.createdAt - a.createdAt);
const getPostBySlug = (slug) => store.posts().find(p => p.slug === slug);

/* ----- trạng thái đơn hàng ----- */
const ORDER_FLOW = ['pending', 'confirmed', 'shipping', 'done'];
const NEXT_STATUS = { pending: 'confirmed', confirmed: 'shipping', shipping: 'done' };

/* trả hàng về kho khi hủy/xóa đơn chưa hoàn tất */
function restoreStock(order) {
  const products = store.products();
  order.items.forEach(it => {
    const p = products.find(x => x.id === it.productId);
    const v = p && getVariant(p, it.variantId);
    if (v) { v.stock = (Number(v.stock) || 0) + it.qty; p.sold = Math.max(0, (p.sold || 0) - it.qty); }
  });
  store.saveProducts(products);
}

/* ============================================================
   MÃ GIẢM GIÁ
   ============================================================ */
function findDiscount(code) {
  code = String(code || '').trim().toUpperCase();
  if (!code) return { error: 'code.empty' };
  const d = store.discounts().find(x => x.code === code);
  if (!d) return { error: 'code.invalid' };
  if (!d.active) return { error: 'code.inactive' };
  if (d.expiresAt && d.expiresAt < now()) return { error: 'code.expired' };
  if (d.limit && (d.used || 0) >= d.limit) return { error: 'code.used' };
  return { discount: d };
}
const activePublicDiscounts = () => store.discounts().filter(d =>
  d.active && d.public && (!d.expiresAt || d.expiresAt >= now()) && (!d.limit || (d.used || 0) < d.limit));

/* ============================================================
   GIỎ HÀNG
   ============================================================ */
function cartLines() {
  return store.cart().map(l => {
    const product = getProductById(l.productId);
    const variant = product && getVariant(product, l.variantId);
    return { ...l, product, variant };
  }).filter(l => l.product && l.product.status === 'active' && l.variant && l.variant.id === l.variantId);
}
const cartCount = () => cartLines().reduce((s, l) => s + l.qty, 0);

function addToCart(pid, vid, qty = 1) {
  const p = getProductById(pid);
  if (!p || p.status !== 'active') { toast(t('err.unavailable'), 'err'); return false; }
  const v = getVariant(p, vid);
  if (!v || v.stock <= 0) { toast(t('err.outOfStock'), 'err'); return false; }
  const cart = store.cart();
  const line = cart.find(l => l.productId === pid && l.variantId === v.id);
  const current = line ? line.qty : 0;
  if (current >= v.stock) { toast(t('err.onlyLeft', { n: v.stock }), 'err'); return false; }
  const next = Math.min(v.stock, current + qty);
  if (line) line.qty = next; else cart.push({ productId: pid, variantId: v.id, qty: next });
  store.saveCart(cart);
  updateCartBadge();
  return true;
}
function setCartQty(pid, vid, qty) {
  let cart = store.cart();
  const p = getProductById(pid);
  const v = p && getVariant(p, vid);
  if (!v || qty <= 0) cart = cart.filter(l => !(l.productId === pid && l.variantId === vid));
  else {
    const line = cart.find(l => l.productId === pid && l.variantId === vid);
    if (line) line.qty = Math.min(qty, v.stock);
  }
  store.saveCart(cart);
  updateCartBadge();
}
const clearCart = () => { store.saveCart([]); store.set(KEYS.cartCode, null); updateCartBadge(); };

function cartTotals(lines = cartLines()) {
  const s = settings();
  const subtotal = lines.reduce((sum, l) => sum + variantPrice(l.product, l.variant) * l.qty, 0);
  const code = store.get(KEYS.cartCode, null);
  const found = code ? findDiscount(code) : {};
  const discount = found.discount || null;
  const discountAmount = discount ? Math.round(subtotal * discount.percent / 100) : 0;
  const after = subtotal - discountAmount;
  const shipping = subtotal === 0 || after >= s.freeShipFrom ? 0 : Number(s.shippingFee) || 0;
  return { subtotal, discount, discountAmount, shipping, total: after + shipping };
}
