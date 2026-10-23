/* TRAM NEN · i18n.js
   Song ngữ Tiếng Việt / English. Chọn bằng icon lá cờ trên header/footer.
   - t('khoa', {bien}) : văn bản giao diện
   - L(obj, 'truong')   : dữ liệu có bản tiếng Anh ở trường 'truong_en' (rỗng thì dùng tiếng Việt) */

const LANG_KEY = 'tn2_lang';
const getLang = () => (localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'vi');

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang === 'en' ? 'en' : 'vi');
  document.documentElement.lang = getLang();
  const layer = $('#search-layer');
  if (layer) layer.outerHTML = searchLayerHTML();
  route();
}

function L(obj, field) {
  if (!obj) return '';
  if (getLang() === 'en') {
    const en = obj[field + '_en'];
    if (en && String(en).trim()) return en;
  }
  return obj[field] ?? '';
}

function t(key, vars) {
  const dict = I18N[getLang()] || I18N.vi;
  let s = dict[key] ?? I18N.vi[key];
  if (s === undefined) { console.warn('[i18n] missing key:', key); return key; }
  if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
  return s;
}

const I18N = {
  vi: {
    'nav.home': 'Trang chủ', 'nav.about': 'Về Trạm', 'nav.products': 'Sản phẩm', 'nav.sale': 'Sale',
    'nav.blog': 'Blog', 'nav.members': 'Thành viên', 'nav.contact': 'Liên hệ', 'nav.cart': 'Giỏ hàng',
    'nav.menu': 'Mở menu', 'nav.main': 'Điều hướng chính', 'lang.label': 'Chọn ngôn ngữ',

    'common.close': 'Đóng', 'common.back': 'Quay lại', 'common.viewAll': 'Xem tất cả',
    'common.readMore': 'Đọc tiếp', 'common.from': 'Từ',
    'time.now': 'vừa xong', 'time.min': '{n} phút trước', 'time.hour': '{n} giờ trước', 'time.day': '{n} ngày trước',

    'search.open': 'Tìm kiếm', 'search.placeholder': 'Bạn đang tìm mùi hương gì? (vd: vani, gỗ thông, quà tặng…)',
    'search.placeholderShort': 'Tên, mùi hương…', 'search.popular': 'Tìm nhiều', 'search.found': 'Tìm thấy {n} sản phẩm',
    'search.viewAll': 'Xem tất cả {n} kết quả', 'search.none': 'Không có sản phẩm nào khớp với “{q}”',
    'search.title': 'Tìm kiếm', 'search.resultsFor': 'Kết quả cho “{q}”', 'search.go': 'Tìm',
    'search.hint': 'Nhập bất kỳ từ khóa nào: tên sản phẩm, mùi hương, danh mục, khối lượng…',
    'search.tryOther': 'Thử một từ khóa khác hoặc xem toàn bộ sản phẩm.',

    'home.note1': 'Thắp lên<br>là thư thái', 'home.note2': 'Thơm<br>cả nhà',
    'home.ctaShop': 'Khám phá sản phẩm', 'home.ctaAbout': 'Câu chuyện của Trạm', 'home.scroll': 'Cuộn xuống',
    'home.since': 'Trạm nhỏ của mùi hương', 'home.lightUp': 'Thắp lên', 'home.readStory': 'Đọc câu chuyện',
    'home.statProducts': 'sản phẩm', 'home.statScents': 'nhóm hương', 'home.statSold': 'lượt mua',
    'home.catEyebrow': 'Danh mục', 'home.catTitle': 'Chọn theo dòng sản phẩm', 'home.catCount': '{n} sản phẩm',
    'home.favEyebrow': 'Được yêu thích', 'home.favTitle': 'Khách hàng yêu thích tại Trạm',
    'home.playVideo': 'Phát video', 'home.saleTitle': 'Ưu đãi đang diễn ra',
    'home.saleText': '{n} sản phẩm đang giảm giá — dùng thêm mã bên dưới khi thanh toán.',
    'home.saleTextCodes': 'Nhập mã bên dưới ở giỏ hàng để được giảm giá.', 'home.saleCta': 'Xem tất cả ưu đãi',
    'home.galleryEyebrow': 'Khoảnh khắc', 'home.blogTitle': 'Câu chuyện & mẹo dùng nến',

    'shop.title': 'Tất cả sản phẩm', 'shop.subtitle': '{n} sản phẩm — nến hũ, tealight, sáp thơm, tinh dầu và set quà.',
    'shop.filters': 'Bộ lọc', 'shop.reset': 'Xóa bộ lọc', 'shop.keyword': 'Từ khóa', 'shop.category': 'Danh mục',
    'shop.scent': 'Nhóm hương', 'shop.price': 'Khoảng giá', 'shop.all': 'Tất cả', 'shop.allScents': 'Mọi nhóm hương',
    'shop.under': 'Dưới {v}', 'shop.over': 'Trên {v}', 'shop.min': 'Từ', 'shop.max': 'Đến', 'shop.apply': 'Áp dụng',
    'shop.saleOnly': 'Chỉ sản phẩm đang sale', 'shop.showing': '{n} sản phẩm', 'shop.forQuery': 'cho “{q}”',
    'shop.sortBy': 'Sắp xếp', 'shop.sortBest': 'Bán chạy nhất', 'shop.sortNew': 'Mới nhất',
    'shop.sortPriceAsc': 'Giá: thấp → cao', 'shop.sortPriceDesc': 'Giá: cao → thấp',
    'shop.sortNameAsc': 'Tên: A → Z', 'shop.sortNameDesc': 'Tên: Z → A',
    'shop.emptyTitle': 'Không tìm thấy sản phẩm phù hợp', 'shop.emptyText': 'Thử từ khóa khác hoặc bỏ bớt bộ lọc nhé.',

    'product.soldOut': 'Hết hàng', 'product.quickView': 'Xem nhanh', 'product.choose': 'Chọn mua',
    'product.sold': 'Đã bán {n}', 'product.tryLight': 'Thắp thử', 'product.lookClose': 'Xem gần', 'product.lighting': 'Đang thắp thử',
    'product.reviewCount': '{n} đánh giá', 'product.noReviews': 'Chưa có đánh giá', 'product.variant': 'Phân loại',
    'product.notes': 'Tháp hương', 'product.top': 'Hương đầu', 'product.mid': 'Hương giữa', 'product.base': 'Hương cuối',
    'product.scentFamily': 'Nhóm hương', 'product.detail': 'Chi tiết', 'product.stock': 'Tình trạng',
    'product.inStock': 'Còn {n} sản phẩm', 'product.addToCart': 'Thêm vào giỏ', 'product.buyNow': 'Mua ngay',
    'product.details': 'Chi tiết', 'product.perkShip': 'Miễn phí giao hàng cho đơn từ {v}',
    'product.perkGift': 'Có thể ghi chú gói quà khi đặt hàng', 'product.reviewsTitle': 'Đánh giá từ khách hàng',
    'product.noReviewsYet': 'Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận!',
    'product.writeReview': 'Viết đánh giá', 'product.rating': 'Số sao', 'product.yourReview': 'Cảm nhận của bạn',
    'product.reviewPh': 'Mùi hương, độ tỏa hương, thời gian đốt, bao bì…', 'product.submitReview': 'Gửi đánh giá',
    'product.thanksReview': 'Cảm ơn bạn đã đánh giá!', 'product.related': 'Có thể bạn cũng thích',

    'cart.title': 'Giỏ hàng của bạn', 'cart.count': '{n} sản phẩm', 'cart.qty': 'Số lượng', 'cart.remove': 'Bỏ',
    'cart.removed': 'Đã xóa khỏi giỏ', 'cart.added': 'Đã thêm “{name}” vào giỏ', 'cart.summary': 'Tóm tắt đơn hàng',
    'cart.moreForFree': 'Mua thêm <b>{v}</b> để được <b>miễn phí giao hàng</b>', 'cart.freeShip': '🎉 Đơn hàng được <b>miễn phí giao hàng</b>',
    'cart.codePh': 'Nhập mã giảm giá', 'cart.subtotal': 'Tạm tính', 'cart.discount': 'Giảm giá', 'cart.shipping': 'Phí giao hàng',
    'cart.free': 'Miễn phí', 'cart.total': 'Tổng cộng', 'cart.checkout': 'Đặt hàng', 'cart.continue': 'Tiếp tục mua sắm',
    'cart.demoNote': 'Bản demo: đặt hàng và thanh toán chỉ được mô phỏng, không có giao dịch thật.',
    'cart.emptyTitle': 'Giỏ hàng đang trống', 'cart.emptyText': 'Ngọn nến này đang chờ bạn chọn mùi hương để thắp lên.',

    'code.empty': 'Vui lòng nhập mã', 'code.invalid': 'Mã giảm giá không tồn tại', 'code.inactive': 'Mã này hiện không áp dụng',
    'code.expired': 'Mã đã hết hạn', 'code.used': 'Mã đã hết lượt sử dụng', 'code.applied': 'Đã áp dụng mã {c} (−{p}%)',

    'checkout.title': 'Thông tin giao hàng', 'checkout.emailPh': 'Không bắt buộc', 'checkout.address': 'Địa chỉ giao hàng',
    'checkout.addressPh': 'Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành', 'checkout.note': 'Ghi chú',
    'checkout.notePh': 'vd: Gói quà giúp mình, giao giờ hành chính…', 'checkout.payment': 'Phương thức thanh toán',
    'checkout.place': 'Đặt hàng', 'checkout.processing': 'Đang xử lý…', 'checkout.successTitle': 'Đặt hàng thành công!',
    'checkout.successText': 'Mã đơn của bạn là {code}. Shop sẽ sớm gọi số {phone} để xác nhận.',
    'pay.cod': 'Thanh toán khi nhận hàng', 'pay.codHint': 'Trả tiền mặt cho shipper', 'pay.bank': 'Chuyển khoản',
    'pay.bankHint': 'Mô phỏng — không chuyển tiền thật',

    'form.name': 'Họ và tên', 'form.phone': 'Số điện thoại',
    'err.storage': 'Bộ nhớ trình duyệt đã đầy', 'err.unavailable': 'Sản phẩm không còn được bán',
    'err.outOfStock': 'Phân loại này tạm hết hàng', 'err.onlyLeft': 'Chỉ còn {n} sản phẩm', 'err.generic': 'Đã có lỗi xảy ra',
    'err.email': 'Email không hợp lệ', 'err.phone': 'Số điện thoại không hợp lệ', 'err.nameAddress': 'Vui lòng nhập họ tên và địa chỉ',
    'err.pickStars': 'Vui lòng chọn số sao', 'err.fillReview': 'Vui lòng nhập tên và cảm nhận', 'err.fillAll': 'Vui lòng điền đủ thông tin',

    'sale.title': 'Ưu đãi tại Trạm', 'sale.subtitle': 'Sản phẩm đang giảm giá và mã ưu đãi dùng được ngay hôm nay.',
    'sale.codesTitle': 'Mã giảm giá', 'sale.off': 'giảm', 'sale.until': 'Hạn đến {d}', 'sale.copy': 'Sao chép mã',
    'sale.copied': 'Đã sao chép mã {c}', 'sale.productsTitle': 'Sản phẩm đang giảm giá', 'sale.none': 'Hiện chưa có sản phẩm giảm giá. Bạn vẫn có thể dùng mã ưu đãi ở trên!',

    'blog.title': 'Blog TRAM NEN', 'blog.subtitle': 'Mẹo dùng nến, cách chọn mùi hương và những câu chuyện nhỏ.',
    'blog.minRead': '{n} phút đọc', 'blog.empty': 'Chưa có bài viết.', 'blog.by': 'Viết bởi', 'blog.share': 'Chia sẻ',
    'blog.copyLink': 'Sao chép liên kết', 'blog.linkCopied': 'Đã sao chép liên kết', 'blog.back': 'Tất cả bài viết',
    'blog.related': 'Bài viết khác', 'blog.draft': 'Bản nháp — chỉ quản trị viên nhìn thấy.',

    'members.title': 'Những người thắp nến', 'members.subtitle': 'Gặp gỡ đội ngũ đứng sau mỗi sản phẩm của TRAM NEN.',
    'members.empty': 'Thông tin thành viên đang được cập nhật.',

    'about.storyEyebrow': 'Câu chuyện', 'about.logoTitle': 'Ý nghĩa logo',
    'about.logoText': 'Ngọn lửa ôm lấy một cánh cửa vòm — lối vào “trạm dừng chân”. Mỗi lần thắp nến là một lần mở cửa bước vào khoảng thời gian của riêng mình.',
    'about.palette': 'Bảng màu thương hiệu', 'about.valuesEyebrow': 'Điều Trạm theo đuổi', 'about.valuesTitle': 'Nhỏ, dịu và chỉn chu',
    'about.v1t': 'Mùi hương dịu nhẹ', 'about.v1d': 'Chọn những mùi hương dễ chịu, dùng hằng ngày không bị nồng.',
    'about.v2t': 'Gói ghém chỉn chu', 'about.v2d': 'Mỗi đơn hàng được đóng gói cẩn thận như một món quà nhỏ.',
    'about.v3t': 'Món quà tinh tế', 'about.v3d': 'Set quà và thiệp viết tay cho những dịp cần một lời yêu thương.',
    'about.tipsEyebrow': 'Mẹo nhỏ', 'about.tipsTitle': 'Dùng nến đúng cách',
    'about.tip1t': 'Lần đốt đầu tiên', 'about.tip1d': 'Để nến cháy đến khi lớp sáp tan đều sát thành hũ (khoảng 2–3 giờ) để nến không bị “đào hầm”.',
    'about.tip2t': 'Cắt bấc trước khi thắp', 'about.tip2d': 'Giữ bấc dài khoảng 5mm để lửa ổn định, ít khói đen.',
    'about.tip3t': 'Không đốt quá lâu', 'about.tip3d': 'Mỗi lần đốt tối đa khoảng 4 giờ, để nguội rồi mới thắp lại.',
    'about.tip4t': 'An toàn là trên hết', 'about.tip4d': 'Đặt nến trên bề mặt chịu nhiệt, xa rèm, trẻ nhỏ và thú cưng.',
    'about.ctaTitle': 'Tìm mùi hương của riêng bạn', 'about.ctaText': 'Ghé cửa hàng hoặc nhắn cho Trạm để được tư vấn.',

    'contact.title': 'Liên hệ với Trạm', 'contact.subtitle': 'Hỏi về sản phẩm, đặt quà số lượng lớn hay chỉ đơn giản là chào nhau.',
    'contact.address': 'Địa chỉ', 'contact.phone': 'Điện thoại', 'contact.hours': 'Giờ mở cửa', 'contact.map': 'Xem bản đồ',
    'contact.call': 'Gọi ngay', 'contact.write': 'Gửi email', 'contact.follow': 'Theo dõi TRAM NEN',
    'contact.formTitle': 'Gửi lời nhắn', 'contact.formText': 'Trạm sẽ phản hồi bạn sớm nhất có thể.',
    'contact.phoneOrEmail': 'Số điện thoại hoặc email', 'contact.message': 'Lời nhắn', 'contact.send': 'Gửi lời nhắn',
    'contact.sent': 'Đã gửi lời nhắn — cảm ơn bạn!',

    'track.subtitle': 'Nhập mã đơn và số điện thoại đã dùng khi đặt hàng.', 'track.code': 'Mã đơn hàng', 'track.go': 'Tra cứu',
    'track.order': 'Đơn', 'track.notFound': 'Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và số điện thoại.',
    'track.teaser': 'Xem trạng thái đơn hàng của bạn',
    'status.pending': 'Chờ xác nhận', 'status.confirmed': 'Đã xác nhận', 'status.shipping': 'Đang giao',
    'status.done': 'Hoàn tất', 'status.cancelled': 'Đã hủy',

    'policy.title': 'Chính sách', 'policy.shipping': 'Chính sách giao hàng', 'policy.return': 'Chính sách đổi trả',
    'policy.privacy': 'Chính sách bảo mật',

    'footer.newsTitle': 'Nhận thư từ Trạm', 'footer.newsText': 'Ưu đãi, sản phẩm mới và mẹo dùng nến — không spam.',
    'footer.newsPlaceholder': 'Email của bạn', 'footer.subscribe': 'Đăng ký', 'footer.subscribed': 'Cảm ơn bạn đã đăng ký nhận tin!',
    'footer.shop': 'Sản phẩm', 'footer.company': 'TRAM NEN', 'footer.help': 'Hỗ trợ', 'footer.contact': 'Liên hệ',
    'footer.track': 'Tra cứu đơn hàng', 'footer.rights': 'Bảo lưu mọi quyền.', 'footer.payments': 'Phương thức thanh toán',
    'footer.admin': 'Quản trị', 'footer.top': 'Lên đầu trang',

    'nf.title': 'Ngọn nến này chưa được thắp', 'nf.text': 'Trang bạn tìm không tồn tại hoặc đã được dời đi.'
  },

  en: {
    'nav.home': 'Home', 'nav.about': 'About', 'nav.products': 'Products', 'nav.sale': 'Sale',
    'nav.blog': 'Blog', 'nav.members': 'Team', 'nav.contact': 'Contact', 'nav.cart': 'Cart',
    'nav.menu': 'Open menu', 'nav.main': 'Main navigation', 'lang.label': 'Choose language',

    'common.close': 'Close', 'common.back': 'Back', 'common.viewAll': 'View all',
    'common.readMore': 'Read more', 'common.from': 'From',
    'time.now': 'just now', 'time.min': '{n} min ago', 'time.hour': '{n} h ago', 'time.day': '{n} days ago',

    'search.open': 'Search', 'search.placeholder': 'What scent are you looking for? (e.g. vanilla, pine, gift…)',
    'search.placeholderShort': 'Name, scent…', 'search.popular': 'Popular searches', 'search.found': '{n} products found',
    'search.viewAll': 'View all {n} results', 'search.none': 'No products match “{q}”',
    'search.title': 'Search', 'search.resultsFor': 'Results for “{q}”', 'search.go': 'Search',
    'search.hint': 'Type any keyword: product name, scent, category, size…',
    'search.tryOther': 'Try another keyword or browse all products.',

    'home.note1': 'Light it,<br>slow down', 'home.note2': 'Scent the<br>whole home',
    'home.ctaShop': 'Explore products', 'home.ctaAbout': 'Our story', 'home.scroll': 'Scroll down',
    'home.since': 'A little scent station', 'home.lightUp': 'Light up', 'home.readStory': 'Read our story',
    'home.statProducts': 'products', 'home.statScents': 'scent families', 'home.statSold': 'items sold',
    'home.catEyebrow': 'Categories', 'home.catTitle': 'Shop by collection', 'home.catCount': '{n} products',
    'home.favEyebrow': 'Customer favourites', 'home.favTitle': 'Most loved at TRAM NEN',
    'home.playVideo': 'Play video', 'home.saleTitle': 'Offers right now',
    'home.saleText': '{n} products are on sale — stack a code below at checkout.',
    'home.saleTextCodes': 'Enter a code below in your cart to save.', 'home.saleCta': 'See all offers',
    'home.galleryEyebrow': 'Moments', 'home.blogTitle': 'Stories & candle tips',

    'shop.title': 'All products', 'shop.subtitle': '{n} products — jar candles, tealights, wax melts, oils and gift sets.',
    'shop.filters': 'Filters', 'shop.reset': 'Clear filters', 'shop.keyword': 'Keyword', 'shop.category': 'Category',
    'shop.scent': 'Scent family', 'shop.price': 'Price range', 'shop.all': 'All', 'shop.allScents': 'All scents',
    'shop.under': 'Under {v}', 'shop.over': 'Over {v}', 'shop.min': 'Min', 'shop.max': 'Max', 'shop.apply': 'Apply',
    'shop.saleOnly': 'On sale only', 'shop.showing': '{n} products', 'shop.forQuery': 'for “{q}”',
    'shop.sortBy': 'Sort by', 'shop.sortBest': 'Best selling', 'shop.sortNew': 'Newest',
    'shop.sortPriceAsc': 'Price: low → high', 'shop.sortPriceDesc': 'Price: high → low',
    'shop.sortNameAsc': 'Name: A → Z', 'shop.sortNameDesc': 'Name: Z → A',
    'shop.emptyTitle': 'No matching products', 'shop.emptyText': 'Try another keyword or remove some filters.',

    'product.soldOut': 'Sold out', 'product.quickView': 'Quick view', 'product.choose': 'Choose',
    'product.sold': '{n} sold', 'product.tryLight': 'Light it up', 'product.lookClose': 'Closer look', 'product.lighting': 'Lit preview',
    'product.reviewCount': '{n} reviews', 'product.noReviews': 'No reviews yet', 'product.variant': 'Size',
    'product.notes': 'Scent pyramid', 'product.top': 'Top notes', 'product.mid': 'Heart notes', 'product.base': 'Base notes',
    'product.scentFamily': 'Scent family', 'product.detail': 'Details', 'product.stock': 'Availability',
    'product.inStock': '{n} in stock', 'product.addToCart': 'Add to cart', 'product.buyNow': 'Buy now',
    'product.details': 'Details', 'product.perkShip': 'Free shipping on orders from {v}',
    'product.perkGift': 'Add a gift-wrap note at checkout', 'product.reviewsTitle': 'Customer reviews',
    'product.noReviewsYet': 'No reviews yet. Be the first to share your thoughts!',
    'product.writeReview': 'Write a review', 'product.rating': 'Rating', 'product.yourReview': 'Your review',
    'product.reviewPh': 'Scent, throw, burn time, packaging…', 'product.submitReview': 'Submit review',
    'product.thanksReview': 'Thank you for your review!', 'product.related': 'You may also like',

    'cart.title': 'Your cart', 'cart.count': '{n} items', 'cart.qty': 'Quantity', 'cart.remove': 'Remove',
    'cart.removed': 'Removed from cart', 'cart.added': 'Added “{name}” to cart', 'cart.summary': 'Order summary',
    'cart.moreForFree': 'Add <b>{v}</b> more for <b>free shipping</b>', 'cart.freeShip': '🎉 Your order ships <b>free</b>',
    'cart.codePh': 'Discount code', 'cart.subtotal': 'Subtotal', 'cart.discount': 'Discount', 'cart.shipping': 'Shipping',
    'cart.free': 'Free', 'cart.total': 'Total', 'cart.checkout': 'Checkout', 'cart.continue': 'Continue shopping',
    'cart.demoNote': 'Demo build: ordering and payment are simulated — no real transaction.',
    'cart.emptyTitle': 'Your cart is empty', 'cart.emptyText': 'This candle is waiting for you to pick a scent.',

    'code.empty': 'Please enter a code', 'code.invalid': 'This code does not exist', 'code.inactive': 'This code is not active',
    'code.expired': 'This code has expired', 'code.used': 'This code has reached its limit', 'code.applied': 'Code {c} applied (−{p}%)',

    'checkout.title': 'Delivery details', 'checkout.emailPh': 'Optional', 'checkout.address': 'Delivery address',
    'checkout.addressPh': 'Street, ward, district, city', 'checkout.note': 'Note',
    'checkout.notePh': 'e.g. Please gift-wrap, office-hours delivery…', 'checkout.payment': 'Payment method',
    'checkout.place': 'Place order', 'checkout.processing': 'Processing…', 'checkout.successTitle': 'Order placed!',
    'checkout.successText': 'Your order number is {code}. We will call {phone} shortly to confirm.',
    'pay.cod': 'Cash on delivery', 'pay.codHint': 'Pay the courier in cash', 'pay.bank': 'Bank transfer',
    'pay.bankHint': 'Simulated — no real transfer',

    'form.name': 'Full name', 'form.phone': 'Phone number',
    'err.storage': 'Browser storage is full', 'err.unavailable': 'This product is no longer available',
    'err.outOfStock': 'This size is out of stock', 'err.onlyLeft': 'Only {n} left', 'err.generic': 'Something went wrong',
    'err.email': 'Invalid email address', 'err.phone': 'Invalid phone number', 'err.nameAddress': 'Please enter your name and address',
    'err.pickStars': 'Please choose a rating', 'err.fillReview': 'Please enter your name and review', 'err.fillAll': 'Please fill in all fields',

    'sale.title': 'Offers at TRAM NEN', 'sale.subtitle': 'Products on sale and codes you can use today.',
    'sale.codesTitle': 'Discount codes', 'sale.off': 'off', 'sale.until': 'Valid until {d}', 'sale.copy': 'Copy code',
    'sale.copied': 'Copied code {c}', 'sale.productsTitle': 'On sale now', 'sale.none': 'No products on sale right now — but the codes above still work!',

    'blog.title': 'The TRAM NEN Journal', 'blog.subtitle': 'Candle care, choosing scents and little stories.',
    'blog.minRead': '{n} min read', 'blog.empty': 'No posts yet.', 'blog.by': 'Written by', 'blog.share': 'Share',
    'blog.copyLink': 'Copy link', 'blog.linkCopied': 'Link copied', 'blog.back': 'All posts',
    'blog.related': 'More stories', 'blog.draft': 'Draft — visible to admins only.',

    'members.title': 'The people behind the flame', 'members.subtitle': 'Meet the team behind every TRAM NEN product.',
    'members.empty': 'Team profiles are coming soon.',

    'about.storyEyebrow': 'Our story', 'about.logoTitle': 'About our logo',
    'about.logoText': 'A flame wraps around an arched door — the entrance to a little resting station. Each time you light a candle, you open the door to a moment of your own.',
    'about.palette': 'Brand colours', 'about.valuesEyebrow': 'What we care about', 'about.valuesTitle': 'Small, gentle and thoughtful',
    'about.v1t': 'Gentle scents', 'about.v1d': 'Pleasant fragrances made for everyday use, never overpowering.',
    'about.v2t': 'Careful packing', 'about.v2d': 'Every order is packed like a little present.',
    'about.v3t': 'Thoughtful gifts', 'about.v3d': 'Gift sets and handwritten cards for moments that need a kind word.',
    'about.tipsEyebrow': 'Little tips', 'about.tipsTitle': 'Candle care',
    'about.tip1t': 'The first burn', 'about.tip1d': 'Let the wax melt fully to the edge (about 2–3 hours) so the candle doesn’t tunnel.',
    'about.tip2t': 'Trim the wick', 'about.tip2d': 'Keep the wick about 5mm long for a steady flame and less soot.',
    'about.tip3t': 'Don’t over-burn', 'about.tip3d': 'Burn for up to about 4 hours, then let it cool before relighting.',
    'about.tip4t': 'Safety first', 'about.tip4d': 'Place on a heat-proof surface, away from curtains, children and pets.',
    'about.ctaTitle': 'Find your own scent', 'about.ctaText': 'Browse the shop or message us for a recommendation.',

    'contact.title': 'Get in touch', 'contact.subtitle': 'Questions, bulk gift orders, or just to say hello.',
    'contact.address': 'Address', 'contact.phone': 'Phone', 'contact.hours': 'Opening hours', 'contact.map': 'View map',
    'contact.call': 'Call us', 'contact.write': 'Send email', 'contact.follow': 'Follow TRAM NEN',
    'contact.formTitle': 'Send a message', 'contact.formText': 'We will get back to you as soon as we can.',
    'contact.phoneOrEmail': 'Phone or email', 'contact.message': 'Message', 'contact.send': 'Send message',
    'contact.sent': 'Message sent — thank you!',

    'track.subtitle': 'Enter your order number and the phone number used at checkout.', 'track.code': 'Order number', 'track.go': 'Track',
    'track.order': 'Order', 'track.notFound': 'Order not found. Please check the order number and phone.',
    'track.teaser': 'Check your order status',
    'status.pending': 'Pending', 'status.confirmed': 'Confirmed', 'status.shipping': 'Shipping',
    'status.done': 'Delivered', 'status.cancelled': 'Cancelled',

    'policy.title': 'Policies', 'policy.shipping': 'Shipping policy', 'policy.return': 'Returns policy',
    'policy.privacy': 'Privacy policy',

    'footer.newsTitle': 'Letters from the station', 'footer.newsText': 'Offers, new scents and candle tips — no spam.',
    'footer.newsPlaceholder': 'Your email', 'footer.subscribe': 'Subscribe', 'footer.subscribed': 'Thanks for subscribing!',
    'footer.shop': 'Shop', 'footer.company': 'TRAM NEN', 'footer.help': 'Help', 'footer.contact': 'Contact',
    'footer.track': 'Track your order', 'footer.rights': 'All rights reserved.', 'footer.payments': 'Payment methods',
    'footer.admin': 'Admin', 'footer.top': 'Back to top',

    'nf.title': 'This candle hasn’t been lit yet', 'nf.text': 'The page you are looking for doesn’t exist or has moved.'
  }
};
