/* ============================================================
   CYLIO — Premium Motion System
   GSAP + ScrollTrigger + SplitType + Lenis
   ============================================================ */

(function () {
  'use strict';

  // ──────────────────────────────────────
  // 0. REDUCED MOTION DETECTION
  // ──────────────────────────────────────
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var prefersReducedMotion = reducedMotionQuery.matches;
  var isMobile = window.innerWidth < 768;
  var lenis = null;
  var loaderActive = false;

  // Update isMobile on resize and orientation change
  var updateMobileState = function () {
    var wasMobile = isMobile;
    isMobile = window.innerWidth < 768;

    // Transitioning desktop → mobile: destroy Lenis
    if (!wasMobile && isMobile && lenis) {
      lenis.destroy();
      lenis = null;
      document.documentElement.style.scrollBehavior = '';
    }

    // Transitioning mobile → desktop: init Lenis if applicable
    if (wasMobile && !isMobile && !lenis && !prefersReducedMotion && typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.1,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smoothWheel: true,
        smoothTouch: false
      });
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      lenis.on('scroll', ScrollTrigger.update);
      document.documentElement.style.scrollBehavior = 'auto';
    }
  };

  window.addEventListener('resize', updateMobileState);
  window.addEventListener('orientationchange', function () {
    setTimeout(updateMobileState, 150);
  });

  // If reduced motion, make everything visible immediately and skip animation setup
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal, .reveal-fade').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.stagger > *').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // ──────────────────────────────────────
  // 1. GSAP + SCROLLTRIGGER SETUP
  // ──────────────────────────────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 0.8 });
  }

  // ──────────────────────────────────────
  // 1a. PAGE LOADER
  // ──────────────────────────────────────
  var loader = document.querySelector('.page-loader');

  if (loader && !prefersReducedMotion && typeof gsap !== 'undefined') {
    var sessionKey = 'cylio_loaded';

    if (sessionStorage.getItem(sessionKey)) {
      // Already shown this session — remove instantly
      loader.remove();
    } else {
      sessionStorage.setItem(sessionKey, '1');
      loaderActive = true;
      document.documentElement.classList.add('page-loader-active');

      var loaderWordmark = loader.querySelector('.page-loader__wordmark');
      var loaderCounter = loader.querySelector('.page-loader__counter');
      var loaderLineFill = loader.querySelector('.page-loader__line-fill');
      var loaderContent = loader.querySelector('.page-loader__content');
      var loaderProgress = loader.querySelector('.page-loader__progress');
      var panelTop = loader.querySelector('.page-loader__panel--top');
      var panelBottom = loader.querySelector('.page-loader__panel--bottom');

      // Breathing animation on wordmark during loading
      var breathe = gsap.to(loaderWordmark, {
        scale: 1.015,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Main loader timeline
      var loaderTl = gsap.timeline({
        onComplete: function () {
          loader.remove();
          document.documentElement.classList.remove('page-loader-active');
          window.dispatchEvent(new Event('cylio:loader-done'));
        }
      });

      // Phase 1: Entrance — counter fades in
      loaderTl.to(loaderCounter, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      }, 0.1);

      // Phase 2: Loading — counter 0→100 + progress line fills
      var counterObj = { value: 0 };
      loaderTl.to(counterObj, {
        value: 100,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function () {
          loaderCounter.textContent = Math.floor(counterObj.value);
        }
      }, 0.3);

      loaderTl.to(loaderLineFill, {
        scaleX: 1,
        duration: 2,
        ease: 'power2.out'
      }, 0.3);

      // Phase 3: Completion — stop breathing, fade out content
      loaderTl.add(function () { breathe.kill(); });
      loaderTl.to({}, { duration: 0.2 }); // dramatic pause

      loaderTl.to(loaderWordmark, {
        scale: 1.05,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      });

      loaderTl.to(loaderProgress, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, '<');

      // Phase 4: Split-curtain reveal
      loaderTl.to(panelTop, {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut'
      }, '-=0.1');

      loaderTl.to(panelBottom, {
        yPercent: 100,
        duration: 1.2,
        ease: 'power4.inOut'
      }, '<');
    }
  } else if (loader) {
    // Reduced motion or no GSAP: remove loader immediately
    loader.remove();
  }

  // ──────────────────────────────────────
  // 2. LENIS SMOOTH SCROLL
  // ──────────────────────────────────────
  if (!prefersReducedMotion && !isMobile && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      smoothTouch: false
    });

    // Connect Lenis to GSAP ticker
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Connect Lenis scroll to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Override html scroll-behavior so Lenis controls it
    document.documentElement.style.scrollBehavior = 'auto';
  }

  // ──────────────────────────────────────
  // 3. NAVIGATION
  // ──────────────────────────────────────
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  var overlay = document.querySelector('.nav__overlay');
  var closeBtn = document.querySelector('.nav__overlay-close');

  // 3a. Nav scroll background + direction-based show/hide
  if (nav && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    var lastScrollY = 0;
    var scrollThreshold = 300;

    ScrollTrigger.create({
      start: 1,
      end: 'max',
      onUpdate: function (self) {
        var currentY = self.scroll();

        // Background effect
        nav.classList.toggle('scrolled', currentY > 60);

        // Direction-based hide/show (only after threshold)
        if (currentY > scrollThreshold) {
          if (self.direction === 1) {
            nav.classList.add('nav--hidden');
          } else {
            nav.classList.remove('nav--hidden');
          }
        } else {
          nav.classList.remove('nav--hidden');
        }

        lastScrollY = currentY;
      }
    });
  } else if (nav) {
    // Fallback for reduced motion: simple scroll listener for background only
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 3b. Mobile menu toggle with focus trap
  if (toggle && overlay) {
    toggle.setAttribute('aria-expanded', 'false');
    var focusableEls = null;
    var firstFocusable = null;
    var lastFocusable = null;

    var openMenu = function () {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      // GSAP-enhanced opening
      if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        var links = overlay.querySelectorAll('.nav__overlay-link');
        var tl = gsap.timeline();
        tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        tl.fromTo(links, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '-=0.2');
        if (closeBtn) {
          tl.fromTo(closeBtn, { opacity: 0 }, { opacity: 1, duration: 0.3 }, '-=0.3');
        }
      }

      // Focus management
      focusableEls = overlay.querySelectorAll('a, button');
      firstFocusable = focusableEls[0];
      lastFocusable = focusableEls[focusableEls.length - 1];
      if (closeBtn) closeBtn.focus();
    };

    var closeMenu = function () {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.25,
          onComplete: function () {
            overlay.classList.remove('is-open');
            overlay.style.opacity = '';
            document.body.style.overflow = '';
          }
        });
      } else {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      }
      toggle.focus();
    };

    toggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.querySelectorAll('.nav__overlay-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Focus trap + Escape key
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key === 'Tab' && focusableEls) {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }

  // ──────────────────────────────────────
  // 4. HERO ENTRANCE
  // ──────────────────────────────────────
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    var heroDisplay = document.querySelector('.hero .display');
    var heroSubtitle = document.querySelector('.hero__subtitle');
    var heroScroll = document.querySelector('.hero__scroll');

    if (heroDisplay) {
      // Remove CSS-based reveal classes — GSAP takes over
      heroDisplay.classList.remove('reveal');
      heroDisplay.style.opacity = '0';
      if (heroSubtitle) {
        heroSubtitle.classList.remove('reveal');
        heroSubtitle.style.removeProperty('transition-delay');
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(20px)';
      }
      if (heroScroll) {
        heroScroll.style.opacity = '0';
      }

      // Gate on font loading to prevent FOUT during text split
      var runHeroAnimation = function () {
        var heroTl = gsap.timeline({ delay: 0.2 });

        // SplitType on hero heading (skip on mobile for performance)
        if (typeof SplitType !== 'undefined' && !isMobile) {
          var split = new SplitType(heroDisplay, { types: 'words' });
          gsap.set(split.words, { opacity: 0, y: 40 });
          heroDisplay.style.opacity = '1';
          heroTl.to(split.words, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.06,
            ease: 'power3.out'
          });
        } else {
          // Mobile or no SplitType: animate as block
          gsap.set(heroDisplay, { opacity: 0, y: 30 });
          heroDisplay.style.opacity = '';
          heroTl.to(heroDisplay, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        }

        // Subtitle
        if (heroSubtitle) {
          heroTl.to(heroSubtitle, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
          }, '-=0.5');
        }

        // Scroll indicator
        if (heroScroll) {
          heroTl.to(heroScroll, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out'
          }, '-=0.3');
        }
      };

      if (loaderActive) {
        // Wait for loader to finish, then run hero animation
        window.addEventListener('cylio:loader-done', runHeroAnimation);
      } else if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(runHeroAnimation);
      } else {
        // Fallback for older browsers
        setTimeout(runHeroAnimation, 300);
      }

      // Scroll indicator fade-out on scroll
      if (heroScroll) {
        gsap.to(heroScroll, {
          opacity: 0,
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '+=200',
            scrub: true
          }
        });
      }

      // Subtle parallax on subtitle (desktop only)
      if (heroSubtitle && !isMobile) {
        gsap.to(heroSubtitle, {
          y: -20,
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }
  }

  // ──────────────────────────────────────
  // 5. SCROLL REVEALS
  // ──────────────────────────────────────
  if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

    // Helper: set initial hidden state and animate on scroll
    var revealOnScroll = function (selector, animProps, triggerStart) {
      var elements = document.querySelectorAll(selector);
      elements.forEach(function (el) {
        // Skip hero elements (handled in Section 4)
        if (el.closest('.hero')) return;

        el.classList.remove('reveal');
        el.classList.remove('reveal-fade');
        gsap.set(el, { opacity: 0, y: animProps.y || 0 });

        gsap.to(el, Object.assign({
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: el,
            start: triggerStart || 'top 85%',
            once: true
          }
        }, animProps));
      });
    };

    // 5a. Section headers — waterfall: label → h2 → intro
    document.querySelectorAll('.section-header').forEach(function (header) {
      if (header.closest('.hero')) return;
      header.classList.remove('reveal');

      var label = header.querySelector('.label');
      var h2 = header.querySelector('h2');
      var intro = header.querySelector('.section-header__intro');

      var headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          once: true
        }
      });

      if (label) {
        gsap.set(label, { opacity: 0, y: 15 });
        headerTl.to(label, { opacity: 1, y: 0, duration: 0.5 });
      }

      if (h2) {
        if (typeof SplitType !== 'undefined' && !isMobile) {
          var split = new SplitType(h2, { types: 'words' });
          gsap.set(split.words, { opacity: 0, y: 20 });
          headerTl.to(split.words, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.04,
            ease: 'power3.out'
          }, label ? '-=0.2' : 0);
        } else {
          gsap.set(h2, { opacity: 0, y: 20 });
          headerTl.to(h2, { opacity: 1, y: 0, duration: 0.8 }, label ? '-=0.2' : 0);
        }
      }

      if (intro) {
        gsap.set(intro, { opacity: 0, y: 20 });
        headerTl.to(intro, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
      }
    });

    // 5b. Service items — batched stagger with number micro-animation
    var serviceItems = document.querySelectorAll('.service-item');
    if (serviceItems.length) {
      serviceItems.forEach(function (item) {
        item.closest('.stagger') && item.closest('.stagger').classList.remove('stagger');
        gsap.set(item, { opacity: 0, y: 25 });
        var num = item.querySelector('.service-item__number');
        if (num) gsap.set(num, { opacity: 0, x: -10 });
      });

      ScrollTrigger.batch(serviceItems, {
        start: 'top 90%',
        interval: 0.1,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out'
          });
          batch.forEach(function (item) {
            var num = item.querySelector('.service-item__number');
            if (num) {
              gsap.to(num, { opacity: 1, x: 0, duration: 0.5, delay: 0.05, ease: 'power2.out' });
            }
          });
        }
      });
    }

    // 5c. Work items — batched stagger
    var workItems = document.querySelectorAll('.work-item');
    if (workItems.length) {
      workItems.forEach(function (item) {
        var parent = item.parentElement;
        if (parent && parent.classList.contains('stagger')) parent.classList.remove('stagger');
        gsap.set(item, { opacity: 0, y: 30 });
      });

      // SplitType on work titles in portfolio page only
      var isPortfolioPage = document.querySelector('.hero .display') &&
        document.querySelector('.hero .display').textContent.trim().toLowerCase().indexOf('our work') > -1;

      ScrollTrigger.batch(workItems, {
        start: 'top 88%',
        interval: 0.15,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out'
          });
        }
      });
    }

    // 5d. Testimonials — sequential: mark → quote → author
    document.querySelectorAll('.testimonial').forEach(function (testimonial) {
      testimonial.classList.remove('reveal');
      var mark = testimonial.querySelector('.testimonial__mark');
      var quote = testimonial.querySelector('.testimonial__quote');
      var author = testimonial.querySelector('.testimonial__author');
      var role = testimonial.querySelector('.testimonial__role');

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: testimonial,
          start: 'top 80%',
          once: true
        }
      });

      if (mark) {
        gsap.set(mark, { opacity: 0, scale: 0.8 });
        tl.to(mark, { opacity: 0.15, scale: 1, duration: 0.6, ease: 'power2.out' });
      }

      if (quote) {
        gsap.set(quote, { opacity: 0, y: 25 });
        tl.to(quote, { opacity: 1, y: 0, duration: 0.9 }, mark ? '-=0.3' : 0);
      }

      if (author) {
        gsap.set(author, { opacity: 0, y: 10 });
        tl.to(author, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
      }

      if (role) {
        gsap.set(role, { opacity: 0, y: 10 });
        tl.to(role, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4');
      }
    });

    // 5e. CTA section — heading split + link/button
    document.querySelectorAll('.cta').forEach(function (cta) {
      if (cta.closest('.hero')) return;
      cta.classList.remove('reveal');
      var heading = cta.querySelector('.cta__heading');
      var link = cta.querySelector('.cta__link') || cta.querySelector('.btn');

      var ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: cta,
          start: 'top 80%',
          once: true
        }
      });

      if (heading) {
        if (typeof SplitType !== 'undefined' && !isMobile) {
          var split = new SplitType(heading, { types: 'words' });
          gsap.set(split.words, { opacity: 0, y: 25 });
          ctaTl.to(split.words, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.05,
            ease: 'power3.out'
          });
        } else {
          gsap.set(heading, { opacity: 0, y: 25 });
          ctaTl.to(heading, { opacity: 1, y: 0, duration: 0.9 });
        }
      }

      if (link) {
        gsap.set(link, { opacity: 0, y: 15 });
        ctaTl.to(link, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');
      }
    });

    // 5f. Values items — batched stagger
    var valuesItems = document.querySelectorAll('.values-item');
    if (valuesItems.length) {
      valuesItems.forEach(function (item) {
        var parent = item.parentElement;
        if (parent && parent.classList.contains('stagger')) parent.classList.remove('stagger');
        gsap.set(item, { opacity: 0, y: 20 });
      });

      ScrollTrigger.batch(valuesItems, {
        start: 'top 90%',
        interval: 0.1,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out'
          });
        }
      });
    }

    // 5g. Job items — batched stagger
    var jobItems = document.querySelectorAll('.job-item');
    if (jobItems.length) {
      jobItems.forEach(function (item) {
        var parent = item.parentElement;
        if (parent && parent.classList.contains('stagger')) parent.classList.remove('stagger');
        gsap.set(item, { opacity: 0, y: 20 });
      });

      ScrollTrigger.batch(jobItems, {
        start: 'top 90%',
        interval: 0.1,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out'
          });
        }
      });
    }

    // 5g-ii. Industry items — batched stagger
    var industryItems = document.querySelectorAll('.industry-item');
    if (industryItems.length) {
      industryItems.forEach(function (item) {
        var parent = item.parentElement;
        if (parent && parent.classList.contains('stagger')) parent.classList.remove('stagger');
        gsap.set(item, { opacity: 0, y: 20 });
      });

      ScrollTrigger.batch(industryItems, {
        start: 'top 90%',
        interval: 0.1,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out'
          });
        }
      });
    }

    // 5g-iii. FAQ items — batched stagger
    var faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
      faqItems.forEach(function (item) {
        var parent = item.parentElement;
        if (parent && parent.classList.contains('stagger')) parent.classList.remove('stagger');
        gsap.set(item, { opacity: 0, y: 20 });
      });

      ScrollTrigger.batch(faqItems, {
        start: 'top 90%',
        interval: 0.1,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out'
          });
        }
      });
    }

    // 5h. Legal cards — batched fade
    var legalCards = document.querySelectorAll('.legal-card');
    if (legalCards.length) {
      legalCards.forEach(function (card) {
        gsap.set(card, { opacity: 0, y: 15 });
      });

      ScrollTrigger.batch(legalCards, {
        start: 'top 92%',
        interval: 0.08,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: 'power2.out'
          });
        }
      });
    }

    // 5h-catch. Generic .stagger catch-all (logo-strip, stat-item, team-member, etc.)
    document.querySelectorAll('.stagger').forEach(function (container) {
      var children = Array.from(container.children);
      container.classList.remove('stagger');
      children.forEach(function (child) {
        gsap.set(child, { opacity: 0, y: 20 });
      });
      ScrollTrigger.batch(children, {
        start: 'top 90%',
        interval: 0.1,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out'
          });
        }
      });
    });

    // 5i. Generic .reveal elements (catch-all for any not already handled)
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.closest('.hero')) return;
      if (el.classList.contains('section-header')) return;
      if (el.classList.contains('testimonial')) return;
      if (el.classList.contains('cta')) return;

      gsap.set(el, { opacity: 0, y: 30 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      });
    });

    // 5j. Generic .reveal-fade elements
    document.querySelectorAll('.reveal-fade').forEach(function (el) {
      gsap.set(el, { opacity: 0 });
      gsap.to(el, {
        opacity: 1,
        duration: 0.7,
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          once: true
        }
      });
    });

    // 5k. More articles items — stagger
    var moreArticles = document.querySelectorAll('.more-articles__item');
    if (moreArticles.length) {
      moreArticles.forEach(function (item) {
        gsap.set(item, { opacity: 0, y: 15 });
      });

      ScrollTrigger.batch(moreArticles, {
        start: 'top 90%',
        interval: 0.1,
        onEnter: function (batch) {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out'
          });
        }
      });
    }

    // 5l. Footer — subtle fade
    var footer = document.querySelector('.footer');
    if (footer) {
      gsap.set(footer, { opacity: 0 });
      gsap.to(footer, {
        opacity: 1,
        duration: 0.7,
        scrollTrigger: {
          trigger: footer,
          start: 'top 95%',
          once: true
        }
      });
    }

    // 5m. 404 page — character split on display heading
    var is404 = document.querySelector('body > .container > .display');
    if (is404 && !document.querySelector('.hero') && typeof SplitType !== 'undefined' && !isMobile) {
      var container404 = is404.closest('.container');
      var subtitle404 = container404.querySelector('h2');
      var desc404 = container404.querySelector('p');
      var btn404 = container404.querySelector('.btn');

      var split404 = new SplitType(is404, { types: 'chars' });
      gsap.set(split404.chars, { opacity: 0, y: 30 });
      is404.style.opacity = '1';

      var tl404 = gsap.timeline({ delay: 0.3 });
      tl404.to(split404.chars, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out'
      });

      if (subtitle404) {
        gsap.set(subtitle404, { opacity: 0, y: 15 });
        tl404.to(subtitle404, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');
      }
      if (desc404) {
        gsap.set(desc404, { opacity: 0, y: 15 });
        tl404.to(desc404, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
      }
      if (btn404) {
        gsap.set(btn404, { opacity: 0, y: 15 });
        tl404.to(btn404, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
      }
    }
  }

  // If GSAP is not available or reduced motion, use the original IntersectionObserver fallback
  if (prefersReducedMotion || typeof gsap === 'undefined') {
    if (!prefersReducedMotion) {
      var reveals = document.querySelectorAll('.reveal, .reveal-fade, .stagger');
      if (reveals.length) {
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
        reveals.forEach(function (el) { observer.observe(el); });
      }
    }
  }

  // ──────────────────────────────────────
  // 6. BLOG — READING PROGRESS BAR
  // ──────────────────────────────────────
  var progressBar = document.querySelector('.reading-progress');
  var articleBody = document.querySelector('.article__body');

  if (progressBar && articleBody && typeof gsap !== 'undefined' && !prefersReducedMotion) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: articleBody,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });
  }

  // ──────────────────────────────────────
  // 7. FORM HANDLING
  // ──────────────────────────────────────
  var forms = document.querySelectorAll('.form[data-submit]');
  forms.forEach(function (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Subtle loading pulse
      var pulse = null;
      if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        pulse = gsap.to(btn, {
          opacity: 0.7,
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
      }

      try {
        var data = new FormData(form);
        var res = await fetch(form.action || '/', {
          method: 'POST',
          body: data
        });
        var json = await res.json();

        if (json.is_valid) {
          if (pulse) pulse.kill();
          form.innerHTML =
            '<p class="form__success" tabindex="-1" style="font-family:var(--ff-serif);font-size:var(--fs-h3);line-height:1.4;opacity:0;transform:translateY(20px);">Thank you. We\'ll be in touch shortly.</p>';

          var successEl = form.querySelector('.form__success');
          if (successEl) {
            if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
              gsap.to(successEl, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: function () { successEl.focus(); }
              });
            } else {
              successEl.style.opacity = '1';
              successEl.style.transform = 'none';
              successEl.focus();
            }
          }
        }
      } catch (err) {
        if (pulse) pulse.kill();
        btn.textContent = original;
        btn.disabled = false;
        btn.style.opacity = '1';
      }
    });
  });

  // ──────────────────────────────────────
  // 8. STAT COUNTER ANIMATION
  // ──────────────────────────────────────
  if (!prefersReducedMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    var statNumbers = document.querySelectorAll('.stat-item__number[data-count]');
    statNumbers.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var isDecimal = target % 1 !== 0;
      var counterObj = { value: 0 };

      gsap.to(counterObj, {
        value: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = isDecimal
            ? counterObj.value.toFixed(1)
            : Math.floor(counterObj.value);
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      });
    });
  } else {
    // No animation: show final values immediately
    document.querySelectorAll('.stat-item__number[data-count]').forEach(function (el) {
      el.textContent = el.getAttribute('data-count');
    });
  }

  // ──────────────────────────────────────
  // 9. FAQ ACCORDION
  // ──────────────────────────────────────
  var faqButtons = document.querySelectorAll('.faq-item__question');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = btn.nextElementSibling;

      if (expanded) {
        // Close
        btn.setAttribute('aria-expanded', 'false');
        if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
          gsap.to(answer, {
            height: 0,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: function () {
              answer.hidden = true;
              answer.style.height = '';
            }
          });
        } else {
          answer.hidden = true;
        }
      } else {
        // Open
        btn.setAttribute('aria-expanded', 'true');
        answer.hidden = false;

        if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
          var fullHeight = answer.scrollHeight;
          gsap.fromTo(answer,
            { height: 0 },
            { height: fullHeight, duration: 0.4, ease: 'power2.inOut', onComplete: function () {
              answer.style.height = '';
            }}
          );
        }
      }
    });
  });

  // ──────────────────────────────────────
  // 10. PAGE LOAD + REDUCED MOTION LISTENER
  // ──────────────────────────────────────
  document.documentElement.classList.add('js-loaded');

  // Listen for reduced motion preference changes mid-session
  reducedMotionQuery.addEventListener('change', function (e) {
    if (e.matches) {
      // User enabled reduced motion — kill everything
      if (typeof gsap !== 'undefined') {
        gsap.globalTimeline.clear();
        ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
      }
      document.querySelectorAll('.reveal, .reveal-fade, .stagger > *').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      if (lenis) {
        lenis.destroy();
        lenis = null;
        document.documentElement.style.scrollBehavior = '';
      }
    }
  });

})();

