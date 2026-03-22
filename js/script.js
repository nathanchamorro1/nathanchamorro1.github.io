// ── Theme toggle ──
const toggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  toggle.textContent = "DARK MODE";
}

toggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");
  toggle.textContent = isLight ? "DARK MODE" : "LIGHT MODE";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// ── Scroll reveal ──
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 200) {
      el.classList.add("reveal-visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ── Show sidebar name only after scrolling past the hero h1 ──
const heroName = document.querySelector("#home h1");
const navLogo = document.querySelector(".nav-logo");

const nameObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    navLogo.classList.remove("visible");
  } else {
    navLogo.classList.add("visible");
  }
}, { threshold: 0 });

nameObserver.observe(heroName);