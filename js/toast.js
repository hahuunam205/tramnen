/* TRAM NEN · toast.js
   Thông báo nhanh */

function toast(msg, kind = '') {
  const wrap = $('#toasts');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = 'tn-toast' + (kind ? ' tn-toast--' + kind : '');
  el.setAttribute('role', 'status');
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .3s, transform .3s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 320);
  }, 2600);
}
