# TRAM NEN — Website nến thơm

> *Dừng một chút, thơm một chút.* · *Pause a little, scent a little.*

Website bán nến thơm TRAM NEN, song ngữ Tiếng Việt / English. Viết bằng HTML + CSS + JavaScript thuần,
**không cần build, không có backend**. Dữ liệu nằm trong `localStorage`, ảnh/video tải lên nằm trong `IndexedDB`.

## Cách chạy

Mở `index.html` bằng Chrome/Edge, hoặc chạy static server (khuyên dùng):

```bash
python -m http.server 8123
# mở http://127.0.0.1:8123/index.html
```

## Đăng nhập quản trị

Bấm **“Quản trị”** ở cuối chân trang, hoặc vào `#/admin`.

- Tài khoản demo: `admin@tramnen.vn` / `demo1234`
- Tối đa **3 tài khoản quản trị**. Muốn thêm người thứ 4, hãy xóa một tài khoản trong mục *Quản trị viên* trước.
- Khách hàng không cần đăng nhập. Khách đặt hàng trực tiếp, sau đó tra cứu đơn bằng **mã đơn + số điện thoại**.

## Chức năng trong trang quản trị

| Mục | Làm được gì |
|---|---|
| Tổng quan | Doanh thu, đơn chờ, hàng sắp hết, lối tắt |
| Sản phẩm | Thêm/sửa/ẩn/xóa. Mỗi sản phẩm có phân loại **100g / 200g / 300g** với giá và tồn kho riêng (thêm/bớt được). Có % giảm giá, đánh dấu “Được yêu thích”, tên/mô tả song ngữ, ảnh lớn |
| Danh mục | Thêm/sửa/xóa danh mục, chọn kiểu hình minh họa, ảnh danh mục |
| Đơn hàng | Lọc theo trạng thái, tìm theo mã/tên/SĐT, chuyển trạng thái, hủy, **xóa đơn**, xem chi tiết |
| Mã giảm giá | Tự đặt **mã** và **% giảm**, giới hạn lượt dùng, ngày hết hạn, bật/tắt, công khai ở trang Sale |
| Blog | Viết/sửa/xóa bài (song ngữ), ảnh/video bìa, lưu nháp |
| Trang chủ | Ảnh cho carousel, chữ chạy, cụm từ gõ máy, ảnh/video giới thiệu, video, thư viện ảnh & video |
| Thành viên | Thêm/sửa/xóa thành viên, ảnh chân dung |
| Thông tin shop | Tên, slogan, câu chuyện, logo tùy chỉnh, địa chỉ, SĐT, email, giờ mở cửa, **mạng xã hội** (Facebook, Instagram, TikTok, YouTube, Messenger, Zalo, Shopee), phí ship, chính sách |
| Hộp thư | Tin nhắn khách gửi từ trang Liên hệ |
| Quản trị viên | Đăng ký thêm admin (tối đa 3), xóa admin, đổi mật khẩu |

### Ảnh & video dung lượng lớn

- Ảnh tối đa **50MB**, video tối đa **300MB**.
- Ảnh lớn được **tự tối ưu**: thu về cạnh dài 2560px, chuyển sang WebP. Ảnh vẫn nét nhưng web tải nhanh.
- File được lưu trong **IndexedDB của trình duyệt đang dùng**. Muốn ảnh hiển thị trên mọi máy sau khi đưa web lên hosting, chép ảnh vào `img/…` rồi dán đường dẫn (vd. `img/products/go-thong.jpg`) vào ô “hoặc đường dẫn” cạnh nút Tải file lên.

## Sơ đồ trang (khách)

```
TRAM NEN (#/)
├── Trang chủ (/)         carousel trụ xoay → chữ chạy → giới thiệu (gõ máy, đếm số) → danh mục
│                         → sản phẩm yêu thích → video → banner Sale → thư viện ảnh → blog
├── Về Trạm (/about)
├── Sản phẩm (/shop)      lọc: từ khóa, danh mục, nhóm hương, khoảng giá, đang sale
│   │                     sắp xếp: bán chạy, mới nhất, giá ↑↓, tên A→Z / Z→A
│   └── Chi tiết (/product/:id)   chọn 100g/200g/300g, thắp thử, đánh giá
├── Sale (/sale)          mã giảm giá công khai + sản phẩm giảm giá
├── Blog (/blog) → Bài viết (/blog/:slug)
├── Thành viên (/members)
├── Liên hệ (/contact)    thông tin, mạng xã hội, form lời nhắn
├── Tìm kiếm (/search?q=) khớp bất kỳ từ khóa nào, không phân biệt dấu
├── Giỏ hàng (/cart)      mã giảm giá → đặt hàng → thành công
├── Tra cứu đơn (/track)
└── Chính sách (/policy)
```

## Cấu trúc thư mục

```
index.html
img/logo.png                  logo gốc (favicon, ảnh chia sẻ)
img/products/                 nơi đặt ảnh sản phẩm thật
css/  base · hero · components · pages · admin · responsive
js/
  config.js                   giới hạn file, số admin tối đa, phân loại mặc định
  logo.js                     logo vector (trace từ img/logo.png)
  i18n.js                     từ điển Việt / Anh, t() và L()
  utils.js                    định dạng, icon, cờ, hình minh họa sản phẩm
  media.js                    kho ảnh/video IndexedDB + tối ưu ảnh
  store.js · seed.js          dữ liệu & dữ liệu mẫu
  router.js · shell.js        định tuyến, header/footer, tìm kiếm, hiệu ứng cuộn
  pages/                      home, shop (+sale, search), product, blog, info, cart
  admin/                      core, products, orders, content, settings
  modals.js · actions.js · boot.js
```

## Lưu ý

- Bản demo: thanh toán và chuyển khoản chỉ được **mô phỏng**; mật khẩu admin lưu dạng văn bản thường.
- Tên, giá, mô tả sản phẩm, liên hệ (SĐT `0900 000 000`, email `hello@tramnen.vn`), link mạng xã hội, chính sách và tên thành viên đều là **dữ liệu mẫu**. Sửa chúng trong trang Quản trị.
- Nút **“Khôi phục dữ liệu demo”** nằm ở *Thông tin shop → Dữ liệu & bộ nhớ*.
