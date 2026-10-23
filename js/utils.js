/* TRAM NEN · utils.js
   Helpers, định dạng, nhóm hương, logo, icon, cờ, hình minh họa sản phẩm (SVG) */

/* ============================================================
   1. HELPERS
   ============================================================ */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const now = () => Date.now();
const DAY = 86400000;

const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const fmtVND = (n) => Math.round(Number(n) || 0).toLocaleString(getLang() === 'en' ? 'en-US' : 'vi-VN') + '₫';
const fmtNum = (n) => (Number(n) || 0).toLocaleString(getLang() === 'en' ? 'en-US' : 'vi-VN');
const fmtDate = (ts) => new Date(ts).toLocaleDateString(getLang() === 'en' ? 'en-GB' : 'vi-VN',
  { day: '2-digit', month: getLang() === 'en' ? 'short' : '2-digit', year: 'numeric' });
const fmtRelative = (ts) => {
  const s = Math.floor((now() - ts) / 1000);
  if (s < 60) return t('time.now');
  if (s < 3600) return t('time.min', { n: Math.floor(s / 60) });
  if (s < 86400) return t('time.hour', { n: Math.floor(s / 3600) });
  if (s < 604800) return t('time.day', { n: Math.floor(s / 86400) });
  return fmtDate(ts);
};
const fmtSize = (b) => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
const initials = (name) => String(name || '?').trim().split(/\s+/).slice(-2).map(w => w[0]).join('').toUpperCase();
const slugify = (s) => String(s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/đ/gi, 'd').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/* chuẩn hóa để tìm kiếm: bỏ dấu, chữ thường, chỉ còn chữ-số và khoảng trắng */
const normalizeText = (s) => slugify(s).replace(/-/g, ' ');
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const debounce = (fn, ms) => { let tm; return (...a) => { clearTimeout(tm); tm = setTimeout(() => fn(...a), ms); }; };

/* ----- bảng màu ấm (nền gradient của thẻ sản phẩm) ----- */
const PALETTES = [
  ['#FFE9CC', '#F2C48D'], ['#F8DCC0', '#D9A37A'], ['#FFF1DC', '#E9C9A0'], ['#F3D3B8', '#C98B66'],
  ['#FBE4C9', '#E3AE7E'], ['#FFF4E4', '#EDD3AE'], ['#F1D6BF', '#C99476'], ['#FCE6D0', '#E0A985'],
  ['#EBCFB5', '#B9805F'], ['#FFEEDB', '#E8BD92']
];
const paletteOf = (p) => PALETTES[Math.abs(Number(p?.palette) || 0) % PALETTES.length];
const paletteStyle = (p) => { const [c1, c2] = paletteOf(p); return `--c1:${c1};--c2:${c2}`; };

/* ----- nhóm hương ----- */
const SCENTS = {
  'go-am':     { name: 'Gỗ ấm', name_en: 'Warm woods', palette: 3,
                 notes: 'Tuyết tùng · Đàn hương · Hổ phách', notes_en: 'Cedar · Sandalwood · Amber',
                 desc: 'Trầm, ấm và vững chãi — hợp những tối mưa hay góc đọc sách.',
                 desc_en: 'Deep, warm and grounding — made for rainy evenings and reading nooks.' },
  'hoa-co':    { name: 'Hoa cỏ', name_en: 'Florals', palette: 7,
                 notes: 'Hoa nhài · Hoa hồng · Oải hương', notes_en: 'Jasmine · Rose · Lavender',
                 desc: 'Mềm mại, dịu dàng như một bó hoa vừa cắm trên bàn.',
                 desc_en: 'Soft and gentle, like fresh flowers on the table.' },
  'cam-chanh': { name: 'Cam chanh', name_en: 'Citrus', palette: 0,
                 notes: 'Cam ngọt · Chanh vàng · Bergamot', notes_en: 'Sweet orange · Lemon · Bergamot',
                 desc: 'Tươi sáng, tỉnh táo — dành cho buổi sáng và bàn làm việc.',
                 desc_en: 'Bright and uplifting — for mornings and busy desks.' },
  'ngot-ngao': { name: 'Ngọt ngào', name_en: 'Gourmand', palette: 9,
                 notes: 'Vani · Caramel · Đậu tonka', notes_en: 'Vanilla · Caramel · Tonka bean',
                 desc: 'Ngọt êm như mẻ bánh vừa ra lò, ấm lòng cả căn phòng.',
                 desc_en: 'Sweet and cosy, like a fresh batch of pastries.' },
  'thao-moc':  { name: 'Thảo mộc', name_en: 'Herbal', palette: 2,
                 notes: 'Sả chanh · Bạc hà · Cỏ hương bài', notes_en: 'Lemongrass · Mint · Vetiver',
                 desc: 'Xanh mát và thư thái, giúp đầu óc nhẹ đi sau một ngày dài.',
                 desc_en: 'Green and calming, a reset after a long day.' }
};
const ART_TYPES = { jar: 'Nến hũ', tealight: 'Nến trụ + tealight', oil: 'Lọ tinh dầu', gift: 'Hộp quà' };

