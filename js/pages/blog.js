/* TRAM NEN · pages/blog.js
   Danh sách bài viết (lọc theo chủ đề) + trang chi tiết bài viết */

function postCoverHTML(post, cls = '') {
  const url = mediaURL(post.cover);
  return `<div class="post-cover ${cls}" style="${paletteStyle({ palette: post.palette ?? 3 })}">
    ${url ? mediaHTML(post.cover, { alt: L(post, 'title') }) : `${blobsHTML(seedOf(post.id) % 50)}<div class="tn-art-wrap">${artSVG(post.art || 'jar')}</div>`}
  </div>`;
}

function postCardHTML(post, i = 0) {
  return `
    <a class="post-card reveal" href="#/blog/${encodeURIComponent(post.slug)}" style="--rd:${(i % 3) * 0.08}s">
      ${postCoverHTML(post)}
      <div class="post-body">
        <div class="post-meta"><span class="post-tag">${escapeHTML(L(post, 'tag'))}</span><span>${fmtDate(post.createdAt)}</span></div>
        <h3>${escapeHTML(L(post, 'title'))}</h3>
        <p>${escapeHTML(L(post, 'excerpt'))}</p>
        <span class="tn-link-arrow">${t('common.readMore')} ${icon('arrowRight')}</span>
      </div>
    </a>`;
}

let blogTag = 'all';
function renderBlog(app, params) {
  const posts = publishedPosts();
  const tags = [...new Set(posts.map(p => L(p, 'tag')).filter(Boolean))];
  if (params?.get('tag')) blogTag = params.get('tag');
  if (blogTag !== 'all' && !tags.includes(blogTag)) blogTag = 'all';
  const list = blogTag === 'all' ? posts : posts.filter(p => L(p, 'tag') === blogTag);
  const [first, ...rest] = list;

  mount(app, appShell(`
    <section class="page-hero page-hero--sm" style="${paletteStyle({ palette: 7 })}">
      ${blobsHTML(12)}
      <div class="tn-container-wide page-hero-inner">
        <nav class="tn-crumbs"><a href="#/">${t('nav.home')}</a><span>/</span><span aria-current="page">${t('nav.blog')}</span></nav>
        <h1 class="tn-h1 split">${t('blog.title')}</h1>
        <p class="tn-sub">${t('blog.subtitle')}</p>
      </div>
    </section>
    <div class="tn-container-wide" style="padding-bottom:60px">
      ${tags.length > 1 ? `<div class="tn-chips" id="blog-tags" style="margin:26px 0 6px">
        ${[['all', t('shop.all')], ...tags.map(x => [x, x])].map(([v, label]) => `<button class="tn-chip-btn ${blogTag === v ? 'active' : ''}" data-tag="${escapeHTML(v)}">${escapeHTML(label)}</button>`).join('')}
      </div>` : ''}
      ${first ? `
        <a class="post-feature reveal" href="#/blog/${encodeURIComponent(first.slug)}">
          ${postCoverHTML(first, 'post-cover--lg')}
          <div class="post-body">
            <div class="post-meta"><span class="post-tag">${escapeHTML(L(first, 'tag'))}</span><span>${fmtDate(first.createdAt)}</span><span>${t('blog.minRead', { n: readingTime(L(first, 'content')) })}</span></div>
            <h2 class="tn-h2">${escapeHTML(L(first, 'title'))}</h2>
            <p class="tn-sub">${escapeHTML(L(first, 'excerpt'))}</p>
            <span class="tn-btn tn-btn--primary" style="align-self:flex-start">${t('common.readMore')} ${icon('arrowRight')}</span>
          </div>
        </a>
        <div class="tn-grid tn-grid--3" style="margin-top:26px">${rest.map((p, i) => postCardHTML(p, i)).join('')}</div>
      ` : `<div class="tn-empty" style="margin-top:26px"><p class="tn-sub">${t('blog.empty')}</p></div>`}
    </div>
  `));
  $$('#blog-tags [data-tag]').forEach(b => b.addEventListener('click', () => { blogTag = b.dataset.tag; renderBlog(app); }));
}

function renderPost(app, slug) {
  const post = getPostBySlug(slug);
  const admin = currentAdmin();
  if (!post || (post.status !== 'published' && !admin)) return render404(app);
  const content = L(post, 'content');
  const related = publishedPosts().filter(p => p.id !== post.id).slice(0, 3);
  const shareUrl = location.href;

  mount(app, appShell(`
    <article class="post-page">
      <header class="post-hero">
        <div class="tn-container-narrow">
          <nav class="tn-crumbs"><a href="#/">${t('nav.home')}</a><span>/</span><a href="#/blog">${t('nav.blog')}</a></nav>
          ${post.status !== 'published' ? `<div class="tn-flash tn-flash--warn">${t('blog.draft')}</div>` : ''}
          <div class="post-meta"><span class="post-tag">${escapeHTML(L(post, 'tag'))}</span><span>${fmtDate(post.createdAt)}</span><span>${t('blog.minRead', { n: readingTime(content) })}</span></div>
          <h1 class="tn-h1 split">${escapeHTML(L(post, 'title'))}</h1>
          <p class="post-lead">${escapeHTML(L(post, 'excerpt'))}</p>
          <div class="post-author">${logoMarkSVG()}<span>${t('blog.by')} <b>${escapeHTML(post.author || settings().name)}</b></span></div>
        </div>
      </header>
      <div class="tn-container-narrow">
        ${postCoverHTML(post, 'post-cover--hero reveal')}
        <div class="post-content reveal">${richText(content)}</div>
        <div class="post-share">
          <span>${t('blog.share')}</span>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>
          <button data-action="copy-link" aria-label="${t('blog.copyLink')}">${ICONS.copy}</button>
          <a href="#/blog" class="tn-link-arrow" style="margin-left:auto">← ${t('blog.back')}</a>
        </div>
      </div>
      ${related.length ? `
        <section class="tn-section-band">
          <div class="tn-container-wide">
            <h2 class="tn-h2">${t('blog.related')}</h2>
            <div class="tn-grid tn-grid--3" style="margin-top:18px">${related.map((p, i) => postCardHTML(p, i)).join('')}</div>
          </div>
        </section>` : ''}
    </article>
  `));
}
