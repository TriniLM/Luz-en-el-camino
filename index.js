/**
 * LUZ EN EL CAMINO – Main JavaScript
 * Features:
 *  1. Sticky header with shadow on scroll
 *  2. Mobile hamburger menu toggle
 *  3. Smooth anchor scrolling
 *  4. Testimonials carousel with dot indicators
 *  5. Scroll animations via IntersectionObserver
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =============================================
     1. STICKY HEADER + SCROLL SHADOW
  ============================================== */
  const header     = document.getElementById('header');
  const SCROLL_THRESHOLD = 60;

  function onHeaderScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onHeaderScroll, { passive: true });
  onHeaderScroll(); // Run once on load


  /* =============================================
     2. MOBILE HAMBURGER MENU
  ============================================== */
  const hamburger   = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobile-drawer');

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileDrawer.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    mobileDrawer.setAttribute('aria-hidden', !open);
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close drawer when clicking a drawer link
  document.querySelectorAll('.mobile-drawer__link, .mobile-drawer__cta').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      toggleMenu(false);
    }
  });


  /* =============================================
     3. SMOOTH ANCHOR SCROLLING
  ============================================== */
  const HEADER_HEIGHT = 70; // px — matches CSS

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* =============================================
     4. TESTIMONIALS CAROUSEL (mobile: 1-up, desktop: 3-up grid)
  ============================================== */
  const track  = document.getElementById('testimonials-track');
  const dots   = document.querySelectorAll('.testimonials__dots .dot');
  const cards  = track ? Array.from(track.querySelectorAll('.testimonial-card')) : [];

  let currentSlide  = 0;
  let isMobileCarousel = false;
  let autoplayTimer = null;

  function isMobile() { return window.innerWidth < 768; }

  function showSlide(index) {
    if (!isMobileCarousel) return;

    // Clamp
    currentSlide = Math.max(0, Math.min(index, cards.length - 1));

    // Move track
    const offset = currentSlide * 100;
    track.style.transform = `translateX(-${offset}%)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('dot--active', i === currentSlide);
    });
  }

  function setupCarousel() {
    if (isMobile()) {
      // Mobile: horizontal scroll between single cards
      isMobileCarousel = true;
      track.style.display = 'flex';
      track.style.flexWrap = 'nowrap';
      track.style.transition = 'transform 0.45s ease';
      cards.forEach(card => {
        card.style.minWidth = '100%';
        card.style.flex    = '0 0 100%';
      });
      showSlide(currentSlide);
      startAutoplay();
    } else {
      // Desktop: grid layout (CSS handles it)
      isMobileCarousel = false;
      track.style.display   = '';
      track.style.transform = '';
      track.style.transition = '';
      cards.forEach(card => { card.style.minWidth = ''; card.style.flex = ''; });
      stopAutoplay();
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      const next = (currentSlide + 1) % cards.length;
      showSlide(next);
    }, 4000);
  }

  function stopAutoplay() {
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }

  // Dot click handlers
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      showSlide(idx);
      startAutoplay(); // reset timer on manual nav
    });
  });

  // Touch/swipe on carousel track
  let touchStartX = 0;
  if (track) {
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const delta = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        showSlide(delta > 0 ? currentSlide + 1 : currentSlide - 1);
      }
      startAutoplay();
    }, { passive: true });
  }

  // Responsive setup
  setupCarousel();
  window.addEventListener('resize', setupCarousel, { passive: true });


  /* =============================================
     5. SCROLL ANIMATIONS – IntersectionObserver
  ============================================== */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, observerOptions);

  // Observe all .fade-in elements
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

}); // end DOMContentLoaded
