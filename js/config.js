/* TRAM NEN · config.js
   Hằng số kỹ thuật. Thông tin shop (tên, liên hệ, mạng xã hội, phí ship…)
   được chỉnh trực tiếp trong trang Quản trị → Thông tin shop. */

const MAX_ADMINS = 3;                       /* tối đa 3 tài khoản quản trị */
const MEDIA_LIMIT_IMAGE = 50 * 1024 * 1024; /* ảnh gốc tối đa 50MB (sẽ được tự tối ưu) */
const IMAGE_MAX_SIDE = 2560;                 /* cạnh dài tối đa sau tối ưu */
const MEDIA_LIMIT_VIDEO = 300 * 1024 * 1024;/* video tối đa 300MB */
const DEFAULT_VARIANTS = ['100g', '200g', '300g'];
