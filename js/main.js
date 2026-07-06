// ============================================================
// Haider Ali · Portfolio interactions
// ============================================================

(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  // --- nav background + reading progress on scroll ---
  const navProgress = document.getElementById("navProgress");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 24);
    if (navProgress) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      navProgress.style.width = pct + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  // --- mobile menu ---
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // --- animated counters ---
  const countersDone = new WeakSet();
  const animateCount = (el) => {
    if (countersDone.has(el)) return;
    countersDone.add(el);
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // --- reveal on scroll (IntersectionObserver with scroll fallback) ---
  const reveals = Array.from(document.querySelectorAll(".reveal"));
  const counters = Array.from(document.querySelectorAll(".stat-number"));

  const showReveal = (el) => el.classList.add("visible");

  let ioDelivered = false;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      ioDelivered = true;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showReveal(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => revealObserver.observe(el));

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => countObserver.observe(el));

  // Fallback: the observer spec guarantees an initial callback shortly after
  // observe(). If none arrives, reveal via scroll position instead so the page
  // never stays blank.
  const fallbackReveal = () => {
    const limit = window.innerHeight - 40;
    reveals.forEach((el) => {
      if (!el.classList.contains("visible") && el.getBoundingClientRect().top < limit) {
        showReveal(el);
      }
    });
    counters.forEach((el) => {
      if (el.getBoundingClientRect().top < limit) animateCount(el);
    });
  };
  setTimeout(() => {
    if (!ioDelivered) {
      revealObserver.disconnect();
      countObserver.disconnect();
      fallbackReveal();
      window.addEventListener("scroll", fallbackReveal, { passive: true });
      window.addEventListener("resize", fallbackReveal, { passive: true });
    }
  }, 700);

  // --- active nav link highlighting (scroll-based, no observer needed) ---
  const sectionIds = ["about", "experience", "projects", "case-study", "how-i-work", "skills", "contact"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const linkFor = {};
  navLinks.querySelectorAll("a[href^='#']").forEach((a) => {
    linkFor[a.getAttribute("href").slice(1)] = a;
  });
  const updateActive = () => {
    const probe = window.scrollY + window.innerHeight * 0.4;
    let current = null;
    sections.forEach((s) => {
      if (s.offsetTop <= probe) current = s.id;
    });
    navLinks.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
    if (current && linkFor[current]) linkFor[current].classList.add("active");
  };
  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();
})();
