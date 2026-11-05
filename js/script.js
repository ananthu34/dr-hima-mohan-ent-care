// =========================================================
// Otolarynx ENT Care — Futuristic Edition — interactions
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollSpy();
  initReveal();
  initAccordion();
  initTestimonialSlider();
  initContactForm();
  initBackToTop();
  initYear();
  initDateLimit();
  initScrollProgress();
  initRipple();
  initPayment();
  initTyping();
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Scroll spy ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Reveal-on-scroll (staggered) ---------- */
function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const groups = new Map();
  items.forEach((item) => {
    const parent = item.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(item);
  });
  groups.forEach((group) => {
    group.forEach((item, i) => {
      item.style.transitionDelay = prefersReducedMotion ? '0ms' : `${Math.min(i * 90, 450)}ms`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener(
    'scroll',
    () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      bar.style.width = `${progress}%`;
    },
    { passive: true }
  );
}

/* ---------- Button ripple ---------- */
function initRipple() {
  if (prefersReducedMotion) return;
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ---------- Hero typing effect (cycles through services) ---------- */
function initTyping() {
  const el = document.getElementById('typingTarget');
  if (!el) return;

  const phrases = [
    'precision ear care.',
    'advanced sinus treatment.',
    'expert voice & throat care.',
    'gentle pediatric ENT care.',
    'online ENT consultations.',
  ];

  if (prefersReducedMotion) {
    el.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 55);
  };

  tick();
}

/* ---------- FAQ accordion ---------- */
function initAccordion() {
  const items = document.querySelectorAll('.accordion__item');
  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach((i) => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* ---------- Testimonial slider ---------- */
function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  if (!track || !dotsWrap) return;

  const slides = track.children.length;
  let current = 0;

  for (let i = 0; i < slides; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }

  function goTo(index) {
    current = (index + slides) % slides;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  let autoplay = setInterval(() => goTo(current + 1), 5500);
  [track, dotsWrap].forEach((el) => {
    el.addEventListener('mouseenter', () => clearInterval(autoplay));
    el.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => goTo(current + 1), 5500);
    });
  });
}

/* ---------- Contact / appointment form (Web3Forms) ---------- */
function initContactForm() {
  const form = document.getElementById('appointmentForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      note.textContent = 'Please fill in all required fields correctly.';
      note.classList.remove('success');
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    note.classList.remove('success', 'error');
    note.textContent = '';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();

      if (result.success) {
        note.textContent = 'Thank you! Your appointment request has been received — our team will contact you shortly to confirm.';
        note.classList.add('success');
        form.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      note.textContent = 'Something went wrong sending your request. Please call us directly at 9496936034.';
      note.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Restrict appointment date to today onward ---------- */
function initDateLimit() {
  const dateInput = document.getElementById('date');
  if (!dateInput) return;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
}

/* ---------- UPI consultation fee payment ---------- */
function initPayment() {
  const concernSelect = document.getElementById('concern');
  const paymentBlock = document.getElementById('paymentBlock');
  const noPaymentNote = document.getElementById('noPaymentNote');
  const qrImg = document.getElementById('upiQrImg');
  const gpayBtn = document.getElementById('upiBtnGpay');
  const phonepeBtn = document.getElementById('upiBtnPhonepe');
  const paytmBtn = document.getElementById('upiBtnPaytm');
  const genericBtn = document.getElementById('upiBtnGeneric');
  if (!concernSelect || !paymentBlock || !noPaymentNote || !qrImg || !gpayBtn || !phonepeBtn || !paytmBtn || !genericBtn) return;

  const UPI_ID = '8075307375@sib';
  const PAYEE_NAME = 'Otolarynx ENT Care';
  const AMOUNT = '399';
  const NOTE = 'Consultation Fee - Otolarynx ENT Care';

  const params =
    `pa=${encodeURIComponent(UPI_ID)}` +
    `&pn=${encodeURIComponent(PAYEE_NAME)}` +
    `&am=${encodeURIComponent(AMOUNT)}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(NOTE)}`;

  const genericUri = `upi://pay?${params}`;

  gpayBtn.href = `tez://upi/pay?${params}`;
  phonepeBtn.href = `phonepe://pay?${params}`;
  paytmBtn.href = `paytmmp://pay?${params}`;
  genericBtn.href = genericUri;

  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(genericUri)}`;

  const updatePaymentVisibility = () => {
    const isFollowUp = concernSelect.value === 'Follow-up Visit';
    paymentBlock.style.display = isFollowUp ? 'none' : '';
    noPaymentNote.style.display = isFollowUp ? '' : 'none';
  };

  concernSelect.addEventListener('change', updatePaymentVisibility);
  updatePaymentVisibility();
}

/* ---------- Footer year ---------- */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
