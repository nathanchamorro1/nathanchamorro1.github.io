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