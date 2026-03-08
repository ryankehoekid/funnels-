/* ═══════════════════════════════════════════════
   THE WHOLE WOMAN RESET — Main JavaScript
   Scroll animations, accordion, smooth scroll
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Scroll-triggered animations ── */
  const animatedElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    animatedElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── Accordion ── */
  var accordionTriggers = document.querySelectorAll('.accordion__trigger');

  accordionTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = this.closest('.accordion__item');
      var isOpen = item.classList.contains('is-open');
      var accordion = item.closest('.accordion');

      // Close all siblings in the same accordion
      accordion.querySelectorAll('.accordion__item.is-open').forEach(function (openItem) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
      });

      // Toggle the clicked one (if it wasn't already open)
      if (!isOpen) {
        item.classList.add('is-open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
