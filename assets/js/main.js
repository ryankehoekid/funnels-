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
  var totalSpots = 25;

  if (spotsEl && fillEl) {
    // Extension: original 20 sold out, 5 more reopened on March 19
    var extensionStart = new Date('2026-03-19T09:00:00Z');
    var now = Date.now();
    var hoursSinceExtension = Math.max(0, (now - extensionStart.getTime()) / (1000 * 60 * 60));

    // Extension spots fill over ~36 hours: 20 base + 0-5 new
    var progress = Math.min(hoursSinceExtension / 36, 1);
    var extensionFilled = Math.floor(5 * Math.pow(progress, 0.7));

    // Small wobble
    var hourOfDay = new Date().getUTCHours();
    var wobble = Math.sin(hourOfDay * 0.8) * 0.4;
    extensionFilled = Math.round(extensionFilled + wobble);
    extensionFilled = Math.max(0, Math.min(4, extensionFilled));

    var spots = 20 + extensionFilled;

    function updateDisplay(n) {
      spotsEl.textContent = n;
      fillEl.style.width = ((n / totalSpots) * 100) + '%';
    }

    updateDisplay(spots);

    // One subtle +1 tick after 2-5 min on page
    if (spots < 24) {
      var tickDelay = (120 + Math.random() * 180) * 1000;
      setTimeout(function () {
        spots++;
        updateDisplay(spots);
      }, tickDelay);
    }
  }

  /* ── Countdown timer (midnight GMT today) ── */
  var countdownEl = document.getElementById('countdown-display');
  if (countdownEl) {
    // Extension deadline: Friday 21st March 2026 at 9pm GMT
    var deadline = new Date('2026-03-21T21:00:00Z');

    function updateCountdown() {
      var now = Date.now();
      var diff = deadline.getTime() - now;

      if (diff <= 0) {
        countdownEl.textContent = 'CLOSED';
        return;
      }

      var hours = Math.floor(diff / (1000 * 60 * 60));
      var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var secs = Math.floor((diff % (1000 * 60)) / 1000);

      countdownEl.textContent =
        String(hours).padStart(2, '0') + ':' +
        String(mins).padStart(2, '0') + ':' +
        String(secs).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
  /* ── Social proof toast ── */
  var toastEl = document.getElementById('social-proof-toast');
  var nameEl = document.getElementById('social-proof-name');
  var cityEl = document.getElementById('social-proof-city');
  var closeBtn = document.getElementById('social-proof-close');

  if (toastEl && nameEl && cityEl) {
    // 500 common UK women's names (popular 1976–1996, now aged 30–50)
    var names = [
      'Sarah','Emma','Laura','Claire','Lisa','Rachel','Nicola','Rebecca','Michelle','Victoria',
      'Samantha','Louise','Amy','Jennifer','Charlotte','Helen','Karen','Gemma','Hannah','Lucy',
      'Kerry','Joanne','Kelly','Katie','Natalie','Donna','Andrea','Tracy','Sharon','Julie',
      'Susan','Amanda','Danielle','Stacey','Hayley','Jade','Leanne','Caroline','Alison','Marie',
      'Catherine','Jodie','Abigail','Sophie','Holly','Lauren','Jessica','Anna','Stephanie','Ruth',
      'Melissa','Deborah','Heather','Vicky','Wendy','Fiona','Tracey','Dawn','Diane','Mandy',
      'Alexandra','Beverley','Zoe','Kimberley','Michaela','Lorraine','Tanya','Kirsty','Kate',
      'Jemma','Natasha','Elaine','Paula','Sandra','Janet','Kayleigh','Nina','Teresa','Jane',
      'Tina','Jacqueline','Denise','Maria','Lindsey','Lyndsey','Gillian','Colleen','Yvonne',
      'Chloe','Bethany','Amber','Megan','Ashleigh','Harriet','Lydia','Martha','Rosie','Eleanor',
      'Francesca','Georgia','Phoebe','Isobel','Ella','Olivia','Molly','Emily','Grace','Erin',
      'Faye','Cara','Becky','Sian','Siobhan','Sinead','Aisling','Roisin','Niamh','Ciara',
      'Aoife','Orla','Maeve','Deirdre','Bridget','Eileen','Caitlin','Rhian','Bethan','Cerys',
      'Megan','Angharad','Ffion','Lowri','Catrin','Nia','Seren','Bronwen','Gwen','Anwen',
      'Lynne','Jan','Sue','Pat','Joy','Ann','Jean','Mary','Carol','Linda',
      'Christine','Margaret','Brenda','Pamela','Maureen','Janice','Gloria','Sheila','Irene','Valerie',
      'Rosemary','Annette','Jill','Lesley','Moira','Bridgette','Theresa','Bernadette','Antoinette','Felicity',
      'Penelope','Philippa','Arabella','Annabel','Imogen','Serena','Tabitha','Lucinda','Hermione','Camilla',
      'Matilda','Beatrice','Cordelia','Cecilia','Prudence','Agnes','Adelaide','Flora','Millicent','Winifred',
      'Marjorie','Dorothy','Edith','Gladys','Elsie','Mabel','Ethel','Ivy','Hilda','Ada',
      'Poppy','Isla','Ruby','Lily','Daisy','Willow','Freya','Ivy','Elsie','Evie',
      'Scarlett','Sienna','Alice','Florence','Lola','Millie','Maisie','Eva','Esme','Aria',
      'Thea','Bella','Luna','Robyn','Mia','Layla','Aisha','Priya','Ananya','Nadia',
      'Fatima','Amira','Yasmin','Leila','Sara','Hana','Reem','Dina','Maya','Noor',
      'Aaliyah','Zara','Farida','Sana','Amal','Maryam','Khadija','Ruqayyah','Hafsa','Aisha',
      'Priyanka','Kavita','Sunita','Anita','Rina','Meera','Deepa','Pooja','Neha','Swati',
      'Sneha','Divya','Shilpa','Nisha','Rekha','Geeta','Shalini','Anjali','Jyoti','Aarti',
      'Lian','Mei','Xia','Ying','Jing','Chen','Wei','Fang','Yan','Hua',
      'Abbie','Adele','Adrienne','Agatha','Aggie','Ailsa','Aimee','Ainsley','Alexa','Alexis',
      'Alma','Althea','Alyssa','Amara','Amelie','Andie','Angel','Angie','Annie','Anya',
      'April','Ariana','Ashlee','Audrey','Aurora','Autumn','Ava','Avery','Barbara','Belle',
      'Bernice','Bess','Beth','Bianca','Blair','Bonnie','Brenda','Brianna','Britt','Brooke',
      'Bryony','Candice','Carla','Carlene','Carmen','Carole','Cassandra','Cassie','Celeste','Chantal',
      'Charity','Charlene','Chelsea','Cherie','Cheryl','Christina','Claudia','Colette','Connie','Coral',
      'Courtney','Crystal','Cynthia','Dahlia','Danica','Darcy','Darlene','Delia','Demi','Desiree',
      'Diana','Dolly','Dominique','Dora','Eden','Edie','Effie','Elena','Elise','Elizabeth',
      'Ellie','Eloise','Elsa','Emilia','Erica','Estelle','Esther','Eugenie','Eve','Evelyn',
      'Faith','Felicia','Fern','Fleur','Frankie','Freya','Gabby','Gabriella','Gail','Gaynor',
      'Genevieve','Georgie','Geraldine','Gina','Ginny','Giselle','Gracie','Greta','Gwendoline','Halima',
      'Harper','Harriet','Hazel','Heidi','Helena','Henrietta','Hope','Ida','Ines','Ingrid',
      'Iris','Isabella','Isadora','Ivy','Jacinta','Jackie','Jaime','Jamie','Janine','Jasmine',
      'Jeanette','Jenna','Jessie','Joan','Jocelyn','Josie','Judith','Julia','Juliet','June',
      'Justine','Kara','Karina','Katherine','Kathleen','Katrina','Kay','Keira','Kelsey','Kim',
      'Kirsten','Kitty','Kristen','Kristina','Lara','Latoya','Lea','Leah','Lena','Letitia',
      'Libby','Lilian','Lily','Lindsay','Liz','Lizzie','Lottie','Louisa','Lucia','Lucille',
      'Lydia','Madeleine','Maggie','Maisy','Mallory','Marcia','Margot','Marianne','Marissa','Marlene',
      'Martina','Maxine','Meredith','Mia','Miranda','Miriam','Monica','Morgan','Muriel','Myrtle',
      'Nadine','Nancy','Naomi','Nell','Nessa','Nicky','Nicole','Nora','Noreen','Olive',
      'Oona','Paige','Paloma','Patricia','Patsy','Pearl','Peggy','Penny','Petra','Pippa'
    ];

    // 80 UK cities & towns for variety
    var cities = [
      'London','Manchester','Birmingham','Leeds','Liverpool','Bristol','Sheffield','Edinburgh',
      'Glasgow','Cardiff','Belfast','Newcastle','Nottingham','Leicester','Brighton','Southampton',
      'Oxford','Cambridge','Reading','Exeter','Bath','York','Chester','Canterbury',
      'Coventry','Derby','Plymouth','Stoke-on-Trent','Wolverhampton','Sunderland','Swansea','Aberdeen',
      'Dundee','Inverness','Perth','Stirling','Cheltenham','Bournemouth','Portsmouth','Norwich',
      'Ipswich','Colchester','Milton Keynes','Northampton','Peterborough','Lincoln','Gloucester','Worcester',
      'Hereford','Shrewsbury','Stafford','Warwick','Stratford-upon-Avon','Harrogate','Scarborough','Blackpool',
      'Preston','Lancaster','Carlisle','Durham','Middlesbrough','Huddersfield','Halifax','Wakefield',
      'Bradford','Bolton','Stockport','Wigan','Luton','Watford','St Albans','Guildford',
      'Maidstone','Tunbridge Wells','Eastbourne','Hastings','Salisbury','Taunton','Torquay','Truro'
    ];

    // Time labels for realism
    var timesAgo = [
      '2 minutes ago', '3 minutes ago', '5 minutes ago', '8 minutes ago',
      '12 minutes ago', '15 minutes ago', '22 minutes ago', '30 minutes ago',
      '45 minutes ago', '1 hour ago', '2 hours ago', '3 hours ago'
    ];

    function pickRandom(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function showToast() {
      nameEl.textContent = pickRandom(names);
      cityEl.textContent = pickRandom(cities);
      toastEl.classList.add('is-visible');

      // Auto-hide after 5 seconds
      setTimeout(function () {
        toastEl.classList.remove('is-visible');
      }, 5000);
    }

    // Close button
    closeBtn.addEventListener('click', function () {
      toastEl.classList.remove('is-visible');
    });

    // First toast: show after 8-15 seconds on page
    var firstDelay = (8 + Math.random() * 7) * 1000;
    setTimeout(function () {
      showToast();

      // Subsequent toasts every 55-90 seconds (feels natural, not spammy)
      setInterval(function () {
        showToast();
      }, (55 + Math.random() * 35) * 1000);
    }, firstDelay);
  }
})();
