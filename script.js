/* ============================================
   ShivamRFilms - Main JavaScript
   Interactivity | Animations | Features
   ============================================ */

   'use strict';

   /* ---- DOM Ready ---- */
   document.addEventListener('DOMContentLoaded', () => {
     initPreloader();
     initAOS();
     initNavbar();
     initHamburger();
     initParticles();
     initCounters();
     initPortfolioFilter();
     initBeforeAfterSliders();
     initTestimonialsSlider();
     initContactForm();
     initBackToTop();
     initSmoothScroll();
     setFooterYear();
   });
   
   /* ============================================
      PRELOADER
      ============================================ */
   function initPreloader() {
     const preloader = document.getElementById('preloader');
     if (!preloader) return;
     window.addEventListener('load', () => {
       setTimeout(() => {
         preloader.classList.add('hide');
         document.body.style.overflow = '';
       }, 1800);
     });
     document.body.style.overflow = 'hidden';
   }
   
   /* ============================================
      AOS - Animate On Scroll
      ============================================ */
   function initAOS() {
     if (typeof AOS !== 'undefined') {
       AOS.init({
         duration: 800,
         easing: 'ease-out-cubic',
         once: true,
         offset: 60,
       });
     }
   }
   
   /* ============================================
      NAVBAR - Scroll Effect
      ============================================ */
   function initNavbar() {
     const navbar = document.getElementById('navbar');
     if (!navbar) return;
   
     const updateNav = () => {
       if (window.scrollY > 50) {
         navbar.classList.add('scrolled');
       } else {
         navbar.classList.remove('scrolled');
       }
     };
     window.addEventListener('scroll', updateNav, { passive: true });
     updateNav();
   
     // Active link highlight
     const sections = document.querySelectorAll('section[id]');
     const navLinks = document.querySelectorAll('.nav-link');
   
     window.addEventListener('scroll', () => {
       let current = '';
       sections.forEach(sec => {
         const top = sec.getBoundingClientRect().top;
         if (top <= 100) current = sec.id;
       });
       navLinks.forEach(link => {
         link.classList.remove('active');
         if (link.getAttribute('href') === `#${current}`) {
           link.classList.add('active');
         }
       });
     }, { passive: true });
   }
   
   /* ============================================
      HAMBURGER MENU
      ============================================ */
   function initHamburger() {
     const hamburger = document.getElementById('hamburger');
     const navLinks = document.getElementById('navLinks');
     if (!hamburger || !navLinks) return;
   
     hamburger.addEventListener('click', () => {
       const isOpen = navLinks.classList.toggle('open');
       hamburger.classList.toggle('active');
       hamburger.setAttribute('aria-expanded', isOpen);
       document.body.style.overflow = isOpen ? 'hidden' : '';
     });
   
     // Close on link click
     navLinks.querySelectorAll('a').forEach(link => {
       link.addEventListener('click', () => {
         navLinks.classList.remove('open');
         hamburger.classList.remove('active');
         hamburger.setAttribute('aria-expanded', 'false');
         document.body.style.overflow = '';
       });
     });
   
     // Close on outside click
     document.addEventListener('click', (e) => {
       if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
         navLinks.classList.remove('open');
         hamburger.classList.remove('active');
         document.body.style.overflow = '';
       }
     });
   }
   
   /* ============================================
      PARTICLES
      ============================================ */
   function initParticles() {
     const container = document.getElementById('particles');
     if (!container) return;
   
     const count = 28;
     for (let i = 0; i < count; i++) {
       const p = document.createElement('div');
       p.classList.add('particle');
       const size = Math.random() * 3 + 1;
       const x = Math.random() * 100;
       const dur = Math.random() * 12 + 8;
       const delay = Math.random() * 8;
       p.style.cssText = `
         width: ${size}px;
         height: ${size}px;
         left: ${x}%;
         bottom: -10px;
         --dur: ${dur}s;
         --delay: ${delay}s;
       `;
       container.appendChild(p);
     }
   }
   
   /* ============================================
      STAT COUNTERS
      ============================================ */
   function initCounters() {
     const nums = document.querySelectorAll('.stat-num');
     if (!nums.length) return;
   
     const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           const el = entry.target;
           const target = parseInt(el.dataset.target, 10);
           animateCounter(el, 0, target, 1800);
           observer.unobserve(el);
         }
       });
     }, { threshold: 0.5 });
   
     nums.forEach(num => observer.observe(num));
   }
   
   function animateCounter(el, start, end, duration) {
     const startTime = performance.now();
     const easeOut = (t) => 1 - Math.pow(1 - t, 3);
   
     function update(currentTime) {
       const elapsed = currentTime - startTime;
       const progress = Math.min(elapsed / duration, 1);
       const value = Math.round(start + (end - start) * easeOut(progress));
       el.textContent = value;
       if (progress < 1) requestAnimationFrame(update);
     }
     requestAnimationFrame(update);
   }
   
   /* ============================================
      PORTFOLIO FILTER
      ============================================ */
   function initPortfolioFilter() {
     const tabs = document.querySelectorAll('.tab-btn');
     const items = document.querySelectorAll('.portfolio-item');
     if (!tabs.length || !items.length) return;
   
     tabs.forEach(tab => {
       tab.addEventListener('click', () => {
         // Update active tab
         tabs.forEach(t => t.classList.remove('active'));
         tab.classList.add('active');
   
         const filter = tab.dataset.filter;
   
         items.forEach(item => {
           const cat = item.dataset.category;
           if (filter === 'all' || cat === filter) {
             item.classList.remove('hide');
             item.style.animation = 'none';
             requestAnimationFrame(() => {
               item.style.animation = 'fadeInUp 0.5s ease forwards';
             });
           } else {
             item.classList.add('hide');
           }
         });
       });
     });
   }
   
   // Inject filter animation
   const filterStyle = document.createElement('style');
   filterStyle.textContent = `
     @keyframes fadeInUp {
       from { opacity: 0; transform: translateY(20px); }
       to { opacity: 1; transform: translateY(0); }
     }
   `;
   document.head.appendChild(filterStyle);
   
   /* ============================================
      BEFORE/AFTER SLIDERS
      ============================================ */
   function initBeforeAfterSliders() {
     const sliders = document.querySelectorAll('.ba-slider');
     sliders.forEach(slider => {
       const handle = slider.querySelector('.ba-handle');
       const before = slider.querySelector('.ba-before');
       let isDragging = false;
   
       function setPosition(x) {
         const rect = slider.getBoundingClientRect();
         let percent = ((x - rect.left) / rect.width) * 100;
         percent = Math.max(5, Math.min(95, percent));
         handle.style.left = `${percent}%`;
         before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
       }
   
       // Mouse events
       handle.addEventListener('mousedown', (e) => {
         isDragging = true;
         e.preventDefault();
       });
       document.addEventListener('mousemove', (e) => {
         if (!isDragging) return;
         setPosition(e.clientX);
       });
       document.addEventListener('mouseup', () => { isDragging = false; });
   
       // Touch events
       handle.addEventListener('touchstart', (e) => {
         isDragging = true;
       }, { passive: true });
       document.addEventListener('touchmove', (e) => {
         if (!isDragging) return;
         setPosition(e.touches[0].clientX);
       }, { passive: true });
       document.addEventListener('touchend', () => { isDragging = false; });
   
       // Also allow clicking anywhere on slider
       slider.addEventListener('click', (e) => {
         setPosition(e.clientX);
       });
     });
   }
   
   /* ============================================
      TESTIMONIALS SLIDER
      ============================================ */
   function initTestimonialsSlider() {
     const track = document.getElementById('testiTrack');
     const prevBtn = document.getElementById('testiPrev');
     const nextBtn = document.getElementById('testiNext');
     const dotsContainer = document.getElementById('testiDots');
     if (!track) return;
   
     const cards = track.querySelectorAll('.testi-card');
     let current = 0;
     let perView = getPerView();
     let total = Math.ceil(cards.length / perView);
     let autoTimer;
   
     function getPerView() {
       if (window.innerWidth < 768) return 1;
       if (window.innerWidth < 900) return 2;
       return 3;
     }
   
     function buildDots() {
       if (!dotsContainer) return;
       dotsContainer.innerHTML = '';
       for (let i = 0; i < total; i++) {
         const dot = document.createElement('button');
         dot.classList.add('testi-dot');
         dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
         if (i === current) dot.classList.add('active');
         dot.addEventListener('click', () => goTo(i));
         dotsContainer.appendChild(dot);
       }
     }
   
     function updateDots() {
       const dots = dotsContainer ? dotsContainer.querySelectorAll('.testi-dot') : [];
       dots.forEach((d, i) => d.classList.toggle('active', i === current));
     }
   
     function goTo(index) {
       current = Math.max(0, Math.min(index, total - 1));
       const cardWidth = cards[0].offsetWidth + 24; // gap
       track.style.transform = `translateX(-${current * perView * cardWidth}px)`;
       updateDots();
     }
   
     function next() {
       goTo(current >= total - 1 ? 0 : current + 1);
     }
     function prev() {
       goTo(current <= 0 ? total - 1 : current - 1);
     }
   
     if (prevBtn) prevBtn.addEventListener('click', prev);
     if (nextBtn) nextBtn.addEventListener('click', next);
   
     // Auto play
     function startAuto() {
       autoTimer = setInterval(next, 5000);
     }
     function stopAuto() {
       clearInterval(autoTimer);
     }
   
     track.addEventListener('mouseenter', stopAuto);
     track.addEventListener('mouseleave', startAuto);
   
     // Touch swipe
     let touchStartX = 0;
     track.addEventListener('touchstart', (e) => {
       touchStartX = e.touches[0].clientX;
       stopAuto();
     }, { passive: true });
     track.addEventListener('touchend', (e) => {
       const diff = touchStartX - e.changedTouches[0].clientX;
       if (Math.abs(diff) > 50) {
         diff > 0 ? next() : prev();
       }
       startAuto();
     }, { passive: true });
   
     // Resize
     window.addEventListener('resize', () => {
       perView = getPerView();
       total = Math.ceil(cards.length / perView);
       current = 0;
       track.style.transform = `translateX(0)`;
       buildDots();
     });
   
     buildDots();
     startAuto();
   }
   
   /* ============================================
      CONTACT FORM
      ============================================ */
   function initContactForm() {
     const form = document.getElementById('contactForm');
     const success = document.getElementById('formSuccess');
     if (!form) return;
   
     form.addEventListener('submit', async (e) => {
       e.preventDefault();
   
       if (!validateForm(form)) return;
   
       const btn = form.querySelector('button[type="submit"]');
       const originalText = btn.innerHTML;
       btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
       btn.disabled = true;
   
       // Simulate send (replace with actual API call)
       await new Promise(resolve => setTimeout(resolve, 1600));
   
       // Try to save to table API
       try {
         const data = {
           name: form.name.value.trim(),
           email: form.email.value.trim(),
           phone: form.phone.value.trim(),
           service: form.service.value,
           message: form.message.value.trim(),
         };
         await fetch('tables/enquiries', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(data),
         });
       } catch (_) { /* ignore API errors */ }
   
       form.classList.add('hidden');
       success.classList.remove('hidden');
       btn.innerHTML = originalText;
       btn.disabled = false;
     });
   
     // Real-time validation feedback
     form.querySelectorAll('input, select, textarea').forEach(field => {
       field.addEventListener('blur', () => {
         if (field.hasAttribute('required') && !field.value.trim()) {
           field.style.borderColor = '#e74c3c';
         } else {
           field.style.borderColor = '';
         }
       });
       field.addEventListener('input', () => {
         field.style.borderColor = '';
       });
     });
   }
   
   function validateForm(form) {
     const required = form.querySelectorAll('[required]');
     let valid = true;
     required.forEach(field => {
       if (!field.value.trim()) {
         field.style.borderColor = '#e74c3c';
         field.focus();
         valid = false;
       }
     });
     if (!valid) {
       showToast('Please fill in all required fields.', 'error');
     }
     // Email validation
     const emailField = form.querySelector('#email');
     if (emailField && emailField.value && !isValidEmail(emailField.value)) {
       emailField.style.borderColor = '#e74c3c';
       showToast('Please enter a valid email address.', 'error');
       return false;
     }
     return valid;
   }
   
   function isValidEmail(email) {
     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   }
   
   function showToast(message, type = 'info') {
     const existing = document.querySelector('.toast');
     if (existing) existing.remove();
   
     const toast = document.createElement('div');
     toast.classList.add('toast', `toast--${type}`);
     toast.textContent = message;
     toast.style.cssText = `
       position: fixed; bottom: 100px; right: 28px;
       background: ${type === 'error' ? '#e74c3c' : '#111'};
       color: white; padding: 14px 22px; border-radius: 10px;
       font-size: 0.88rem; z-index: 9999;
       box-shadow: 0 8px 30px rgba(0,0,0,0.4);
       animation: slideInRight 0.3s ease forwards;
     `;
     document.body.appendChild(toast);
     setTimeout(() => toast.remove(), 3500);
   }
   
   /* ============================================
      BACK TO TOP
      ============================================ */
   function initBackToTop() {
     const btn = document.getElementById('backToTop');
     if (!btn) return;
   
     window.addEventListener('scroll', () => {
       btn.classList.toggle('visible', window.scrollY > 400);
     }, { passive: true });
   
     btn.addEventListener('click', () => {
       window.scrollTo({ top: 0, behavior: 'smooth' });
     });
   }
   
   /* ============================================
      SMOOTH SCROLL
      ============================================ */
   function initSmoothScroll() {
     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
       anchor.addEventListener('click', (e) => {
         const href = anchor.getAttribute('href');
         if (href === '#') return;
         const target = document.querySelector(href);
         if (target) {
           e.preventDefault();
           const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 80;
           const targetTop = target.getBoundingClientRect().top + window.scrollY - navH;
           window.scrollTo({ top: targetTop, behavior: 'smooth' });
         }
       });
     });
   }
   
   /* ============================================
      FOOTER YEAR
      ============================================ */
   function setFooterYear() {
     const el = document.getElementById('year');
     if (el) el.textContent = new Date().getFullYear();
   }
   
   /* ============================================
      NAV ACTIVE LINK STYLE (inject)
      ============================================ */
   const navStyle = document.createElement('style');
   navStyle.textContent = `
     .nav-link.active { color: var(--gold) !important; }
     .nav-link.active::after { width: 100% !important; }
     @keyframes slideInRight {
       from { opacity: 0; transform: translateX(40px); }
       to { opacity: 1; transform: translateX(0); }
     }
   `;
   document.head.appendChild(navStyle);
   
   /* ============================================
      CURSOR GLOW (Desktop only)
      ============================================ */
   if (window.matchMedia('(pointer: fine)').matches) {
     const glow = document.createElement('div');
     glow.style.cssText = `
       position: fixed;
       width: 300px; height: 300px;
       border-radius: 50%;
       background: radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%);
       pointer-events: none;
       z-index: 0;
       transform: translate(-50%, -50%);
       transition: left 0.15s ease, top 0.15s ease;
       will-change: left, top;
     `;
     document.body.appendChild(glow);
   
     document.addEventListener('mousemove', (e) => {
       glow.style.left = `${e.clientX}px`;
       glow.style.top = `${e.clientY}px`;
     }, { passive: true });
   }
   