/* deterministic pseudo-random cho vị trí blob */
const rnd = (seed) => { const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const seedOf = (s) => String(s || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);

/* ============================================================
   2. BLOBS (hiệu ứng trôi lơ lửng)
   ============================================================ */
function blobsHTML(seed) {
  let out = '';
  for (let j = 0; j < 3; j++) {
    const l = 4 + rnd(seed * 3.1 + j * 1.7) * 62;
    const tp = 4 + rnd(seed * 5.3 + j * 2.9) * 62;
    const s = 38 + rnd(seed * 7.7 + j * 3.3) * 54;
    const cls = j === 2 ? 'b3' : (j === 1 ? 'b2' : 'b1');
    const dur = 7 + rnd(seed * 2.2 + j * 4.4) * 5;
    const del = -rnd(seed * 1.3 + j * 6.1) * 8;
    out += `<span class="${cls}" style="left:${l.toFixed(1)}%;top:${tp.toFixed(1)}%;width:${s.toFixed(1)}%;animation-duration:${dur.toFixed(2)}s;animation-delay:${del.toFixed(2)}s"></span>`;
  }
  return `<div class="blobs">${out}</div>`;
}

/* ============================================================
   3. LOGO (vector trace từ logo gốc — xem logo.js)
   ============================================================ */
function logoMarkSVG(cls = '', color = LOGO_COLORS.flame) {
  return `<svg class="tn-logo-mark ${cls}" viewBox="${LOGO_MARK_VIEW}" aria-hidden="true"><path fill="${color}" fill-rule="evenodd" d="${LOGO_MARK_PATH}"/></svg>`;
}
function logoTextSVG(cls = '') {
  return `<svg class="tn-logo-text ${cls}" viewBox="${LOGO_TEXT_VIEW}" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="${LOGO_TEXT_PATH}"/></svg>`;
}
/* logo ngang: biểu tượng + chữ. variant 'light' dùng trên nền tối */
function logoHTML(variant = 'dark', extra = '') {
  const custom = settings().logo && mediaURL(settings().logo);
  if (custom) return `<span class="tn-logo tn-logo--img ${extra}"><img src="${escapeHTML(custom)}" alt="${escapeHTML(settings().name)}"></span>`;
  return `<span class="tn-logo tn-logo--${variant} ${extra}" role="img" aria-label="${escapeHTML(settings().name)}">${logoMarkSVG()}${logoTextSVG()}</span>`;
}

/* logo nhỏ in trên nhãn sản phẩm trong SVG minh họa */
function labelMark(cx, top, h, color = LOGO_COLORS.flame) {
  const s = h / 902, w = 599 * s;
  return `<path transform="translate(${(cx - w / 2).toFixed(2)} ${top}) scale(${s.toFixed(5)})" fill="${color}" fill-rule="evenodd" d="${LOGO_MARK_PATH}"/>`;
}
function labelText(cx, top, w, color = '#4b3224') {
  const s = w / 1530;
  return `<path transform="translate(${(cx - w / 2).toFixed(2)} ${top}) scale(${s.toFixed(5)})" fill="${color}" fill-rule="evenodd" d="${LOGO_TEXT_PATH}"/>`;
}

/* ============================================================
   4. ICONS
   ============================================================ */
const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5z"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4h14v12H1zM15 9h4l3 3v4h-7"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c3 4 6 6.5 6 11a6 6 0 0 1-12 0c0-2.5 1-4 2.5-5.5C9 10 10 11 11 11c0-3 .5-6 1-9z"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>',
  messenger: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88c.17-.07.36-.09.53-.04.91.25 1.88.39 2.9.39 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm6 7.46-2.94 4.66c-.47.74-1.47.93-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.19-.69-.63l2.94-4.66c.47-.74 1.47-.93 2.17-.4l2.34 1.75c.21.16.51.16.72 0l3.16-2.4c.42-.32.97.18.69.63z"/></svg>',
  zalo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2.5c-5.5 0-10 3.9-10 8.7 0 2.7 1.4 5.1 3.6 6.7l-.8 3.6 3.9-2c1 .3 2.1.4 3.3.4 5.5 0 10-3.9 10-8.7s-4.5-8.7-10-8.7z" stroke-linejoin="round"/><text x="12" y="13.6" text-anchor="middle" font-size="6.4" font-weight="700" font-family="Arial,sans-serif" fill="currentColor" stroke="none">Zalo</text></svg>',
  shopee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16l-1.3 13a1.5 1.5 0 0 1-1.5 1.3H6.8a1.5 1.5 0 0 1-1.5-1.3L4 7z"/><path d="M8.5 7a3.5 3.5 0 0 1 7 0"/><path d="M14 11.5c-.6-.6-1.3-.9-2.1-.9-1 0-1.9.6-1.9 1.5 0 2 4.2 1.2 4.2 3.3 0 .9-.9 1.6-2.1 1.6-.9 0-1.7-.4-2.2-1"/></svg>'
};
const icon = (name, cls = '') => `<span class="tn-ic ${cls}" aria-hidden="true">${ICONS[name] || ''}</span>`;

