/* TRAM NEN · boot.js
   Khởi động: nạp dữ liệu mẫu, kho media (IndexedDB), giao diện chung rồi render trang */

document.addEventListener('DOMContentLoaded', async () => {
  seed();
  document.documentElement.lang = getLang();
  initShellEvents();
  await mediaInit();

  window.addEventListener('hashchange', () => { window.scrollTo(0, 0); route(); });
  /* đồng bộ giữa các tab (giỏ hàng, nội dung quản trị…) */
  window.addEventListener('storage', (e) => { if (e.key && e.key.startsWith('tn2_')) route(); });

  window.__TN = { store, settings, homeContent, cartLines, route, mediaUsage };
  route();
});
