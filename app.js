(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = MD.esc, root = document.documentElement, DATA = null, lang = root.lang === 'ar' ? 'ar' : 'en', filter = 'all';

  var T = {
    en: { home: 'Home', about: 'About', skills: 'Skills', portfolio: 'Portfolio', blog: 'Blog', languages: 'Languages', contact: 'Contact',
      work: 'View my work', touch: 'Get in touch', aboutE: 'About me', interests: 'Interests', skillsE: 'What I do', portE: 'Selected work', blogE: 'Writing', langE: 'Languages I speak', contE: "Let's talk",
      all: 'All', noProj: 'Projects will appear here soon.', noPost: 'Articles will appear here soon.', visit: 'Visit', watch: 'Watch video', read: 'Read article',
      name: 'Your name', email: 'Your email', msg: 'Message', send: 'Send message', sending: 'Sending...', sent: 'Thank you. Your message was sent.', fail: 'Could not send. Please check the fields and try again.',
      wa: 'WhatsApp', mail: 'Email', cdesc: 'Send me a message and I will reply as soon as I can.', theme: 'Theme', rights: 'All rights reserved.', other: 'Other' },
    ar: { home: 'الرئيسية', about: 'من أنا', skills: 'المهارات', portfolio: 'أعمالي', blog: 'المدونة', languages: 'اللغات', contact: 'تواصل معي',
      work: 'استعرض أعمالي', touch: 'تواصل معي', aboutE: 'من أنا', interests: 'اهتماماتي', skillsE: 'ماذا أفعل', portE: 'أعمال مختارة', blogE: 'مقالات', langE: 'اللغات التي أتحدثها', contE: 'يسعدني تواصلك',
      all: 'الكل', noProj: 'ستظهر المشروعات هنا قريباً.', noPost: 'ستظهر المقالات هنا قريباً.', visit: 'زيارة', watch: 'شاهد الفيديو', read: 'اقرأ المقال',
      name: 'اسمك', email: 'بريدك الإلكتروني', msg: 'رسالتك', send: 'إرسال الرسالة', sending: 'جاري الإرسال...', sent: 'شكراً لك. تم إرسال رسالتك.', fail: 'تعذر الإرسال. راجع الحقول وحاول مرة أخرى.',
      wa: 'واتساب', mail: 'البريد الإلكتروني', cdesc: 'أرسل لي رسالة وسأرد عليك في أقرب وقت.', theme: 'المظهر', rights: 'جميع الحقوق محفوظة.', other: 'أخرى' },
  };
  var t = function (k) { return T[lang][k]; };
  var pick = function (o, k) { return o[k + '_' + lang] || o[k + '_' + (lang === 'ar' ? 'en' : 'ar')] || ''; };
  var SECTIONS = ['home', 'about', 'skills', 'portfolio', 'blog', 'languages', 'contact'];

  function fmtDate(ts) { return new Date(ts * 1000).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }); }
  function embed(url) {
    var m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
    if (m) return '<iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/' + m[1] + '" allowfullscreen title="video"></iframe>';
    m = url.match(/vimeo\.com\/(\d+)/);
    if (m) return '<iframe loading="lazy" src="https://player.vimeo.com/video/' + m[1] + '" allowfullscreen title="video"></iframe>';
    return null;
  }

  function render() {
    var p = DATA.profile;
    root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = (lang === 'ar' ? p.name_ar : p.name_en) + ' | ' + (lang === 'ar' ? 'الموقع الشخصي' : 'Personal Website');
    $('#brand').textContent = pick(p, 'name');
    $('#lang').textContent = lang === 'ar' ? 'EN' : 'ع';
    $('#nav').innerHTML = SECTIONS.map(function (s) { return '<a href="#' + s + '" data-s="' + s + '">' + t(s) + '</a>'; }).join('');
    var initials = (p.name_en || 'MW').split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join('');
    var photo = p.photo ? '<img class="ph" src="' + esc(p.photo) + '" alt="' + esc(pick(p, 'name')) + '" fetchpriority="high">' : '<div class="ph" aria-hidden="true">' + esc(initials) + '</div>';
    var html = '';
    html += '<section id="home" class="hero"><div class="container"><div class="reveal"><p class="eyebrow">' + esc(lang === 'ar' ? 'الموقع الشخصي' : 'Personal website') + '</p><h1>' + esc(pick(p, 'name')) + '</h1><p class="tag">' + esc(pick(p, 'tagline')) + '</p><p class="intro">' + esc(pick(p, 'intro')) + '</p><div class="btns"><a class="btn primary" href="#portfolio">' + t('work') + '</a><a class="btn" href="#contact">' + t('touch') + '</a></div></div><div class="portrait reveal">' + photo + '</div></div></section>';
    var about = pick(p, 'about').split(/\n\s*\n/).map(function (x) { return '<p>' + esc(x).replace(/\n/g, '<br>') + '</p>'; }).join('');
    html += '<section id="about"><div class="container"><p class="eyebrow">' + t('about') + '</p><h2 class="reveal">' + t('aboutE') + '</h2><div class="about-grid reveal"><div>' + about + '</div><div><div class="int-list">' + (p.interests || []).map(function (i) { return '<div class="int">' + esc(i[lang] || i.en || i.ar) + '</div>'; }).join('') + '</div></div></div></div></section>';
    html += '<section id="skills"><div class="container"><p class="eyebrow">' + t('skills') + '</p><h2 class="reveal">' + t('skillsE') + '</h2><div class="grid">' + DATA.skills.map(function (s, i) { return '<div class="card skill reveal"><span class="n">' + String(i + 1).padStart(2, '0') + '</span><h3>' + esc(pick(s, 'name')) + '</h3>' + (pick(s, 'desc') ? '<p>' + esc(pick(s, 'desc')) + '</p>' : '') + '</div>'; }).join('') + '</div></div></section>';
    var cats = []; DATA.projects.forEach(function (x) { var c = pick(x, 'category'); if (c && cats.indexOf(c) < 0) cats.push(c); });
    if (filter !== 'all' && cats.indexOf(filter) < 0) filter = 'all';
    var shown = DATA.projects.filter(function (x) { return filter === 'all' || pick(x, 'category') === filter; });
    html += '<section id="portfolio"><div class="container"><p class="eyebrow">' + t('portfolio') + '</p><h2 class="reveal">' + t('portE') + '</h2>' +
      (cats.length ? '<div class="filters" role="tablist">' + ['all'].concat(cats).map(function (c) { return '<button data-f="' + esc(c) + '" class="' + (c === filter ? 'on' : '') + '">' + esc(c === 'all' ? t('all') : c) + '</button>'; }).join('') + '</div>' : '') +
      (shown.length ? '<div class="pgrid">' + shown.map(function (x) {
        var em = x.video ? embed(x.video) : null;
        var media = em || (x.image ? '<img loading="lazy" src="' + esc(x.image) + '" alt="' + esc(pick(x, 'title')) + '">' : '');
        var links = (x.link ? '<a href="' + esc(x.link) + '" target="_blank" rel="noopener noreferrer">' + t('visit') + ' ↗</a>' : '') + (x.video && !em ? '<a href="' + esc(x.video) + '" target="_blank" rel="noopener noreferrer">' + t('watch') + ' ↗</a>' : '');
        return '<article class="card proj reveal">' + (media ? '<div class="media">' + media + '</div>' : '') + '<div class="body">' + (pick(x, 'category') ? '<span class="cat">' + esc(pick(x, 'category')) + '</span>' : '') + '<h3>' + esc(pick(x, 'title')) + '</h3><p>' + esc(pick(x, 'desc')) + '</p>' + (links ? '<div class="links">' + links + '</div>' : '') + '</div></article>';
      }).join('') + '</div>' : '<div class="empty">' + t('noProj') + '</div>') + '</div></section>';
    html += '<section id="blog"><div class="container"><p class="eyebrow">' + t('blog') + '</p><h2 class="reveal">' + t('blogE') + '</h2>' + (DATA.posts.length ? '<div class="posts">' + DATA.posts.map(function (x) {
      return '<a class="card post reveal" href="./blog-' + encodeURIComponent(x.slug) + '.html">' + (x.cover ? '<div class="cov"><img loading="lazy" src="' + esc(x.cover) + '" alt=""></div>' : '') + '<div class="body"><time>' + fmtDate(x.created) + '</time><h3>' + esc(pick(x, 'title')) + '</h3><p>' + esc(pick(x, 'excerpt')) + '</p></div></a>';
    }).join('') + '</div>' : '<div class="empty">' + t('noPost') + '</div>') + '</div></section>';
    html += '<section id="languages"><div class="container"><p class="eyebrow">' + t('languages') + '</p><h2 class="reveal">' + t('langE') + '</h2><div class="grid">' + DATA.languages.map(function (l) { return '<div class="card lang reveal"><h3>' + esc(pick(l, 'name')) + '</h3>' + (pick(l, 'level') ? '<p>' + esc(pick(l, 'level')) + '</p>' : '') + '</div>'; }).join('') + '</div></div></section>';
    var cl = '';
    if (p.whatsapp) cl += '<a class="clink" href="https://wa.me/' + esc(p.whatsapp) + '" target="_blank" rel="noopener noreferrer"><span class="ic">W</span><span><small>' + t('wa') + '</small>+' + esc(p.whatsapp) + '</span></a>';
    if (p.email) cl += '<a class="clink" href="mailto:' + esc(p.email) + '"><span class="ic">@</span><span><small>' + t('mail') + '</small>' + esc(p.email) + '</span></a>';
    (p.socials || []).forEach(function (s) { cl += '<a class="clink" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer"><span class="ic">' + esc((s.label || '?')[0].toUpperCase()) + '</span><span>' + esc(s.label) + '</span></a>'; });
    html += '<section id="contact"><div class="container"><p class="eyebrow">' + t('contact') + '</p><h2 class="reveal">' + t('contE') + '</h2><div class="contact-grid"><div class="contact-links reveal"><p style="color:var(--mute);margin:0 0 6px">' + t('cdesc') + '</p>' + cl + '</div>' +
      '<form class="cf reveal" id="cf" novalidate><label>' + t('name') + '<input name="name" required maxlength="120" autocomplete="name"></label><label>' + t('email') + '<input name="email" type="email" required maxlength="200" autocomplete="email"></label><label>' + t('msg') + '<textarea name="message" required maxlength="5000"></textarea></label><input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn primary" type="submit">' + t('send') + '</button><div class="note" id="note" role="status"></div></form></div></div></section>';
    $('#app').innerHTML = html;
    $('#footer').textContent = '© ' + new Date().getFullYear() + ' ' + pick(p, 'name') + '. ' + t('rights');
    wire(); observe();
  }

  function wire() {
    document.querySelectorAll('[data-f]').forEach(function (b) { b.onclick = function () { filter = b.dataset.f; var y = scrollY; render(); scrollTo(0, y); }; });
    var f = $('#cf');
    f.onsubmit = function (e) {
      e.preventDefault();
      var n = $('#note'), d = Object.fromEntries(new FormData(f));
      if (!d.name.trim() || !d.message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { n.className = 'note err'; n.textContent = t('fail'); return; }
      n.className = 'note'; n.textContent = t('sending');
      n.className='note'; n.textContent=(lang==='ar'?'هذه نسخة معاينة ثابتة: نموذج التواصل يعمل بعد نشر الموقع الكامل بالخادم.':'Static preview: the contact form works once the full site is deployed with its server.');
    };
  }
  function observe() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: .08 });
    els.forEach(function (e) { io.observe(e); });
    var links = document.querySelectorAll('.nav a');
    var so = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) links.forEach(function (a) { a.classList.toggle('on', a.dataset.s === x.target.id); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
    SECTIONS.forEach(function (s) { var el = document.getElementById(s); if (el) so.observe(el); });
  }

  $('#lang').onclick = function () { lang = lang === 'ar' ? 'en' : 'ar'; localStorage.setItem('lang', lang); var y = scrollY; render(); scrollTo(0, y); };
  $('#theme').onclick = function () { var n = root.dataset.theme === 'dark' ? 'light' : 'dark'; root.dataset.theme = n; localStorage.setItem('theme', n); };
  $('#burger').onclick = function () { var o = $('#nav').classList.toggle('open'); this.setAttribute('aria-expanded', o); };
  $('#nav').onclick = function (e) { if (e.target.tagName === 'A') { this.classList.remove('open'); $('#burger').setAttribute('aria-expanded', false); } };

  fetch('./api-public.json').then(function (r) { return r.json(); }).then(function (d) {
    DATA = d; render();
    if (location.hash) { var el = document.getElementById(location.hash.slice(1)); if (el) setTimeout(function () { el.scrollIntoView(); }, 50); }
  });
})();