const SOCIALS = [
  ['facebook', 'Facebook'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['youtube', 'YouTube'],
  ['messenger', 'Messenger'], ['zalo', 'Zalo'], ['shopee', 'Shopee']
];
/* link Zalo: cho phép nhập số điện thoại hoặc link đầy đủ */
const socialHref = (key, val) => {
  if (!val) return '';
  if (key === 'zalo' && /^[0-9 +.]+$/.test(val)) return 'https://zalo.me/' + val.replace(/[^0-9]/g, '');
  return val;
};
function socialLinksHTML(cls = 'tn-socials') {
  const s = settings();
  const items = SOCIALS.filter(([k]) => s[k]);
  if (!items.length) return '';
  return `<div class="${cls}">${items.map(([k, label]) =>
    `<a href="${escapeHTML(socialHref(k, s[k]))}" target="_blank" rel="noopener" aria-label="${label}" title="${label}">${ICONS[k]}</a>`).join('')}</div>`;
}

/* ----- cờ ngôn ngữ ----- */
const FLAGS = {
  vi: '<svg viewBox="0 0 30 20" preserveAspectRatio="none"><rect width="30" height="20" fill="#DA251D"/><polygon fill="#FFDD00" points="15,4 16.35,8.15 20.71,8.15 17.18,10.71 18.53,14.85 15,12.29 11.47,14.85 12.82,10.71 9.29,8.15 13.65,8.15"/></svg>',
  en: '<svg viewBox="0 0 60 30" preserveAspectRatio="none"><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="2.4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></svg>'
};

/* ============================================================
   5. HÌNH MINH HỌA SẢN PHẨM (SVG) — có logo TRAM NEN trên nhãn
   ============================================================ */
function flameSVG(x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle class="tn-glow" cx="0" cy="-11" r="17" fill="rgba(255,196,110,.38)"/>
    <g class="tn-flicker">
      <path d="M0 -27C7.5 -16 9.5 -7.5 0 0C-9.5 -7.5 -7.5 -16 0 -27Z" fill="#F2A24A"/>
      <path d="M0 -17C3.6 -11 4.3 -5.5 0 -1.8C-4.3 -5.5 -3.6 -11 0 -17Z" fill="#FFE6A8"/>
    </g>
  </g>`;
}

function artSVG(type, opts = {}) {
  const lit = opts.lit !== false;
  const brand = '#92523b', ink = '#4b3224';
  const shadow = (rx) => `<ellipse cx="60" cy="152" rx="${rx}" ry="5" fill="rgba(75,50,36,.13)"/>`;

  if (type === 'tealight') {
    return `<svg class="tn-art" viewBox="0 0 120 160" aria-hidden="true">
      ${shadow(46)}
      <rect x="20" y="62" width="44" height="88" rx="8" fill="#FFF3E0" stroke="rgba(75,50,36,.18)"/>
      <path d="M20 70c0-5 4-8 8-8h28c4 0 8 3 8 8v6c-3 0-3 7-6 7s-3-5-6-5-3 9-6 9-3-6-6-6-3 4-6 4-3-8-6-8-3 3-6 3z" fill="#FBE1C3"/>
      <rect x="20" y="99" width="44" height="34" fill="${brand}" opacity=".94"/>
      ${labelMark(42, 102, 15)}
      ${labelText(42, 122.5, 30, '#ffedcf')}
      <path d="M42 62v-8" stroke="${ink}" stroke-width="1.8" stroke-linecap="round"/>
      ${lit ? flameSVG(42, 54, 0.85) : ''}
      <ellipse cx="86" cy="146" rx="16" ry="5" fill="#CDB394"/>
      <rect x="70" y="134" width="32" height="12" fill="#E6D2B8"/>
      <ellipse cx="86" cy="134" rx="16" ry="5" fill="#FFF6E8" stroke="#D3BC9F"/>
      <path d="M86 134v-5" stroke="${ink}" stroke-width="1.4" stroke-linecap="round"/>
      ${lit ? flameSVG(86, 129, 0.5) : ''}
    </svg>`;
  }
  if (type === 'oil') {
    return `<svg class="tn-art" viewBox="0 0 120 160" aria-hidden="true">
      ${shadow(40)}
      <g stroke="#8A5A3C" stroke-width="2" stroke-linecap="round">
        <path d="M58 72L40 16"/><path d="M60 72L54 10"/><path d="M62 72L68 12"/><path d="M64 72L82 20"/>
      </g>
      <circle class="tn-mist" cx="40" cy="14" r="3" fill="#fff" style="animation-delay:0s"/>
      <circle class="tn-mist" cx="68" cy="9" r="2.5" fill="#fff" style="animation-delay:1.2s"/>
      <circle class="tn-mist" cx="82" cy="18" r="2" fill="#fff" style="animation-delay:2.3s"/>
      <path d="M46 72h28v8c10 4 16 12 16 24v32c0 8-6 14-14 14H44c-8 0-14-6-14-14v-32c0-12 6-20 16-24z" fill="rgba(255,255,255,.5)" stroke="rgba(75,50,36,.3)" stroke-width="1.5"/>
      <path d="M31 116h58v20c0 7-5 12-12 12H43c-7 0-12-5-12-12z" fill="rgba(146,82,59,.32)"/>
      <rect x="46" y="64" width="28" height="11" rx="2.5" fill="${ink}"/>
      <rect x="40" y="95" width="40" height="36" rx="4" fill="#fff" stroke="rgba(146,82,59,.25)"/>
      ${labelMark(60, 99, 17)}
      ${labelText(60, 121.5, 30)}
      <path d="M34 96v34" stroke="rgba(255,255,255,.75)" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }
  if (type === 'gift') {
    return `<svg class="tn-art" viewBox="0 0 120 160" aria-hidden="true">
      ${shadow(46)}
      <path class="tn-twinkle" d="M96 34l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#fff" style="animation-delay:.4s"/>
      <path class="tn-twinkle" d="M24 46l1.5 4.5 4.5 1.5-4.5 1.5L24 58l-1.5-4.5L18 52l4.5-1.5z" fill="#fff" style="animation-delay:1.3s"/>
      <rect x="20" y="78" width="80" height="70" rx="6" fill="#ffedcf" stroke="rgba(75,50,36,.2)"/>
      <rect x="16" y="64" width="88" height="18" rx="5" fill="#F4D7AE" stroke="rgba(75,50,36,.2)"/>
      <rect x="54" y="64" width="12" height="84" fill="${brand}"/>
      <path d="M60 64c-6-15-27-17-25-4 1 7 15 6 25 4z" fill="#935035"/>
      <path d="M60 64c6-15 27-17 25-4-1 7-15 6-25 4z" fill="#935035"/>
      <circle cx="60" cy="64" r="4.5" fill="${ink}"/>
      <rect x="25" y="94" width="25" height="32" rx="3" fill="#fff" stroke="rgba(146,82,59,.25)"/>
      ${labelMark(37.5, 98, 14)}
      ${labelText(37.5, 116.5, 19)}
      <rect x="72" y="100" width="20" height="30" rx="4" fill="#FFF6E8" stroke="rgba(75,50,36,.18)"/>
      <path d="M82 100v-5" stroke="${ink}" stroke-width="1.3" stroke-linecap="round"/>
      ${lit ? flameSVG(82, 95, 0.42) : ''}
    </svg>`;
  }
  /* mặc định: nến hũ thủy tinh */
  return `<svg class="tn-art" viewBox="0 0 120 160" aria-hidden="true">
    ${shadow(42)}
    <rect x="24" y="58" width="72" height="92" rx="12" fill="rgba(255,255,255,.42)" stroke="rgba(75,50,36,.28)" stroke-width="1.5"/>
    <rect x="29" y="68" width="62" height="76" rx="8" fill="#FFF6E8"/>
    <ellipse cx="60" cy="68" rx="31" ry="4" fill="#F9E3C6"/>
    <path d="M60 68v-9" stroke="${ink}" stroke-width="1.8" stroke-linecap="round"/>
    ${lit ? flameSVG(60, 59, 0.9) : ''}
    <rect x="36" y="90" width="48" height="42" rx="4" fill="#fff" stroke="rgba(146,82,59,.25)"/>
    ${labelMark(60, 94, 20)}
    ${labelText(60, 119, 38)}
    <path d="M28 66v74" stroke="rgba(255,255,255,.75)" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

/* ảnh thật (nếu có) ưu tiên hơn hình minh họa */
const productArtType = (p) => getCategory(p?.category)?.art || p?.art || 'jar';
const productImage = (p) => mediaURL(p?.image);

/* thumbnail chung: blob nền + minh họa + (ảnh thật phủ lên nếu có) */
function thumbHTML(p, opts = {}) {
  const src = opts.noPhoto ? '' : productImage(p);
  const seed = (Number(p?.palette) || 0) + seedOf(p?.id) * 0.13;
  return `${blobsHTML(seed)}
    <div class="tn-art-wrap">${artSVG(opts.art || productArtType(p), opts)}</div>
    ${src ? `<img class="tn-photo" src="${escapeHTML(src)}" alt="${escapeHTML(L(p, 'name'))}" loading="lazy" onerror="this.remove()">` : ''}`;
}

/* media chung (ảnh hoặc video) cho các khối trang chủ / blog */
function mediaHTML(ref, { cls = '', alt = '', autoplay = true, poster = '' } = {}) {
  const url = mediaURL(ref);
  if (!url) return '';
  if (isVideoRef(ref)) {
    return `<video class="${cls}" src="${escapeHTML(url)}" ${poster ? `poster="${escapeHTML(mediaURL(poster))}"` : ''} ${autoplay ? 'autoplay muted loop playsinline' : 'controls playsinline'} preload="metadata"></video>`;
  }
  return `<img class="${cls}" src="${escapeHTML(url)}" alt="${escapeHTML(alt)}" loading="lazy">`;
}

/* nội dung bài viết: đoạn văn, "## tiêu đề", "- gạch đầu dòng" */
function richText(src) {
  const blocks = String(src || '').replace(/\r/g, '').split(/\n{2,}/);
  return blocks.map(b => {
    b = b.trim();
    if (!b) return '';
    if (b.startsWith('## ')) return `<h2>${escapeHTML(b.slice(3))}</h2>`;
    if (b.startsWith('### ')) return `<h3>${escapeHTML(b.slice(4))}</h3>`;
    const lines = b.split('\n');
    if (lines.every(l => /^[-*] /.test(l.trim()))) return `<ul>${lines.map(l => `<li>${inlineFmt(l.trim().slice(2))}</li>`).join('')}</ul>`;
    return `<p>${lines.map(inlineFmt).join('<br>')}</p>`;
  }).join('');
}
const inlineFmt = (s) => escapeHTML(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const readingTime = (s) => Math.max(1, Math.round(String(s || '').split(/\s+/).length / 200));
