/* TRAM NEN · seed.js
   Giá trị mặc định + dữ liệu mẫu. Tên, giá, mô tả, liên hệ đều là DỮ LIỆU MINH HỌA —
   chỉnh lại trong trang Quản trị. */

const DEFAULT_SETTINGS = {
  name: 'TRAM NEN',
  slogan: 'Dừng một chút, thơm một chút.',
  slogan_en: 'Pause a little, scent a little.',
  intro: 'Nến thơm, sáp thơm và tinh dầu cho những phút dừng chân giữa ngày bận rộn.',
  intro_en: 'Scented candles, wax melts and oils for the quiet pauses in a busy day.',
  about: 'TRAM NEN là một “trạm” nhỏ trên hành trình mỗi ngày — nơi bạn có thể dừng lại, thắp một ngọn nến và để mùi hương làm dịu đi những bộn bề.\n\nMỗi sản phẩm được chọn mùi hương kỹ lưỡng, đóng gói gọn gàng và gửi đến bạn như một lời nhắc: hãy dành cho mình một chút thời gian.',
  about_en: 'TRAM NEN is a little “station” on your everyday journey — a place to pause, light a candle and let the scent soften the rush.\n\nEvery product is chosen with care, packed neatly and sent to you as a small reminder: keep a moment for yourself.',
  address: 'TP. Hồ Chí Minh, Việt Nam',
  address_en: 'Ho Chi Minh City, Vietnam',
  phone: '0900 000 000',
  email: 'hello@tramnen.vn',
  hours: '08:00 – 21:00, Thứ 2 – Chủ nhật',
  hours_en: '8:00 AM – 9:00 PM, Mon – Sun',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  tiktok: 'https://tiktok.com',
  youtube: '',
  messenger: '',
  zalo: '0900000000',
  shopee: '',
  logo: '',
  shippingFee: 30000,
  freeShipFrom: 500000,
  policyShipping: 'Đơn hàng được xác nhận qua điện thoại trước khi giao. Phí giao hàng hiển thị ở bước đặt hàng; đơn đạt mức miễn phí sẽ không tính phí giao.',
  policyShipping_en: 'Orders are confirmed by phone before shipping. Shipping fees are shown at checkout; orders above the free-shipping threshold ship free.',
  policyReturn: 'Nếu sản phẩm bị vỡ, lỗi hoặc giao nhầm, vui lòng liên hệ shop kèm hình ảnh để được hỗ trợ đổi mới.',
  policyReturn_en: 'If an item arrives broken, faulty or incorrect, please contact us with photos and we will arrange a replacement.',
  policyPrivacy: 'Thông tin bạn cung cấp khi đặt hàng chỉ được dùng để xác nhận và giao đơn hàng, không chia sẻ cho bên thứ ba.',
  policyPrivacy_en: 'Information you provide at checkout is only used to confirm and deliver your order and is never shared with third parties.'
};

