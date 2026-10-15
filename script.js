(() => {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");
  const toast = document.getElementById("toast");

  function setTheme(theme) {
    root.dataset.theme = theme;
    try { localStorage.setItem("portfolio-theme", theme); } catch (_) {}
    themeButton?.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }

  themeButton?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
  setTheme(root.dataset.theme === "dark" ? "dark" : "light");

  menuButton?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open navigation");
    });
  });

  // Project category filters
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const projectCards = [...document.querySelectorAll(".project-card[data-category]")];
  const projectCount = document.getElementById("project-count");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      let visible = 0;
      projectCards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (projectCount) projectCount.textContent = `Showing ${visible} project${visible === 1 ? "" : "s"}`;
    });
  });

  // Use the designed initials fallback if no profile image has been added.
  const photo = document.getElementById("profile-photo");
  const placeholder = document.getElementById("photo-placeholder");
  function showPhotoFallback() {
    if (photo) photo.classList.add("broken");
    if (placeholder) placeholder.hidden = false;
  }
  if (photo) {
    photo.addEventListener("error", showPhotoFallback);
    photo.addEventListener("load", () => {
      if (placeholder) placeholder.hidden = true;
      photo.classList.remove("broken");
    });
    if (photo.complete && photo.naturalWidth === 0) showPhotoFallback();
  }

  // Keep the footer year current.
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Subtle reveal effect, with an accessible fallback.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Warn about the resume placeholder if a visitor clicks before the real PDF is added.
  const resumeLink = document.getElementById("resume-link");
  resumeLink?.addEventListener("click", (event) => {
    // The file is intentionally not generated: add your real resume PDF at this path.
    // Browser's native download behavior will work after that file is added.
    if (!resumeLink.dataset.ready) {
      event.preventDefault();
      if (toast) {
        toast.textContent = "Add your resume PDF at assets/Inioluwa-Olufemi-Resume.pdf to enable this download.";
        toast.classList.add("show");
        window.setTimeout(() => toast.classList.remove("show"), 3600);
      }
    }
  });
})();
