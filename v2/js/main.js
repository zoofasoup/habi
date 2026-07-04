/* ==========================================================================
   Habi Herbal Alam — Landing Page v2  |  main.js
   Vanilla JS · No jQuery · Swiper 11 loaded via CDN
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------------------
     1. Mobile Navigation
     ----------------------------------------------------------------------- */
  const navHamburger = document.getElementById('nav-hamburger');
  const navOverlay   = document.getElementById('nav-overlay');

  if (navHamburger && navOverlay) {
    const toggleMenu = (forceClose = false) => {
      const isOpen = navHamburger.classList.contains('active');
      const shouldClose = forceClose || isOpen;

      navHamburger.classList.toggle('active', !shouldClose);
      navOverlay.classList.toggle('active', !shouldClose);
      navHamburger.setAttribute('aria-expanded', String(!shouldClose));
      document.body.style.overflow = shouldClose ? '' : 'hidden';
    };

    navHamburger.addEventListener('click', () => toggleMenu());

    // Close overlay when any link inside is clicked
    navOverlay.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        toggleMenu(true);
      }
    });

    // Close overlay on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
        toggleMenu(true);
      }
    });
  }


  /* -----------------------------------------------------------------------
     2. Sticky Nav Scroll Effect
     ----------------------------------------------------------------------- */
  const mainNav = document.getElementById('main-nav');

  if (mainNav) {
    const handleNavScroll = () => {
      mainNav.classList.toggle('nav--scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // run once on load
  }


  /* -----------------------------------------------------------------------
     3. Smooth Scroll
     ----------------------------------------------------------------------- */
  const NAV_OFFSET = 80;

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#' || targetId.length < 2) return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const top = targetEl.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  });


  /* -----------------------------------------------------------------------
     4. FAQ Accordion (single-open)
     ----------------------------------------------------------------------- */
  const faqContainer = document.querySelector('.faq');

  if (faqContainer) {
    const toggleFaq = (question) => {
      const answer    = question.nextElementSibling;
      const isOpen    = question.getAttribute('aria-expanded') === 'true';

      // Close every other open item first
      if (!isOpen) {
        faqContainer.querySelectorAll('.faq-item__question[aria-expanded="true"]').forEach((q) => {
          q.setAttribute('aria-expanded', 'false');
          if (q.nextElementSibling) q.nextElementSibling.classList.remove('open');
        });
      }

      question.setAttribute('aria-expanded', String(!isOpen));
      if (answer) answer.classList.toggle('open', !isOpen);
    };

    // Click delegation
    faqContainer.addEventListener('click', (e) => {
      const question = e.target.closest('.faq-item__question');
      if (question) toggleFaq(question);
    });

    // Keyboard support: Enter & Space
    faqContainer.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const question = e.target.closest('.faq-item__question');
      if (!question) return;
      e.preventDefault();
      toggleFaq(question);
    });
  }


  /* -----------------------------------------------------------------------
     5. Ingredient Card Expand
     ----------------------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.ingredient-card__toggle');
    if (!toggle) return;

    const detail = toggle.parentElement && toggle.parentElement.querySelector('.ingredient-card__detail');
    if (!detail) return;

    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    detail.classList.toggle('open', !isExpanded);
  });


  /* -----------------------------------------------------------------------
     6. Mobile CTA Bar (IntersectionObserver)
     ----------------------------------------------------------------------- */
  const mobileCta = document.getElementById('mobile-cta');
  const heroSection = document.getElementById('hero');

  if (mobileCta && heroSection) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        // When hero is NOT intersecting (scrolled past), show CTA
        mobileCta.classList.toggle('mobile-cta--visible', !entry.isIntersecting);
      },
      { threshold: 0 }
    );

    heroObserver.observe(heroSection);
  }


  /* -----------------------------------------------------------------------
     7. Scroll Fade-in Animations
     ----------------------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length) {
    const fadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    fadeEls.forEach((el) => fadeObserver.observe(el));
  }


  /* -----------------------------------------------------------------------
     8. Swiper Initialization
     ----------------------------------------------------------------------- */
  const swiperContainer = document.querySelector('.testimoni-swiper');

  if (swiperContainer && typeof Swiper !== 'undefined') {
    new Swiper('.testimoni-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        },
      },
    });
  }


  /* -----------------------------------------------------------------------
     9. Meta Pixel Event Tracking
     ----------------------------------------------------------------------- */

  // 9a. ViewContent — fire once when #produk scrolls into view
  const produkSection = document.getElementById('produk');

  if (produkSection) {
    const produkObserver = new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting) {
          if (typeof fbq === 'function') {
            fbq('track', 'ViewContent', {
              content_name: 'Habi Herbal Alam',
              content_type: 'product',
            });
          }
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    produkObserver.observe(produkSection);
  }

  // 9b. InitiateCheckout — any .buy-btn click
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.buy-btn');
    if (!btn) return;

    if (typeof fbq === 'function') {
      fbq('track', 'InitiateCheckout', {
        content_name: 'Habi Herbal Alam',
        content_category: btn.dataset.platform,
      });
    }
  });

  // 9c. AddToCart — any .pricing-card .btn--primary click
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.pricing-card .btn--primary');
    if (!btn) return;

    if (typeof fbq === 'function') {
      fbq('track', 'AddToCart', {
        content_name: 'Habi ' + btn.dataset.bundle + ' Botol',
      });
    }
  });

  // 9d. Contact — WhatsApp float button & WhatsApp buy-btn clicks
  document.addEventListener('click', (e) => {
    const waFloat = e.target.closest('.whatsapp-float, .wa-float');
    const waBuyBtn = e.target.closest('.buy-btn[data-platform="whatsapp"]');

    if (waFloat || waBuyBtn) {
      if (typeof fbq === 'function') {
        fbq('track', 'Contact', { content_name: 'WhatsApp' });
      }
    }
  });


  /* -----------------------------------------------------------------------
     10. UTM Parameters
     ----------------------------------------------------------------------- */
  const buyBtns = document.querySelectorAll('.buy-btn');

  buyBtns.forEach((btn) => {
    // Skip WhatsApp buttons
    if (btn.dataset.platform === 'whatsapp') return;

    const href = btn.getAttribute('href');
    if (!href) return;

    const utmParams = new URLSearchParams({
      utm_source:   'landingpage',
      utm_medium:   'website',
      utm_campaign: 'habi_lp',
      utm_content:  btn.dataset.platform || '',
    });

    const separator = href.includes('?') ? '&' : '?';
    btn.setAttribute('href', href + separator + utmParams.toString());
  });

});