const DEFAULT_HOME = {
  carousel: [],            /* ảnh cho các thẻ carousel trụ xoay (tối đa 10) */
  heroBadge: 'Nến thơm · Sáp thơm · Tinh dầu',
  heroBadge_en: 'Candles · Wax melts · Essential oils',
  heroText: 'Những ngọn nến nhỏ mang mùi hương dịu nhẹ về góc riêng của bạn — để sau một ngày dài, ta có một trạm dừng chân thật thơm.',
  heroText_en: 'Small candles that bring a gentle scent to your own corner — so after a long day, there is always a fragrant place to pause.',
  marquee: 'Nến thơm, Sáp thơm, Tinh dầu, Quà tặng, Dừng một chút, Thơm một chút',
  marquee_en: 'Scented candles, Wax melts, Essential oils, Gifts, Pause a little, Scent a little',
  rotating: 'chút bình yên, góc thư thái, hơi ấm cuối ngày, một lời yêu thương',
  rotating_en: 'a little calm, a cosy corner, evening warmth, a word of love',
  introTitle: 'Một trạm dừng nhỏ giữa ngày dài',
  introTitle_en: 'A small station in a long day',
  introText: 'TRAM NEN ra đời từ mong muốn giản dị: mỗi ngày, ai cũng nên có vài phút để chậm lại. Thắp một ngọn nến, hít một hơi thật sâu — và để mùi hương làm phần còn lại.',
  introText_en: 'TRAM NEN began with a simple wish: everyone deserves a few slow minutes each day. Light a candle, take a deep breath — and let the scent do the rest.',
  introMedia: '',
  videoTitle: 'Khoảnh khắc thắp nến',
  videoTitle_en: 'The moment we light up',
  videoText: 'Ánh lửa nhỏ, mùi hương lan tỏa và căn phòng bỗng dịu lại.',
  videoText_en: 'A small flame, a spreading scent, and the room softens.',
  video: '',
  videoPoster: '',
  gallery: [],
  galleryTitle: 'Góc nhỏ của TRAM NEN',
  galleryTitle_en: 'Little corners of TRAM NEN'
};

