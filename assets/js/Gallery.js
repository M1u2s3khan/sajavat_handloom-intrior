/* =========================================================
   Gallery.js — Filter + Lightbox (Bulletproof)
   ========================================================= */
(function () {
  'use strict';

  var grid = document.getElementById('galleryGrid');
  if (!grid) { console.warn('[Gallery] #galleryGrid not found'); return; }

  var items      = Array.prototype.slice.call(grid.querySelectorAll('.gitem'));
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
  var countEl    = document.getElementById('galleryCount');

  var visibleItems = items.slice();
  var currentIdx   = 0;

  /* ---------- lightbox refs ---------- */
  var lb = document.getElementById('lightbox');
  if (!lb) { console.warn('[Gallery] #lightbox not found'); return; }

  var lbImg     = document.getElementById('lbImg');
  var lbCap     = document.getElementById('lbCap');
  var lbCounter = document.getElementById('lbCounter');
  var lbClose   = lb.querySelector('.lb-close');
  var lbPrev    = lb.querySelector('.lb-prev');
  var lbNext    = lb.querySelector('.lb-next');

  /* ==========================================
     1. FILTER BUTTONS
     ========================================== */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var cat = btn.dataset.cat || 'all';
      console.log('[Gallery] Filter clicked →', cat);

      items.forEach(function (item) {
        var match = (cat === 'all') || (item.dataset.cat === cat);
        if (match) {
          item.classList.remove('is-hidden');
          item.style.display = '';          // inline fallback
          item.classList.remove('fade');
          void item.offsetWidth;            // reflow → fade restart
          item.classList.add('fade');
        } else {
          item.classList.add('is-hidden');
          item.style.display = 'none';      // inline fallback
          item.classList.remove('fade');
        }
      });

      visibleItems = items.filter(function (i) {
        return !i.classList.contains('is-hidden');
      });

      if (countEl) countEl.textContent = visibleItems.length;

      if (lb.classList.contains('open')) {
        if (!visibleItems.length) { closeLB(); }
        else { show(0); }
      }

      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ==========================================
     2. LIGHTBOX CORE
     ========================================== */
  function captionOf(item) {
    var cap = item.dataset.cap || '';
    var sub = item.dataset.sub || '';
    return sub ? (cap + ' — ' + sub) : cap;
  }

  function show(idx) {
    if (!visibleItems.length) return;
    currentIdx = (idx + visibleItems.length) % visibleItems.length;

    var item = visibleItems[currentIdx];
    var img  = item.querySelector('img');
    if (!img) return;

    lbImg.src             = img.src;
    lbImg.alt             = img.alt || '';
    if (lbCap)     lbCap.textContent     = captionOf(item);
    if (lbCounter) lbCounter.textContent = (currentIdx + 1) + ' / ' + visibleItems.length;
  }

  function openLB(item) {
    console.log('[Gallery] openLB →', item.dataset.cap);

    visibleItems = items.filter(function (i) {
      return !i.classList.contains('is-hidden');
    });
    var idx = visibleItems.indexOf(item);
    currentIdx = idx < 0 ? 0 : idx;

    show(currentIdx);

    // ✅ CLASS + INLINE STYLES (CSS pe depend nahi)
    lb.classList.add('open');
    lb.style.display       = 'flex';
    lb.style.opacity       = '1';
    lb.style.visibility    = 'visible';
    lb.style.pointerEvents = 'auto';
    lb.style.zIndex        = '99999';
    lb.style.position      = 'fixed';
    lb.style.inset         = '0';
    lb.style.alignItems    = 'center';
    lb.style.justifyContent= 'center';

    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLB() {
    lb.classList.remove('open');
    lb.style.display       = '';
    lb.style.opacity       = '';
    lb.style.visibility    = '';
    lb.style.pointerEvents = '';
    lb.style.zIndex        = '';
    lb.style.position      = '';
    lb.style.inset         = '';
    lb.style.alignItems    = '';
    lb.style.justifyContent= '';
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lbImg) lbImg.src = '';
  }

  function nextLB() { show(currentIdx + 1); }
  function prevLB() { show(currentIdx - 1); }

  /* ==========================================
     3. ITEM CLICK → OPEN LIGHTBOX
     ========================================== */
  items.forEach(function (item) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');

    item.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openLB(item);
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLB(item);
      }
    });
  });

  /* ==========================================
     4. LIGHTBOX CONTROLS
     ========================================== */
  if (lbClose) lbClose.addEventListener('click', function (e) {
    e.stopPropagation();
    closeLB();
  });

  if (lbNext) lbNext.addEventListener('click', function (e) {
    e.stopPropagation();
    nextLB();
  });

  if (lbPrev) lbPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    prevLB();
  });

  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('stage')) closeLB();
  });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLB();
    if (e.key === 'ArrowRight') nextLB();
    if (e.key === 'ArrowLeft')  prevLB();
  });

  /* ---------- mobile swipe ---------- */
  var touchX = 0;
  lb.addEventListener('touchstart', function (e) {
    touchX = e.changedTouches[0].clientX;
  }, { passive: true });

  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { dx < 0 ? nextLB() : prevLB(); }
  }, { passive: true });

  /* ---------- init counter ---------- */
  if (countEl) countEl.textContent = items.length;

  console.log('[Gallery] Ready — total items:', items.length);

})();