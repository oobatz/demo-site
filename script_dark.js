const siteConfig = {
  brand: "MONOLIT",
  phoneDisplay: "+7 (700) 000-00-00",
  phoneDigits: "77000000000",
  whatsappLink: "https://wa.me/77000000000",
  telegramLink: "https://t.me/monolit_build",
};

const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll("[data-reveal]");
const brandNodes = document.querySelectorAll("[data-brand]");
const phoneDisplayNodes = document.querySelectorAll("[data-phone-display]");
const phoneLinks = document.querySelectorAll("[data-phone-link]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const telegramLinks = document.querySelectorAll("[data-telegram-link]");
const yearNode = document.querySelector("[data-year]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

brandNodes.forEach((node) => {
  node.textContent = siteConfig.brand;
});

phoneDisplayNodes.forEach((node) => {
  node.textContent = siteConfig.phoneDisplay;
});

phoneLinks.forEach((node) => {
  node.setAttribute("href", `tel:+${siteConfig.phoneDigits}`);
});

whatsappLinks.forEach((node) => {
  node.setAttribute("href", siteConfig.whatsappLink);
});

telegramLinks.forEach((node) => {
  node.setAttribute("href", siteConfig.telegramLink);
});

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const toggleHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-condensed", window.scrollY > 24);
};

toggleHeaderState();
window.addEventListener("scroll", toggleHeaderState, { passive: true });

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
    observer.observe(item);
  });

  let ticking = false;

  const updateHeroMotion = () => {
    const shift = Math.min(window.scrollY * -0.08, 0);
    const scale = Math.max(1.02, 1.08 - window.scrollY * 0.00008);

    document.documentElement.style.setProperty("--hero-shift", `${shift}px`);
    document.documentElement.style.setProperty("--hero-scale", scale.toFixed(3));
    ticking = false;
  };

  const handleScrollMotion = () => {
    if (ticking) {
      return;
    }

    window.requestAnimationFrame(updateHeroMotion);
    ticking = true;
  };

  updateHeroMotion();
  window.addEventListener("scroll", handleScrollMotion, { passive: true });
} else {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
}
