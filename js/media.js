/* TRAM NEN · media.js
   Kho ảnh/video dung lượng lớn bằng IndexedDB (localStorage chỉ chứa ~5MB nên không dùng cho media).
   Tham chiếu media trong dữ liệu có dạng:
     'idb:m_xxx'               → file đã upload, lưu trong IndexedDB của trình duyệt
     'img/products/abc.jpg'    → file đặt sẵn trong thư mục dự án
     'https://…'               → ảnh/video trên mạng */

const MEDIA_DB = 'tramnen-media';
const MEDIA_STORE = 'files';
const mediaCache = new Map();   /* id -> { url, type, name, size } */
let mediaDB = null;

function openMediaDB() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB không khả dụng'));
    const req = indexedDB.open(MEDIA_DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(MEDIA_STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbRequest(mode, fn) {
  return new Promise((resolve, reject) => {
    const tx = mediaDB.transaction(MEDIA_STORE, mode);
    const req = fn(tx.objectStore(MEDIA_STORE));
    tx.oncomplete = () => resolve(req && req.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Bộ nhớ trình duyệt không đủ'));
  });
}

/* nạp toàn bộ media vào bộ nhớ đệm (object URL) trước khi render trang */
async function mediaInit() {
  try {
    mediaDB = await openMediaDB();
    const all = await idbRequest('readonly', s => s.getAll());
    (all || []).forEach(rec => mediaCache.set(rec.id, {
      url: URL.createObjectURL(rec.blob), type: rec.type, name: rec.name, size: rec.size
    }));
  } catch (e) {
    console.warn('Media store unavailable:', e);
  }
}

/* lưu file người dùng chọn → trả về tham chiếu 'idb:...' */
async function saveMedia(file) {
  if (!mediaDB) throw new Error('Trình duyệt không hỗ trợ lưu file (IndexedDB)');
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');
  if (!isVideo && !isImage) throw new Error('Chỉ nhận file ảnh hoặc video');
  const limit = isVideo ? MEDIA_LIMIT_VIDEO : MEDIA_LIMIT_IMAGE;
  if (file.size > limit) throw new Error(`File quá lớn (tối đa ${fmtSize(limit)})`);
  let blob = file;
  if (isImage) blob = await optimizeImage(file);
  const id = 'm_' + uid();
  const type = blob.type || file.type;
  await idbRequest('readwrite', s => s.put({ id, blob, type, name: file.name, size: blob.size, originalSize: file.size, createdAt: now() }));
  mediaCache.set(id, { url: URL.createObjectURL(blob), type, name: file.name, size: blob.size, originalSize: file.size });
  return 'idb:' + id;
}

/* Ảnh lớn (ảnh chụp điện thoại, ảnh thiết kế) được thu nhỏ về cạnh dài tối đa IMAGE_MAX_SIDE
   và nén WebP chất lượng cao — giữ độ nét nhưng trang tải nhanh hơn nhiều. */
async function optimizeImage(file) {
  if (/svg|gif/.test(file.type) || file.size < 600 * 1024) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, IMAGE_MAX_SIDE / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(bmp, 0, 0, w, h);
    bmp.close && bmp.close();
    const toBlob = (type, q) => new Promise(res => canvas.toBlob(res, type, q));
    let out = await toBlob('image/webp', 0.88);
    if (!out || out.type !== 'image/webp') out = await toBlob('image/jpeg', 0.9);
    return out && out.size < file.size ? out : file;
  } catch (e) {
    console.warn('optimizeImage failed', e);
    return file;
  }
}

async function deleteMedia(ref) {
  if (!ref || !String(ref).startsWith('idb:') || !mediaDB) return;
  const id = ref.slice(4);
  const c = mediaCache.get(id);
  if (c) URL.revokeObjectURL(c.url);
  mediaCache.delete(id);
  try { await idbRequest('readwrite', s => s.delete(id)); } catch (e) { console.warn(e); }
}

function mediaURL(ref) {
  if (!ref) return '';
  ref = String(ref);
  if (ref.startsWith('idb:')) return mediaCache.get(ref.slice(4))?.url || '';
  return ref;
}
function mediaInfo(ref) {
  if (!ref || !String(ref).startsWith('idb:')) return null;
  return mediaCache.get(ref.slice(4)) || null;
}
function isVideoRef(ref) {
  const info = mediaInfo(ref);
  if (info) return info.type.startsWith('video/');
  return /\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i.test(String(ref || ''));
}

/* dung lượng đã dùng (để hiển thị trong quản trị) */
function mediaUsage() {
  let total = 0, count = 0;
  mediaCache.forEach(m => { total += m.size || 0; count++; });
  return { total, count };
}
