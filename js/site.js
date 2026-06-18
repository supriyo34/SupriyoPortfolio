const body = document.body;
const header = document.querySelector("[data-site-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const themeToggle = document.querySelector("[data-theme-toggle]");
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const storedTheme = localStorage.getItem("portfolio-theme");
if (storedTheme === "light") {
  body.classList.add("light-mode");
}

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu?.classList.toggle("is-open") ?? false;
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

themeToggle?.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  localStorage.setItem("portfolio-theme", body.classList.contains("light-mode") ? "light" : "dark");
});

document.querySelector("[data-print-resume]")?.addEventListener("click", () => {
  window.print();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
      return;
    }

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${visible.target.id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  },
  {
    rootMargin: `-${header?.offsetHeight ?? 76}px 0px -45% 0px`,
    threshold: [0.15, 0.35, 0.65]
  }
);

sections.forEach((section) => navObserver.observe(section));

document.querySelector("[data-contact-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector("[data-form-status]");
  const data = new FormData(form);
  const subject = encodeURIComponent(data.get("subject") || "Portfolio contact");
  const name = data.get("name") || "Visitor";
  const message = encodeURIComponent(`${data.get("message") || ""}\n\nFrom: ${name}`);

  if (status) {
    status.textContent = "Opening your email app...";
  }

  window.location.href = `mailto:supriyodhar3S@gmail.com?subject=${subject}&body=${message}`;
});
