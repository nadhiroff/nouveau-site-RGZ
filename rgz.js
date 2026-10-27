/* =====================================================================
   RGZ SARL — animations communes (index.html + offres.html)
   Barre de progression, en-tête au défilement, apparition des blocs,
   frise qui se dessine, compteurs. Sans IntersectionObserver, tout
   reste simplement visible.
   ===================================================================== */
(function () {
    'use strict';

    var root = document.documentElement;
    var header = document.querySelector('.top');

    /* ---------- Barre de progression de lecture + en-tête ---------- */
    var bar = document.createElement('div');
    bar.className = 'progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    function onScroll() {
        var h = root.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
        if (header) header.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Écran de chargement ---------- */
    var preloader = document.querySelector('.preloader');
    function hidePreloader() {
        if (preloader) preloader.classList.add('hide');
        root.classList.remove('is-loading');
    }
    if (document.readyState === 'complete') setTimeout(hidePreloader, 400);
    else window.addEventListener('load', function () { setTimeout(hidePreloader, 400); });
    setTimeout(hidePreloader, 3500);   // si une image ou un CDN traîne

    if (!('IntersectionObserver' in window)) return;

    /* ---------- Apparition au défilement ----------
       [sélecteur, sens] : les éléments frères apparaissent en cascade. */
    var GROUPS = [
        ['.wrap > .eyebrow, .wrap > h2, .wrap > .intro', ''],
        ['.about-grid > div > .eyebrow, .about-grid > div > h2, .about-grid > div > p', ''],
        ['.mission', 'left'],
        ['.pillars > div', ''],
        ['.photo', 'right'],
        ['.timeline > li', ''],
        ['.feature-partner', 'zoom'],
        ['.logos > div', ''],
        ['.quotes > blockquote', ''],
        ['.quotes-cta', ''],
        ['.to-offers .side:first-child', 'left'],
        ['.to-offers .side:last-child', 'right'],
        ['.jobs .wrap > div:first-child', 'left'],
        ['.jobs .wrap > div:last-child', 'right'],
        ['.contact-grid > div', ''],
        ['#map', 'zoom'],
        ['.services > .service', ''],
        ['.tabs, .plans, .devis', ''],
        ['.steps > li', ''],
        ['.faq > details', ''],
        ['.foot-grid > div', '']
    ];

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            var el = en.target;
            io.unobserve(el);
            el.classList.add('in');
            if (el.hasAttribute('data-count')) countUp(el);
            // Une fois apparu, le survol réagit sans délai
            var d = parseFloat(el.style.getPropertyValue('--d')) || 0;
            setTimeout(function () { el.classList.add('rv-done'); }, d * 1000 + 800);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    GROUPS.forEach(function (g) {
        document.querySelectorAll(g[0]).forEach(function (el) {
            if (el.closest('.hero')) return;
            var i = Array.prototype.indexOf.call(el.parentNode.children, el);
            el.classList.add('reveal');
            if (g[1]) el.classList.add('from-' + g[1]);
            el.style.setProperty('--d', Math.min(i, 6) * 0.09 + 's');
            io.observe(el);
        });
    });

    // Frise et surtitres : le trait se dessine
    document.querySelectorAll('.timeline, .eyebrow').forEach(function (el) {
        el.classList.add('draw');
        io.observe(el);
    });

    /* ---------- Compteurs (ex. 2016) ---------- */
    function countUp(el) {
        var end = parseInt(el.getAttribute('data-count'), 10);
        var start = Math.max(0, end - 60), t0 = null, dur = 1400;
        function step(t) {
            if (!t0) t0 = t;
            var p = Math.min((t - t0) / dur, 1);
            el.textContent = Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    document.querySelectorAll('[data-count]').forEach(function (el) { io.observe(el); });
})();
