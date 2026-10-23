/* TRAM NEN · admin/admin-content.js
   Blog, nội dung trang chủ (ảnh/video/chữ chạy), Thành viên */

/* ============================================================
   BLOG
   ============================================================ */
function renderAdminBlog(app) {
  const posts = store.posts().slice().sort((a, b) => b.createdAt - a.createdAt);
  adminMount(app, 'blog', 'Bài viết blog', `
    <section class="adm-card adm-card--flush">
      <div class="tn-table-wrap"><table class="tn-table">
        <thead><tr><th>Bài viết</th><th>Chủ đề</th><th>Ngày</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>${posts.map(p => `<tr>
          <td><div class="admin-prod"><div class="admin-thumb admin-thumb--wide">${postCoverHTML(p)}</div>
            <div><b>${escapeHTML(p.title)}</b><div class="tn-muted" style="font-size:12px">/${escapeHTML(p.slug)}</div></div></div></td>
          <td class="tn-muted">${escapeHTML(p.tag || '')}</td>
          <td class="tn-muted">${fmtDate(p.createdAt)}</td>
          <td><span class="tn-chip ${p.status === 'published' ? 'tn-chip--done' : 'tn-chip--muted'}">${p.status === 'published' ? 'Đã đăng' : 'Bản nháp'}</span></td>
          <td><div class="tn-actions">
            <a class="tn-btn tn-btn--ghost tn-btn--sm" href="#/admin/blog/edit/${encodeURIComponent(p.id)}">Sửa</a>
            <a class="tn-btn tn-btn--ghost tn-btn--sm" href="#/blog/${encodeURIComponent(p.slug)}">Xem</a>
            <button class="tn-btn tn-btn--danger tn-btn--sm" data-action="ab-delete" data-id="${escapeHTML(p.id)}">Xóa</button>
          </div></td></tr>`).join('') || '<tr><td colspan="5" class="tn-muted" style="text-align:center;padding:30px">Chưa có bài viết</td></tr>'}</tbody>
      </table></div>
    </section>
  `, `<a href="#/admin/blog/new" class="tn-btn tn-btn--primary">+ Viết bài mới</a>`);
}
ADMIN_ACTIONS['ab-delete'] = (id) => {
  const p = store.posts().find(x => x.id === id);
  if (!p || !confirm(`Xóa bài “${p.title}”?`)) return;
  store.savePosts(store.posts().filter(x => x.id !== id));
  dropReplacedMedia([p.cover], []);
  toast('Đã xóa bài viết', 'ok'); route();
};

