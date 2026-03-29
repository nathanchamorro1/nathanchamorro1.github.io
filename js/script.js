// creates icons on load
lucide.createIcons();

// theme toggle
const toggle = document.getElementById("themeToggle");

// respect whatever the user picked last time
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

toggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// mobile menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// close the dropdown when a nav link is tapped
mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// scroll reveal: anything with class "reveal" fades up when it enters the viewport
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    // 200px buffer so the animation fires a little before the element hits the bottom edge
    if (elementTop < windowHeight - 200) {
      el.classList.add("reveal-visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();