function seed() {
  if (store.get(KEYS.seeded, false)) return;
  const t0 = now();

  store.saveAdmins([
    { id: 'a_main', email: 'admin@tramnen.vn', password: 'demo1234', displayName: 'Quản trị TRAM NEN', createdAt: t0 - DAY * 200 }
  ]);

  store.saveCategories([
    { id: 'nen-hu',       name: 'Nến hũ thủy tinh',        name_en: 'Glass jar candles',          art: 'jar',      order: 1,
      desc: 'Nến trong hũ thủy tinh, đốt lâu và dễ dùng.', desc_en: 'Long-burning candles in glass jars.' },
    { id: 'tealight',     name: 'Nến tealight & tạo hình', name_en: 'Tealights & shaped candles', art: 'tealight', order: 2,
      desc: 'Nến nhỏ, nến trụ và nến tạo hình trang trí.', desc_en: 'Tealights, pillars and decorative shapes.' },
    { id: 'sap-tinh-dau', name: 'Sáp thơm & tinh dầu',     name_en: 'Wax melts & oils',           art: 'oil',      order: 3,
      desc: 'Tỏa hương không cần lửa.', desc_en: 'Fragrance without a flame.' },
    { id: 'set-qua',      name: 'Set quà tặng',            name_en: 'Gift sets',                  art: 'gift',     order: 4,
      desc: 'Hộp quà gói sẵn kèm thiệp.', desc_en: 'Ready-wrapped boxes with a card.' }
  ]);

  /* 3 phân loại 100g / 200g / 300g, mỗi loại một giá + tồn kho */
  const V = (p1, p2, p3, s = [20, 20, 12], notes = []) => [
    { id: 'v100', label: '100g', price: p1, stock: s[0], note: notes[0] || '' },
    { id: 'v200', label: '200g', price: p2, stock: s[1], note: notes[1] || '' },
    { id: 'v300', label: '300g', price: p3, stock: s[2], note: notes[2] || '' }
  ];
  const burn = ['20–25 giờ', '40–45 giờ', '60–65 giờ'];
  const P = (o) => ({ image: '', status: 'active', salePercent: 0, featured: false, ...o });

  const products = [
    P({ id: 'p1', name: 'Gỗ Thông Đà Lạt', name_en: 'Dalat Pine Wood', category: 'nen-hu', scent: 'go-am', featured: true,
        notes: { top: 'Lá thông', mid: 'Tuyết tùng', base: 'Hổ phách' }, notes_en: { top: 'Pine needle', mid: 'Cedarwood', base: 'Amber' },
        desc: 'Mùi lá thông xen gỗ tuyết tùng, gợi một buổi sáng sương mù trên đồi. Hợp phòng khách và góc đọc sách.',
        desc_en: 'Pine needles meet cedarwood — a misty morning on the hills. Lovely for living rooms and reading nooks.',
        variants: V(159000, 249000, 329000, [24, 30, 14], burn), palette: 3, sold: 186, createdAt: t0 - DAY * 30 }),
    P({ id: 'p2', name: 'Trà Trắng & Hoa Nhài', name_en: 'White Tea & Jasmine', category: 'nen-hu', scent: 'hoa-co', featured: true,
        notes: { top: 'Trà trắng', mid: 'Hoa nhài', base: 'Xạ hương trắng' }, notes_en: { top: 'White tea', mid: 'Jasmine', base: 'White musk' },
        desc: 'Thanh nhẹ, sạch sẽ như tách trà buổi chiều. Mùi hương dịu, phù hợp phòng ngủ.',
        desc_en: 'Light and clean like an afternoon cup of tea. A gentle scent for bedrooms.',
        variants: V(159000, 249000, 329000, [18, 22, 10], burn), palette: 5, sold: 142, createdAt: t0 - DAY * 26 }),
    P({ id: 'p3', name: 'Cam Đường Buổi Sáng', name_en: 'Morning Sugared Orange', category: 'nen-hu', scent: 'cam-chanh', salePercent: 10,
        notes: { top: 'Cam ngọt', mid: 'Vỏ quýt', base: 'Gỗ tuyết tùng' }, notes_en: { top: 'Sweet orange', mid: 'Mandarin peel', base: 'Cedarwood' },
        desc: 'Tươi và sáng, giúp căn phòng bừng tỉnh. Lý tưởng cho bàn làm việc buổi sáng.',
        desc_en: 'Fresh and bright to wake up the room. Perfect for a morning desk.',
        variants: V(149000, 239000, 319000, [15, 20, 8], burn), palette: 1, sold: 91, createdAt: t0 - DAY * 22 }),
    P({ id: 'p4', name: 'Vani Gỗ Đàn Hương', name_en: 'Vanilla Sandalwood', category: 'nen-hu', scent: 'ngot-ngao', featured: true,
        notes: { top: 'Vani', mid: 'Đậu tonka', base: 'Đàn hương' }, notes_en: { top: 'Vanilla', mid: 'Tonka bean', base: 'Sandalwood' },
        desc: 'Ngọt ấm, sâu lắng — dành cho những buổi tối dài thư giãn.',
        desc_en: 'Warm, sweet and deep — for long, relaxing evenings.',
        variants: V(169000, 259000, 339000, [12, 16, 10], burn), palette: 9, sold: 157, createdAt: t0 - DAY * 20 }),
    P({ id: 'p5', name: 'Sả Chanh Thư Giãn', name_en: 'Calming Lemongrass', category: 'tealight', scent: 'thao-moc',
        notes: { top: 'Sả chanh', mid: 'Bạc hà', base: 'Cỏ hương bài' }, notes_en: { top: 'Lemongrass', mid: 'Mint', base: 'Vetiver' },
        desc: 'Hộp tealight nhỏ gọn, thắp trong phòng tắm hoặc bên bồn rửa mặt.',
        desc_en: 'A compact box of tealights for the bathroom or vanity.',
        variants: V(89000, 149000, 199000, [40, 30, 20], ['8 viên', '16 viên', '24 viên']), palette: 2, sold: 220, createdAt: t0 - DAY * 18 }),
    P({ id: 'p6', name: 'Nến Trụ Hoa Hồng Khô', name_en: 'Dried Rose Pillar', category: 'tealight', scent: 'hoa-co',
        notes: { top: 'Hoa hồng', mid: 'Phong lữ', base: 'Gỗ đàn hương' }, notes_en: { top: 'Rose', mid: 'Geranium', base: 'Sandalwood' },
        desc: 'Nến trụ vừa thơm vừa làm vật trang trí cho bàn ăn.',
        desc_en: 'A pillar candle that scents and decorates your dining table.',
        variants: V(119000, 189000, 249000, [12, 10, 6], burn), palette: 7, sold: 63, createdAt: t0 - DAY * 15 }),
    P({ id: 'p7', name: 'Nến Đám Mây Caramel', name_en: 'Caramel Cloud Candle', category: 'tealight', scent: 'ngot-ngao', salePercent: 15,
        notes: { top: 'Caramel', mid: 'Đường nâu', base: 'Vani' }, notes_en: { top: 'Caramel', mid: 'Brown sugar', base: 'Vanilla' },
        desc: 'Nến tạo hình đám mây xinh xắn, mùi ngọt nhẹ — món quà nhỏ dễ thương.',
        desc_en: 'A cute cloud-shaped candle with a soft sweet scent — a lovely little gift.',
        variants: V(99000, 159000, 209000, [0, 8, 5], burn), palette: 4, sold: 98, createdAt: t0 - DAY * 12 }),
    P({ id: 'p8', name: 'Tinh Dầu Khuếch Tán Gỗ Ấm', name_en: 'Warm Woods Reed Diffuser', category: 'sap-tinh-dau', scent: 'go-am',
        notes: { top: 'Bergamot', mid: 'Tuyết tùng', base: 'Cỏ hương bài' }, notes_en: { top: 'Bergamot', mid: 'Cedarwood', base: 'Vetiver' },
        desc: 'Bộ que gỗ khuếch tán, tỏa hương đều mà không cần lửa.',
        desc_en: 'A reed diffuser that scents evenly — no flame needed.',
        variants: V(179000, 259000, 339000, [14, 12, 8], ['4–5 tuần', '6–8 tuần', '9–12 tuần']), palette: 8, sold: 59, createdAt: t0 - DAY * 10 }),
    P({ id: 'p9', name: 'Sáp Thơm Treo Xe Cam Chanh', name_en: 'Citrus Car Wax Sachet', category: 'sap-tinh-dau', scent: 'cam-chanh',
        notes: { top: 'Chanh vàng', mid: 'Bergamot', base: 'Gừng' }, notes_en: { top: 'Lemon', mid: 'Bergamot', base: 'Ginger' },
        desc: 'Túi sáp thơm treo xe hoặc tủ quần áo, mùi tươi mát dễ chịu.',
        desc_en: 'A wax sachet for your car or wardrobe with a fresh, pleasant scent.',
        variants: V(79000, 129000, 169000, [35, 25, 15], ['4–6 tuần', '6–8 tuần', '8–10 tuần']), palette: 0, sold: 195, createdAt: t0 - DAY * 8 }),
    P({ id: 'p10', name: 'Tinh Dầu Oải Hương', name_en: 'Lavender Essential Oil', category: 'sap-tinh-dau', scent: 'hoa-co',
        notes: { top: 'Oải hương', mid: 'Xô thơm', base: 'Xạ hương' }, notes_en: { top: 'Lavender', mid: 'Clary sage', base: 'Musk' },
        desc: 'Tinh dầu dùng với đèn xông, hợp thư giãn trước giờ ngủ.',
        desc_en: 'An oil for burners and diffusers — ideal before bedtime.',
        variants: V(99000, 169000, 229000, [22, 18, 10]), palette: 6, sold: 102, createdAt: t0 - DAY * 6 }),
    P({ id: 'p11', name: 'Set Quà Dừng Một Chút', name_en: 'The “Pause a Little” Gift Set', category: 'set-qua', scent: 'go-am', featured: true,
        notes: { top: 'Lá thông', mid: 'Tuyết tùng', base: 'Hổ phách' }, notes_en: { top: 'Pine needle', mid: 'Cedarwood', base: 'Amber' },
        desc: 'Hộp quà gồm nến hũ, tealight và thiệp viết tay — đúng tinh thần TRAM NEN.',
        desc_en: 'A box with a jar candle, tealights and a handwritten card — the TRAM NEN spirit.',
        variants: V(359000, 459000, 559000, [8, 8, 5], ['Nến 100g + 3 tealight', 'Nến 200g + 3 tealight', 'Nến 300g + 6 tealight']), palette: 3, sold: 41, createdAt: t0 - DAY * 4 }),
    P({ id: 'p12', name: 'Set Quà Thảnh Thơi', name_en: 'The Unwind Gift Set', category: 'set-qua', scent: 'thao-moc', salePercent: 10,
        notes: { top: 'Sả chanh', mid: 'Bạc hà', base: 'Cỏ hương bài' }, notes_en: { top: 'Lemongrass', mid: 'Mint', base: 'Vetiver' },
        desc: 'Nến hũ, tinh dầu và đèn xông mini trong một hộp quà gọn gàng.',
        desc_en: 'A jar candle, oil and mini burner in one neat gift box.',
        variants: V(429000, 549000, 649000, [6, 6, 4]), palette: 2, sold: 27, createdAt: t0 - DAY * 2 })
  ];
  store.saveProducts(products);

  const item = (pid, vid, qty) => {
    const p = products.find(x => x.id === pid), v = getVariant(p, vid);
    return { productId: pid, variantId: v.id, variantLabel: v.label, name: p.name, name_en: p.name_en, price: salePrice(v.price, p), qty };
  };
  const mk = (o) => {
    const subtotal = o.items.reduce((s, i) => s + i.price * i.qty, 0);
    const discountAmount = o.discountPercent ? Math.round(subtotal * o.discountPercent / 100) : 0;
    const shipping = subtotal - discountAmount >= DEFAULT_SETTINGS.freeShipFrom ? 0 : DEFAULT_SETTINGS.shippingFee;
    return { payment: 'cod', note: '', discountCode: '', discountPercent: 0, ...o, subtotal, discountAmount, shipping,
             total: subtotal - discountAmount + shipping, updatedAt: o.createdAt };
  };
  store.saveOrders([
    mk({ id: 'o1', code: 'TN240101', items: [item('p1', 'v200', 1), item('p5', 'v100', 2)], status: 'done',
         customer: { name: 'Minh Thư', phone: '0901234567', address: 'Quận 3, TP. Hồ Chí Minh', email: '' }, createdAt: t0 - DAY * 12 }),
    mk({ id: 'o2', code: 'TN240102', items: [item('p11', 'v200', 1)], status: 'shipping', discountCode: 'CHAOBAN10', discountPercent: 10,
         customer: { name: 'Minh Thư', phone: '0901234567', address: 'Quận 3, TP. Hồ Chí Minh', email: '' }, createdAt: t0 - DAY * 2 }),
    mk({ id: 'o3', code: 'TN240103', items: [item('p4', 'v300', 1), item('p9', 'v100', 2)], status: 'done',
         customer: { name: 'Gia Huy', phone: '0912345678', address: 'TP. Thủ Đức, TP. Hồ Chí Minh', email: '' }, createdAt: t0 - DAY * 9 }),
    mk({ id: 'o4', code: 'TN240104', items: [item('p2', 'v200', 1)], status: 'pending', payment: 'bank',
         customer: { name: 'Khánh Linh', phone: '0987654321', address: 'Quận 1, TP. Hồ Chí Minh', email: '' }, createdAt: t0 - 3 * 3600000 })
  ]);

  store.saveReviews([
    { id: 'r1', productId: 'p4', name: 'Gia Huy',   rating: 5, comment: 'Mùi vani ấm, đốt lâu, hũ rất xinh.', createdAt: t0 - DAY * 7 },
    { id: 'r2', productId: 'p9', name: 'Gia Huy',   rating: 4, comment: 'Treo xe thơm dịu, không gây nhức đầu.', createdAt: t0 - DAY * 6 },
    { id: 'r3', productId: 'p1', name: 'Minh Thư',  rating: 5, comment: 'Thơm mùi gỗ thông như đang ở Đà Lạt.', createdAt: t0 - DAY * 10 },
    { id: 'r4', productId: 'p5', name: 'Minh Thư',  rating: 5, comment: 'Tealight nhỏ xinh, thắp trong phòng tắm rất thư giãn.', createdAt: t0 - DAY * 9 }
  ]);

  store.saveDiscounts([
    { id: 'd1', code: 'CHAOBAN10', percent: 10, active: true, public: true, limit: 0, used: 1, expiresAt: null,
      note: 'Giảm 10% cho mọi đơn hàng', note_en: '10% off every order', createdAt: t0 - DAY * 30 },
    { id: 'd2', code: 'TRAMNEN15', percent: 15, active: true, public: false, limit: 50, used: 0, expiresAt: null,
      note: 'Mã riêng cho khách thân thiết', note_en: 'For loyal customers', createdAt: t0 - DAY * 5 }
  ]);

  store.savePosts([
    { id: 'b1', slug: 'cach-dot-nen-thom-dung-cach', status: 'published', cover: '', palette: 3, art: 'jar',
      tag: 'Mẹo dùng nến', tag_en: 'Candle care', author: 'TRAM NEN', createdAt: t0 - DAY * 14,
      title: '4 bước đốt nến thơm đúng cách để nến cháy đều và thơm lâu',
      title_en: '4 steps to burn a scented candle evenly and make it last',
      excerpt: 'Chỉ vài thói quen nhỏ khi thắp nến sẽ giúp nến không bị “đào hầm”, ít khói và tỏa hương đều hơn.',
      excerpt_en: 'A few small habits stop tunnelling, reduce smoke and help the scent spread evenly.',
      content: '## 1. Lần đốt đầu tiên thật kiên nhẫn\n\nĐể nến cháy đến khi lớp sáp tan đều ra sát thành hũ, thường mất khoảng 2–3 giờ. Lớp sáp này giống như “trí nhớ” của cây nến — nếu tắt quá sớm, các lần sau nến sẽ chỉ cháy thành một lỗ nhỏ ở giữa.\n\n## 2. Cắt bấc trước mỗi lần thắp\n\nGiữ bấc dài khoảng 5mm. Bấc quá dài khiến ngọn lửa to, nhiều khói đen và làm ám hũ.\n\n## 3. Không đốt quá lâu\n\nMỗi lần nên đốt tối đa khoảng 4 giờ, sau đó tắt nến và để nguội trước khi thắp lại.\n\n## 4. An toàn là trên hết\n\n- Đặt nến trên bề mặt chịu nhiệt, xa rèm cửa\n- Tránh xa tầm tay trẻ nhỏ và thú cưng\n- Không để nến cháy khi không có người trông',
      content_en: '## 1. Be patient the first time\n\nLet the candle burn until the wax melts all the way to the edge, usually 2–3 hours. That first melt pool is the candle’s “memory” — blow it out too early and it will tunnel down the middle.\n\n## 2. Trim the wick every time\n\nKeep the wick about 5mm long. A long wick makes a big flame, black smoke and sooty glass.\n\n## 3. Don’t burn for too long\n\nBurn for up to about 4 hours at a time, then let the candle cool before relighting.\n\n## 4. Safety first\n\n- Place candles on a heat-resistant surface, away from curtains\n- Keep away from children and pets\n- Never leave a burning candle unattended' },
    { id: 'b2', slug: 'chon-mui-huong-cho-tung-can-phong', status: 'published', cover: '', palette: 7, art: 'oil',
      tag: 'Chọn mùi hương', tag_en: 'Choosing scents', author: 'TRAM NEN', createdAt: t0 - DAY * 8,
      title: 'Chọn mùi hương cho từng căn phòng trong nhà',
      title_en: 'Choosing a scent for every room',
      excerpt: 'Phòng khách, phòng ngủ hay bàn làm việc — mỗi không gian hợp với một nhóm hương khác nhau.',
      excerpt_en: 'Living room, bedroom or desk — each space suits a different scent family.',
      content: '## Phòng khách: gỗ ấm\n\nNhững mùi gỗ như tuyết tùng, đàn hương tạo cảm giác ấm cúng và chào đón khách.\n\n## Phòng ngủ: hoa cỏ dịu nhẹ\n\nHoa nhài, oải hương hay trà trắng giúp không gian nhẹ nhàng trước giờ ngủ.\n\n## Bàn làm việc: cam chanh\n\nMùi cam, chanh, bergamot tươi sáng, giúp tinh thần tỉnh táo hơn.\n\n## Phòng tắm: thảo mộc\n\nSả chanh, bạc hà mang lại cảm giác sạch sẽ, mát lành.',
      content_en: '## Living room: warm woods\n\nCedar and sandalwood feel cosy and welcoming.\n\n## Bedroom: soft florals\n\nJasmine, lavender or white tea keep the room calm before sleep.\n\n## Desk: citrus\n\nOrange, lemon and bergamot are bright and help you stay alert.\n\n## Bathroom: herbal\n\nLemongrass and mint feel clean and refreshing.' },
    { id: 'b3', slug: 'goi-y-qua-tang-nen-thom', status: 'published', cover: '', palette: 4, art: 'gift',
      tag: 'Quà tặng', tag_en: 'Gifting', author: 'TRAM NEN', createdAt: t0 - DAY * 3,
      title: 'Gợi ý tặng nến thơm theo từng dịp',
      title_en: 'Scented candle gift ideas for every occasion',
      excerpt: 'Sinh nhật, tân gia hay một lời cảm ơn — nến thơm luôn là món quà tinh tế và dễ chọn.',
      excerpt_en: 'Birthdays, housewarmings or a simple thank-you — candles are an easy, thoughtful gift.',
      content: '## Sinh nhật\n\nMột set quà kèm thiệp viết tay luôn khiến người nhận vui.\n\n## Tân gia\n\nMùi gỗ ấm hợp với ngôi nhà mới, mang lại cảm giác vững chãi.\n\n## Lời cảm ơn\n\nMột hộp tealight nhỏ gọn là cách nói cảm ơn nhẹ nhàng mà tinh tế.',
      content_en: '## Birthdays\n\nA gift set with a handwritten card always brings a smile.\n\n## Housewarmings\n\nWarm woods suit a new home and feel grounding.\n\n## Saying thank you\n\nA small box of tealights is a gentle, thoughtful thank-you.' }
  ]);

  store.saveMembers([
    { id: 'mb1', name: 'Thành viên 1', role: 'Sáng lập & điều hành', role_en: 'Founder & manager', photo: '', order: 1,
      bio: 'Cập nhật giới thiệu trong Quản trị → Thành viên.', bio_en: 'Edit this bio in Admin → Members.' },
    { id: 'mb2', name: 'Thành viên 2', role: 'Pha chế mùi hương', role_en: 'Scent designer', photo: '', order: 2,
      bio: 'Cập nhật giới thiệu trong Quản trị → Thành viên.', bio_en: 'Edit this bio in Admin → Members.' },
    { id: 'mb3', name: 'Thành viên 3', role: 'Thiết kế & truyền thông', role_en: 'Design & communications', photo: '', order: 3,
      bio: 'Cập nhật giới thiệu trong Quản trị → Thành viên.', bio_en: 'Edit this bio in Admin → Members.' }
  ]);

  saveSettings({ ...DEFAULT_SETTINGS });
  saveHome({ ...DEFAULT_HOME });
  if (!store.get(KEYS.cart, null)) store.saveCart([]);
  store.set(KEYS.seeded, true);
}
