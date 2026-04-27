// DOM element selectors.
const header = document.getElementById("header");
const themeBtn = document.getElementById("theme-btn");
const navList = document.getElementById("nav-list");
const navBtn = document.getElementById("sidebar-btn");

// Event listeners.
navBtn.addEventListener("click", toggleSideBar);
themeBtn.addEventListener("click", toggleTheme);

// Variables.
let scrollPosition = 0;
let sidebarIsOpen = false;
const media = window.matchMedia("(width >= 32em)");
let isLargeScreen = media.matches;
let resizeTimer;

// Listen to page size changes and update accordingly.
updateScreen(); // Initialize inert state.
media.addEventListener("change", (e) => {
  // Stop all animations while resizing.
  document.body.classList.add("no-animate");

  isLargeScreen = e.matches;
  updateScreen();

  // Debounce: Remove the stopper once resizing stops.
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("no-animate");
  }, 400);
});

// Enable floating navbar when scrolled past a distance.
window.addEventListener("scroll", function () {
  if (sidebarIsOpen) {
    return;
  }

  if (window.scrollY > 200) {
    header.classList.add("slidedown");
  } else {
    header.classList.remove("slidedown");
  }
});

// Add listener to each nav link.
const navLinks = document.querySelectorAll("nav a");
navLinks.forEach((link) => {
  // User clicked link and sidebar is shown, hide sidebar.
  link.addEventListener("click", () => {
    if (navList.classList.contains("show")) {
      toggleSideBar();
    }
  });
});

/**
 * Toggles the visibility of the mobile navigation sidebar.
 * Updates ARIA and inert attributes, toggles the "show" class,
 * and prevents body scrolling when the menu is active.
 * @returns {void}
 */
function toggleSideBar() {
  sidebarIsOpen = !sidebarIsOpen;

  // Toggle show on since it doesn't contain show class.
  if (!navList.classList.contains("show")) {
    navList.classList.add("show");
    navBtn.classList.add("show");

    // Wait for open/close animation.
    setTimeout(() => {
      // Remember position on page.
      scrollPosition = window.scrollY;
      // document.body.style.top = `-${scrollPosition}px`;

      // Update ARIA and inert.
      navBtn.setAttribute("aria-expanded", "true");
      navList.inert = false;

      // Prevent scrolling page when sidebar is open.
      document.body.classList.add("no-scroll");
    }, 400);
  } else {
    // Prevent scrolling page when sidebar is open.
    document.body.classList.remove("no-scroll");
    header.classList.add("no-animate");

    // 4. Immediately jump back to where they were
    window.scrollTo({ left: 0, top: scrollPosition, behavior: "instant" });

    // Update ARIA and inert.
    navBtn.setAttribute("aria-expanded", "false");
    if (!isLargeScreen) {
      // User is on mobile, add inert.
      navList.inert = true;
    }

    // Ensure animations have finished before re-enabling animations.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        header.classList.remove("no-animate");
        // Close nav bar with animations.
        navList.classList.remove("show");
        navBtn.classList.remove("show");
      });
    });
  }
}

/**
 * Toggles the theme (light/dark mode).
 * @returns {void}
 */
function toggleTheme() {
  const isLightMode = document.documentElement.classList.toggle("light-mode");

  themeBtn.setAttribute("aria-pressed", String(isLightMode));
}

/**
 * Synchronizes Nav accessibility states
 * based on current viewport size and visibility.
 * @returns {void}
 */
function updateScreen() {
  // User"s screen size is mobile AND navList is hidden.
  const isHidden = !isLargeScreen && !navList.classList.contains("show");

  navList.inert = isHidden;
}
