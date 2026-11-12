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

// mobile menu (only on pages that still use the top nav, e.g. coffee-list.html)
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // close the dropdown when a nav link is tapped
  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const dock = document.querySelector(".dock");

// scroll so a section is framed nicely instead of jammed against the top edge.
// "Visible area" leaves out the dock (floating at the bottom on desktop, top bar on phones).
// If the section fits in that area, center it there; if it's taller, put its top 48px
// below the top of the area so the heading has room.
const SECTION_GAP = 48;

function scrollToSection(id) {
  const behavior = reduceMotion ? "auto" : "smooth";
  if (id === "home") {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const target = document.getElementById(id);
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const boxTop = rect.top + window.scrollY;

  let areaTop = 0;
  let areaBottom = window.innerHeight;
  if (dock) {
    const d = dock.getBoundingClientRect();
    if (d.top > window.innerHeight / 2) areaBottom = d.top - 16; // dock at the bottom
    else areaTop = d.bottom;                                     // top bar on phones
  }
  const areaHeight = areaBottom - areaTop;

  let y;
  if (rect.height + SECTION_GAP * 2 <= areaHeight) {
    y = boxTop - areaTop - (areaHeight - rect.height) / 2;
  } else {
    y = boxTop - areaTop - SECTION_GAP;
  }

  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: Math.max(0, Math.min(y, maxY)), behavior });
}

// bottom dock: highlight the link for the section currently in view
const dockLinks = document.querySelectorAll(".dock-link");
const dockIndicator = document.querySelector(".dock-indicator");

// move the highlight box to sit behind the given link (CSS transition does the slide)
function moveIndicator(link) {
  if (!dockIndicator || !link) return;
  dockIndicator.style.width = link.offsetWidth + "px";
  dockIndicator.style.height = link.offsetHeight + "px";
  dockIndicator.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
}

// while a click is smooth-scrolling the page, keep the box on the clicked tab instead of
// letting the scroll check drag it through every section in between
let dockLocked = false;
let dockUnlockTimer;

function unlockDock() {
  dockLocked = false;
  updateDock();
}

function lockDock() {
  dockLocked = true;
  clearTimeout(dockUnlockTimer);
  dockUnlockTimer = setTimeout(unlockDock, 1000); // fallback if scrollend never fires
}

window.addEventListener("scrollend", () => { if (dockLocked) unlockDock(); });

dockLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    dockLinks.forEach(l => l.classList.toggle("is-active", l === link));
    moveIndicator(link);
    lockDock();
    scrollToSection(link.getAttribute("href").slice(1));
  });
});

function updateDock() {
  if (!dockLinks.length || dockLocked) return;

  // the section whose top has passed 40% of the screen is the current one
  let current = "home";
  dockLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.4) {
      current = section.id;
    }
  });

  // contact is short, so treat reaching the bottom of the page as being on it
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    current = "contact";
  }

  dockLinks.forEach(link => {
    const isActive = link.getAttribute("href") === "#" + current;
    link.classList.toggle("is-active", isActive);
    if (isActive) moveIndicator(link);
  });
}

// scroll reveal: anything with class "reveal" fades up when it enters the viewport
const reveals = document.querySelectorAll(".reveal");

// buffer: how far above the bottom edge an element must be before it fades in.
// On first load it's 0 so everything already on screen (like the hero buttons on short screens) shows.
function revealOnScroll(buffer = 200) {
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - buffer) {
      el.classList.add("reveal-visible");
    }
  });
}

window.addEventListener("scroll", () => {
  revealOnScroll();
  updateDock();
});

revealOnScroll(0);
updateDock();

// place the box without animating on first load, then turn the slide on
if (dockIndicator) {
  requestAnimationFrame(() => dockIndicator.classList.add("dock-indicator--ready"));
  // link widths change once web fonts load and when the dock resizes on small screens
  if (document.fonts) document.fonts.ready.then(updateDock);
  window.addEventListener("resize", updateDock);
}

// scroll hint: fade in ~1s after load, nudge down once, hide after scrolling 40px,
// come back only at the very top (without nudging again)
const scrollHint = document.querySelector(".scroll-hint");

if (scrollHint) {
  let ready = false;

  // never show it on top of the hero text (e.g. on phones, where the intro runs past the first screen)
  const heroButtons = document.querySelector(".hero-buttons");
  const hintCovers = () => heroButtons &&
    heroButtons.getBoundingClientRect().bottom > scrollHint.getBoundingClientRect().top - 8;
  const setHintVisible = visible => scrollHint.classList.toggle("is-visible", visible && !hintCovers());

  if (reduceMotion) {
    // no fade or nudge: just show it (CSS turns the transition off)
    ready = true;
    setHintVisible(window.scrollY <= 40);
    // re-check once web fonts load, since they change how tall the hero text is
    if (document.fonts) document.fonts.ready.then(() => setHintVisible(window.scrollY <= 40));
  } else {
    setTimeout(() => {
      ready = true;
      if (window.scrollY > 40) return;
      setHintVisible(true);
      // one nudge once the 600ms fade-in finishes, then never again
      setTimeout(() => {
        if (!scrollHint.classList.contains("is-visible")) return;
        scrollHint.classList.add("is-nudging");
        // the nudge lasts 1s; drop the class after so it can never replay
        setTimeout(() => scrollHint.classList.remove("is-nudging"), 1100);
      }, 600);
    }, 1000);
  }

  window.addEventListener("scroll", () => {
    if (!ready) return;
    if (window.scrollY > 40) setHintVisible(false);
    else if (window.scrollY <= 5) setHintVisible(true);
  }, { passive: true });

  scrollHint.addEventListener("click", e => {
    e.preventDefault();
    scrollToSection(scrollHint.getAttribute("href").slice(1));
  });
}