function renderAdminPostForm(app, id) {
  const editing = id ? store.posts().find(p => p.id === id) : null;
  if (id && !editing) return adminMount(app, 'blog', 'Không tìm thấy', '<div class="tn-empty">Bài viết không tồn tại.</div>');
  const p = editing || { title: '', title_en: '', slug: '', tag: '', tag_en: '', excerpt: '', excerpt_en: '', content: '', content_en: '', cover: '', status: 'published', palette: 3, art: 'jar', author: settings().name };
  let palette = Number(p.palette) || 0;

  adminMount(app, 'blog', editing ? 'Sửa bài viết' : 'Viết bài mới', `
    <form class="pf-layout" id="post-form" novalidate>
      <div class="pf-main">
        <section class="adm-card">
          <div class="tn-field"><label>Tiêu đề (Tiếng Việt) *</label><input id="b-title" value="${escapeHTML(p.title)}" maxlength="140"></div>
          <div class="tn-field"><label>Title (English)</label><input id="b-title-en" value="${escapeHTML(p.title_en || '')}" maxlength="140"></div>
          <div class="tn-row tn-row--3">
            <div class="tn-field"><label>Đường dẫn (slug)</label><input id="b-slug" value="${escapeHTML(p.slug)}" placeholder="tu-dong-tao-tu-tieu-de"></div>
            <div class="tn-field"><label>Chủ đề</label><input id="b-tag" value="${escapeHTML(p.tag || '')}" placeholder="Mẹo dùng nến"></div>
            <div class="tn-field"><label>Topic (EN)</label><input id="b-tag-en" value="${escapeHTML(p.tag_en || '')}"></div>
          </div>
          <div class="tn-row">
            <div class="tn-field"><label>Tác giả</label><input id="b-author" value="${escapeHTML(p.author || '')}"></div>
            <div class="tn-field"><label>Trạng thái</label><select id="b-status"><option value="published" ${p.status === 'published' ? 'selected' : ''}>Đăng ngay</option><option value="draft" ${p.status !== 'published' ? 'selected' : ''}>Lưu nháp</option></select></div>
          </div>
        </section>
        <section class="adm-card">
          <h2 class="adm-h2">Nội dung</h2>
          <div class="tn-field"><label>Tóm tắt (Tiếng Việt)</label><textarea id="b-excerpt" maxlength="300" style="min-height:70px">${escapeHTML(p.excerpt || '')}</textarea></div>
          <div class="tn-field"><label>Excerpt (English)</label><textarea id="b-excerpt-en" maxlength="300" style="min-height:70px">${escapeHTML(p.excerpt_en || '')}</textarea></div>
          <div class="tn-field"><label>Bài viết (Tiếng Việt) *</label><textarea id="b-content" class="code-area">${escapeHTML(p.content || '')}</textarea>
            <p class="tn-hint">Cách định dạng: để trống 1 dòng giữa các đoạn · <code>## Tiêu đề</code> · <code>- gạch đầu dòng</code> · <code>**in đậm**</code></p></div>
          <div class="tn-field"><label>Article (English)</label><textarea id="b-content-en" class="code-area">${escapeHTML(p.content_en || '')}</textarea></div>
        </section>
        <section class="adm-card">
          <h2 class="adm-h2">Ảnh bìa</h2>
          ${mediaFieldHTML('cover', p.cover, { accept: 'image/*,video/*', label: 'Ảnh hoặc video bìa', hint: 'Để trống sẽ dùng hình minh họa theo kiểu và màu bên dưới.' })}
          <div class="tn-row" style="margin-top:12px">
            <div class="tn-field"><label>Kiểu minh họa</label><select id="b-art">${Object.entries(ART_TYPES).map(([k, l]) => `<option value="${k}" ${p.art === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
            <div class="tn-field"><label>Màu nền</label>${palettePickerHTML(palette)}</div>
          </div>
        </section>
        <div class="adm-form-actions">
          <button class="tn-btn tn-btn--primary tn-btn--lg" type="submit">${editing ? 'Lưu bài viết' : 'Đăng bài'}</button>
          <a href="#/admin/blog" class="tn-btn tn-btn--ghost tn-btn--lg">Hủy</a>
        </div>
      </div>
      <aside class="pf-preview"><div class="mf-label">Xem trước thẻ bài viết</div><div id="pf-card"></div></aside>
    </form>
  `);

  const form = $('#post-form');
  const read = () => ({
    ...p, title: val('#b-title') || 'Tiêu đề bài viết', title_en: val('#b-title-en'),
    slug: slugify(val('#b-slug') || val('#b-title')), tag: val('#b-tag'), tag_en: val('#b-tag-en'),
    author: val('#b-author'), status: val('#b-status'),
    excerpt: val('#b-excerpt'), excerpt_en: val('#b-excerpt-en'),
    content: $('#b-content').value, content_en: $('#b-content-en').value,
    cover: readHidden(form, 'cover'), art: val('#b-art'), palette
  });
  const preview = () => {
    if (!document.body.contains(form)) return;
    $('#pf-card').innerHTML = postCardHTML({ id: 'pv', createdAt: p.createdAt || now(), ...read() });
    $$('#pf-card .reveal').forEach(el => el.classList.add('in'));
    $('#pf-card a')?.removeAttribute('href');
  };
  preview();
  form.addEventListener('input', debounce(preview, 150));
  form.addEventListener('change', preview);
  bindMediaFields(form, preview);
  bindPalettePicker(form, (i) => { palette = i; preview(); });
  $('#b-title').addEventListener('blur', () => { if (!val('#b-slug')) $('#b-slug').value = slugify(val('#b-title')); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = read();
    if (!val('#b-title') || !d.content.trim()) { toast('Vui lòng nhập tiêu đề và nội dung', 'err'); return; }
    const all = store.posts();
    let slug = d.slug || 'bai-viet';
    while (all.some(x => x.slug === slug && x.id !== editing?.id)) slug += '-2';
    d.slug = slug;
    if (editing) {
      const i = all.findIndex(x => x.id === editing.id);
      all[i] = { ...all[i], ...d };
      dropReplacedMedia([editing.cover], [d.cover]);
    } else all.push({ ...d, id: 'b_' + uid(), createdAt: now() });
    store.savePosts(all);
    toast(editing ? 'Đã lưu bài viết' : 'Đã đăng bài viết', 'ok');
    location.hash = '/admin/blog';
  });
}

/* ============================================================
   NỘI DUNG TRANG CHỦ
   ============================================================ */
function renderAdminHome(app) {
  const h = homeContent();
  const pair = (label, key, opts = {}) => `
    <div class="tn-row">
      <div class="tn-field"><label>${label} (Tiếng Việt)</label>${opts.area ? `<textarea id="h-${key}" style="min-height:${opts.h || 70}px">${escapeHTML(h[key] || '')}</textarea>` : `<input id="h-${key}" value="${escapeHTML(h[key] || '')}">`}</div>
      <div class="tn-field"><label>${label} (English)</label>${opts.area ? `<textarea id="h-${key}_en" style="min-height:${opts.h || 70}px">${escapeHTML(h[key + '_en'] || '')}</textarea>` : `<input id="h-${key}_en" value="${escapeHTML(h[key + '_en'] || '')}">`}</div>
    </div>`;

  adminMount(app, 'home', 'Nội dung trang chủ', `
    <form id="home-form" novalidate class="adm-stack">
      <p class="tn-sub">Mọi ảnh/video tải lên được lưu trong trình duyệt (IndexedDB) nên nhận được file dung lượng lớn: ảnh ≤ 50MB (tự tối ưu), video ≤ 300MB.</p>

      <section class="adm-card">
        <div class="adm-card-head"><h2 class="adm-h2">1. Phần đầu trang (carousel trụ xoay)</h2><a href="#/" class="tn-link-arrow">Xem →</a></div>
        ${pair('Dòng nhãn nhỏ', 'heroBadge')}
        ${pair('Đoạn giới thiệu dưới tiêu đề', 'heroText', { area: true })}
        ${mediaListHTML('carousel', h.carousel, { accept: 'image/*', max: 10, label: 'Ảnh cho các thẻ carousel' })}
        <p class="tn-hint">Để trống sẽ dùng hình minh họa nến. Ảnh dọc (tỉ lệ 3:4) hiển thị đẹp nhất. Tiêu đề lớn lấy từ slogan trong “Thông tin shop”.</p>
      </section>

      <section class="adm-card">
        <h2 class="adm-h2">2. Chữ chuyển động</h2>
        ${pair('Dải chữ chạy ngang (cách nhau bằng dấu phẩy)', 'marquee', { area: true, h: 60 })}
        ${pair('Cụm từ gõ máy sau “Thắp lên…” (cách nhau bằng dấu phẩy)', 'rotating', { area: true, h: 60 })}
      </section>

      <section class="adm-card">
        <h2 class="adm-h2">3. Giới thiệu thương hiệu</h2>
        ${pair('Tiêu đề', 'introTitle')}
        ${pair('Nội dung', 'introText', { area: true, h: 90 })}
        ${mediaFieldHTML('introMedia', h.introMedia, { accept: 'image/*,video/*', label: 'Ảnh hoặc video giới thiệu', hint: 'Video sẽ tự phát không tiếng, lặp lại.' })}
      </section>

      <section class="adm-card">
        <h2 class="adm-h2">4. Khối video</h2>
        ${pair('Tiêu đề', 'videoTitle')}
        ${pair('Mô tả', 'videoText', { area: true, h: 60 })}
        <div class="tn-row">
          ${mediaFieldHTML('video', h.video, { accept: 'video/*', label: 'Video (MP4/WebM)', hint: 'Phát nền không tiếng; khách bấm nút ▶ để xem có âm thanh.' })}
          ${mediaFieldHTML('videoPoster', h.videoPoster, { accept: 'image/*', label: 'Ảnh chờ (poster)' })}
        </div>
      </section>

      <section class="adm-card">
        <h2 class="adm-h2">5. Thư viện ảnh & video</h2>
        ${pair('Tiêu đề', 'galleryTitle')}
        ${mediaListHTML('gallery', h.gallery, { accept: 'image/*,video/*', max: 12, label: 'Ảnh / video' })}
      </section>

      <div class="adm-form-actions adm-sticky-actions">
        <button class="tn-btn tn-btn--primary tn-btn--lg" type="submit">Lưu trang chủ</button>
        <a href="#/" class="tn-btn tn-btn--ghost tn-btn--lg">Xem trang chủ</a>
      </div>
    </form>
  `);

  const form = $('#home-form');
  bindMediaFields(form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const next = { ...h };
    ['heroBadge', 'heroText', 'marquee', 'rotating', 'introTitle', 'introText', 'videoTitle', 'videoText', 'galleryTitle']
      .forEach(k => { next[k] = $('#h-' + k).value.trim(); next[k + '_en'] = $('#h-' + k + '_en').value.trim(); });
    next.carousel = readList(form, 'carousel');
    next.gallery = readList(form, 'gallery');
    ['introMedia', 'video', 'videoPoster'].forEach(k => next[k] = readHidden(form, k));
    if (!saveHome(next)) return;
    dropReplacedMedia([...(h.carousel || []), ...(h.gallery || []), h.introMedia, h.video, h.videoPoster],
      [...next.carousel, ...next.gallery, next.introMedia, next.video, next.videoPoster]);
    toast('Đã lưu nội dung trang chủ', 'ok');
  });
}

/* ============================================================
   THÀNH VIÊN
   ============================================================ */
function renderAdminMembers(app, editId) {
  const list = store.members().slice().sort((a, b) => (a.order || 0) - (b.order || 0));
  const editing = editId ? list.find(m => m.id === editId) : null;
  const m = editing || { name: '', role: '', role_en: '', bio: '', bio_en: '', photo: '', order: list.length + 1 };

  adminMount(app, 'members', 'Thành viên', `
    <div class="adm-grid-2 adm-grid-2--wide">
      <section class="adm-card adm-card--flush">
        <div class="tn-table-wrap"><table class="tn-table">
          <thead><tr><th>Thứ tự</th><th>Thành viên</th><th>Vai trò</th><th></th></tr></thead>
          <tbody>${list.map(x => `<tr class="${editing && editing.id === x.id ? 'row-active' : ''}">
            <td class="tn-muted">${x.order || 0}</td>
            <td><div class="admin-prod"><span class="tn-avatar">${mediaURL(x.photo) ? `<img src="${escapeHTML(mediaURL(x.photo))}" alt="">` : escapeHTML(initials(x.name))}</span><b>${escapeHTML(x.name)}</b></div></td>
            <td class="tn-muted">${escapeHTML(x.role || '')}</td>
            <td><div class="tn-actions">
              <a class="tn-btn tn-btn--ghost tn-btn--sm" href="#/admin/members/${encodeURIComponent(x.id)}">Sửa</a>
              <button class="tn-btn tn-btn--danger tn-btn--sm" data-action="am-delete" data-id="${escapeHTML(x.id)}">Xóa</button>
            </div></td></tr>`).join('') || '<tr><td colspan="4" class="tn-muted">Chưa có thành viên</td></tr>'}</tbody>
        </table></div>
      </section>
      <form class="adm-card" id="member-form" novalidate>
        <h2 class="adm-h2">${editing ? 'Sửa thành viên' : 'Thêm thành viên'}</h2>
        <div class="tn-row">
          <div class="tn-field"><label>Họ tên *</label><input id="m-name" value="${escapeHTML(m.name)}" maxlength="60"></div>
          <div class="tn-field"><label>Thứ tự</label><input id="m-order" type="number" value="${escapeHTML(m.order || 1)}"></div>
        </div>
        <div class="tn-row">
          <div class="tn-field"><label>Vai trò</label><input id="m-role" value="${escapeHTML(m.role || '')}" maxlength="60"></div>
          <div class="tn-field"><label>Role (EN)</label><input id="m-role-en" value="${escapeHTML(m.role_en || '')}" maxlength="60"></div>
        </div>
        <div class="tn-field"><label>Giới thiệu</label><textarea id="m-bio" maxlength="300" style="min-height:70px">${escapeHTML(m.bio || '')}</textarea></div>
        <div class="tn-field"><label>Bio (EN)</label><textarea id="m-bio-en" maxlength="300" style="min-height:70px">${escapeHTML(m.bio_en || '')}</textarea></div>
        ${mediaFieldHTML('photo', m.photo, { label: 'Ảnh chân dung', hint: 'Ảnh vuông hoặc dọc hiển thị đẹp nhất.' })}
        <div class="adm-form-actions">
          <button class="tn-btn tn-btn--primary" type="submit">${editing ? 'Lưu' : 'Thêm thành viên'}</button>
          ${editing ? '<a href="#/admin/members" class="tn-btn tn-btn--ghost">Hủy</a>' : ''}
        </div>
      </form>
    </div>
  `, `<a href="#/members" class="tn-btn tn-btn--ghost">Xem trang Thành viên</a>`);

  const form = $('#member-form');
  bindMediaFields(form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = val('#m-name');
    if (!name) { toast('Vui lòng nhập họ tên', 'err'); return; }
    const data = { name, order: Number(val('#m-order')) || 0, role: val('#m-role'), role_en: val('#m-role-en'),
      bio: val('#m-bio'), bio_en: val('#m-bio-en'), photo: readHidden(form, 'photo') };
    const all = store.members();
    if (editing) { const i = all.findIndex(x => x.id === editing.id); all[i] = { ...all[i], ...data }; dropReplacedMedia([editing.photo], [data.photo]); }
    else all.push({ id: 'mb_' + uid(), ...data });
    store.saveMembers(all);
    toast(editing ? 'Đã lưu thành viên' : 'Đã thêm thành viên', 'ok');
    location.hash = '/admin/members';
    if (!editing) route();
  });
}
ADMIN_ACTIONS['am-delete'] = (id) => {
  const m = store.members().find(x => x.id === id);
  if (!m || !confirm(`Xóa thành viên “${m.name}”?`)) return;
  store.saveMembers(store.members().filter(x => x.id !== id));
  dropReplacedMedia([m.photo], []);
  toast('Đã xóa', 'ok'); location.hash = '/admin/members'; route();
};
