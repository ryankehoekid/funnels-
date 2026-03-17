/* ═══════════════════════════════════════════════
   THE WHOLE WOMAN RESET — Main JavaScript
   Scroll animations, accordion, smooth scroll,
   parallax, animated counters
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Scroll-triggered animations ── */
  var animatedElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
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
    animatedElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── Animated number counters ── */
  var statNumbers = document.querySelectorAll('.stats-bar__number');

  function animateCounter(el) {
    var text = el.textContent.trim();
    var match = text.match(/^([\d,]+(?:\.\d+)?)/);
    if (!match) return;

    var suffix = text.replace(match[0], '');
    var target = parseFloat(match[0].replace(/,/g, ''));
    var isDecimal = match[0].indexOf('.') !== -1;
    var decimalPlaces = isDecimal ? match[0].split('.')[1].length : 0;
    var duration = 1800;
    var start = performance.now();

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;

      if (isDecimal) {
        el.textContent = current.toFixed(decimalPlaces) + suffix;
      } else {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = text; // Ensure exact final value
      }
    }

    requestAnimationFrame(update);
  }

  if (statNumbers.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ── Sticky CTA bar ── */
  var stickyCta = document.getElementById('sticky-cta');
  var heroSection = document.querySelector('.hero');
  var pricingSection = document.getElementById('pricing');

  if (stickyCta && heroSection) {
    var stickyTicking = false;

    window.addEventListener('scroll', function () {
      if (!stickyTicking) {
        requestAnimationFrame(function () {
          var scrolled = window.pageYOffset;
          var heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
          var pricingTop = pricingSection ? pricingSection.offsetTop - window.innerHeight : Infinity;

          if (scrolled > heroBottom && scrolled < pricingTop) {
            stickyCta.classList.add('is-visible');
          } else {
            stickyCta.classList.remove('is-visible');
          }

          stickyTicking = false;
        });
        stickyTicking = true;
      }
    }, { passive: true });
  }

  /* ── Subtle parallax on hero background ── */
  var heroBg = document.querySelector('.hero__bg-pattern');
  var hero = document.querySelector('.hero');

  if (heroBg && hero) {
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrolled = window.pageYOffset;
          var heroHeight = hero.offsetHeight;

          if (scrolled < heroHeight) {
            heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Accordion ── */
  var accordionTriggers = document.querySelectorAll('.accordion__trigger');

  accordionTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = this.closest('.accordion__item');
      var isOpen = item.classList.contains('is-open');
      var accordion = item.closest('.accordion');

      accordion.querySelectorAll('.accordion__item.is-open').forEach(function (openItem) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
      });

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

  /* ── Spots counter (urgency/scarcity) ── */
  var spotsEl = document.getElementById('spots-taken');
  var fillEl = document.getElementById('spots-fill');
  var totalSpots = 20;

  if (spotsEl && fillEl) {
    // Time-based count: everyone sees the same number at the same time.
    // Set your launch date here (midnight UTC). Spots climb gradually over days.
    var launchDate = new Date('2026-03-17T00:00:00Z');
    var now = Date.now();
    var hoursSinceLaunch = Math.max(0, (now - launchDate.getTime()) / (1000 * 60 * 60));

    // Base growth: starts at ~4, gains roughly 1 spot every 8 hours
    // Slows down as it gets higher (logarithmic feel)
    var base = 4 + (hoursSinceLaunch / 8);

    // Add a small wobble based on hour-of-day so it dips occasionally
    // Uses a simple sine wave tied to the current hour for natural fluctuation
    var hourOfDay = new Date().getUTCHours();
    var wobble = Math.sin(hourOfDay * 0.8) * 1.2; // swings between -1.2 and +1.2

    var spots = Math.round(base + wobble);

    // Clamp: never below 4, never above 18 (always room, never full)
    spots = Math.max(4, Math.min(18, spots));

    function updateDisplay(n) {
      spotsEl.textContent = n;
      fillEl.style.width = ((n / totalSpots) * 100) + '%';
    }

    updateDisplay(spots);

    // Optional: one subtle tick while they're on the page (up by 1, once)
    // Only if they've been reading for 2-5 minutes and there's room
    if (spots < 18) {
      var tickDelay = (120 + Math.random() * 180) * 1000; // 2-5 min
      setTimeout(function () {
        spots++;
        updateDisplay(spots);
      }, tickDelay);
    }
  }
})();
