const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const revealItems = document.querySelectorAll("[data-reveal]");
const heroImage = document.querySelector(".hero__image");
const heroSection = document.querySelector(".hero");
const contactSection = document.querySelector("#contact");
const mobileCta = document.querySelector("[data-mobile-cta]");
const form = document.querySelector("#lead-form");
const statusElement = document.querySelector("#form-status");

const fieldRefs = {
  name: document.querySelector("#name"),
  phone: document.querySelector("#phone"),
  objectType: document.querySelector("#objectType"),
};

const errorRefs = {
  name: document.querySelector('[data-error-for="name"]'),
  phone: document.querySelector('[data-error-for="phone"]'),
  objectType: document.querySelector('[data-error-for="objectType"]'),
};

const setHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setHeroParallax = () => {
  if (!heroImage) {
    return;
  }

  const shift = Math.min(window.scrollY * 0.12, 46);
  heroImage.style.setProperty("--hero-shift", `${shift}px`);
};

const setMobileCtaState = () => {
  if (!mobileCta || !heroSection || !contactSection) {
    return;
  }

  const isCompactViewport = window.innerWidth <= 720;
  const heroBottom = heroSection.getBoundingClientRect().bottom;
  const contactTop = contactSection.getBoundingClientRect().top;
  const shouldShow =
    isCompactViewport &&
    heroBottom < window.innerHeight * 0.5 &&
    contactTop > window.innerHeight - 140;

  mobileCta.classList.toggle("is-visible", shouldShow);
};

const closeMenu = () => {
  if (!nav || !menuToggle) {
    return;
  }

  nav.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const nextState = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", nextState);
    menuToggle.classList.toggle("is-open", nextState);
    menuToggle.setAttribute("aria-expanded", String(nextState));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 920) {
    closeMenu();
  }

  setMobileCtaState();
});

window.addEventListener("scroll", () => {
  window.requestAnimationFrame(() => {
    setHeaderState();
    setHeroParallax();
    setMobileCtaState();
  });
});

setHeaderState();
setHeroParallax();
setMobileCtaState();

if ("IntersectionObserver" in window) {
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
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const clearError = (fieldName) => {
  const input = fieldRefs[fieldName];
  const error = errorRefs[fieldName];

  if (!input || !error) {
    return;
  }

  input.removeAttribute("aria-invalid");
  error.textContent = "";
};

const setError = (fieldName, message) => {
  const input = fieldRefs[fieldName];
  const error = errorRefs[fieldName];

  if (!input || !error) {
    return;
  }

  input.setAttribute("aria-invalid", "true");
  error.textContent = message;
};

const validateForm = () => {
  let isValid = true;

  clearError("name");
  clearError("phone");
  clearError("objectType");

  const nameValue = fieldRefs.name.value.trim();
  const phoneValue = fieldRefs.phone.value.trim();
  const objectValue = fieldRefs.objectType.value;
  const phoneDigits = phoneValue.replace(/\D/g, "");

  if (nameValue.length < 2) {
    setError("name", "Введите имя, чтобы мы могли к вам обратиться.");
    isValid = false;
  }

  if (phoneDigits.length < 10) {
    setError("phone", "Укажите корректный номер телефона.");
    isValid = false;
  }

  if (!objectValue) {
    setError("objectType", "Выберите тип объекта.");
    isValid = false;
  }

  return isValid;
};

Object.keys(fieldRefs).forEach((fieldName) => {
  const element = fieldRefs[fieldName];

  if (!element) {
    return;
  }

  element.addEventListener("input", () => clearError(fieldName));
  element.addEventListener("change", () => clearError(fieldName));
});

if (form && statusElement) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    statusElement.textContent = "";

    if (!validateForm()) {
      return;
    }

    const objectTypeLabel =
      fieldRefs.objectType.options[fieldRefs.objectType.selectedIndex].textContent;

    statusElement.textContent = `Заявка принята. Свяжемся с вами по проекту "${objectTypeLabel}" в ближайшее время.`;
    form.reset();
  });
}
