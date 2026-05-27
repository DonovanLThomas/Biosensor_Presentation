const sections = Array.from(document.querySelectorAll(".slide"));
const navLinks = Array.from(document.querySelectorAll("[data-section-link]"));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setActiveSection(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.sectionLink === sectionId);
  });
}

function scrollToSection(section) {
  if (!section) return;

  section.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start"
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        setActiveSection(entry.target.id);
      }
    });
  },
  {
    root: null,
    threshold: 0.55
  }
);

sections.forEach((section) => sectionObserver.observe(section));

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href").replace("#", "");
    const targetSection = document.getElementById(targetId);

    if (!targetSection) return;

    event.preventDefault();
    scrollToSection(targetSection);
    history.pushState(null, "", `#${targetId}`);
  });
});

document.addEventListener("keydown", (event) => {
  const isEditableElement = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);

  if (isEditableElement) return;

  const currentIndex = sections.findIndex((section) => section.id === document.querySelector(".nav-dot.is-active")?.dataset.sectionLink);

  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    event.preventDefault();
    scrollToSection(sections[Math.min(currentIndex + 1, sections.length - 1)]);
  }

  if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    event.preventDefault();
    scrollToSection(sections[Math.max(currentIndex - 1, 0)]);
  }
});

window.addEventListener("load", () => {
  const initialId = window.location.hash.replace("#", "");
  const initialSection = document.getElementById(initialId) || sections[0];

  initialSection.classList.add("is-visible");
  setActiveSection(initialSection.id);
});
