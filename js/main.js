// Variables.
let scrollPosition = 0;
let sidebarIsOpen = false;
const media = window.matchMedia("(width >= 32em)");
let isLargeScreen = media.matches;
let resizeTimer;

// DOM element selectors.
const header = document.getElementById("header");
const themeBtn = document.getElementById("theme-btn");
const navList = document.getElementById("nav-list");
const navBtn = document.getElementById("sidebar-btn");
const navLinks = document.querySelectorAll("nav a");
const sliders = document.querySelectorAll(".slider");
const sliderImgs = document.querySelectorAll(".slider-img");
const dots = document.querySelectorAll(".slider-dot");

// Event listeners.
navBtn.addEventListener("click", toggleSideBar);
themeBtn.addEventListener("click", toggleTheme);

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
navLinks.forEach((link) => {
  // User clicked link and sidebar is shown, hide sidebar.
  link.addEventListener("click", () => {
    if (navList.classList.contains("show")) {
      toggleSideBar();
    }
  });
});

// Add a listener for each slider.
sliders.forEach((slider) => {
  // When the user stops scrolling.
  slider.addEventListener("scrollend", () => {
    // Calculate current index.
    const index = Math.round(slider.scrollLeft / slider.clientWidth);

    // Set proper active state on dots.
    const wrapper = slider.closest(".slider-wrapper");
    const siblingDots = wrapper.querySelectorAll(".slider-dot");
    if (siblingDots.length > 0) {
      siblingDots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }
  });
});

// Add listener to each project slider's dot.
dots.forEach((dot) => {
  dot.addEventListener("click", (e) => {
    const clickedDot = e.target;

    // The image is already active.
    if (clickedDot.classList.contains("active")) {
      return;
    }

    const targetId = clickedDot.getAttribute("data-target");
    const targetElement = document.getElementById(targetId);

    // Scroll the image to the selected one if it exists.
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }

    // Remove the active class from the sibling dots.
    const wrapper = clickedDot.closest(".slider-wrapper");
    const siblingDots = wrapper.querySelectorAll(".slider-dot");
    if (siblingDots.length > 0) {
      siblingDots.forEach((dot) => dot.classList.remove("active"));

      // Add active to the clicked dot.
      clickedDot.classList.add("active");
    }
  });
});

// Add listener to each project image.
sliderImgs.forEach((img) => {
  img.addEventListener("click", (e) => {
    const clickedImg = e.currentTarget;
    let nextImg = clickedImg.nextElementSibling;
    // At the end or no other image to scroll through, cycle to the first.
    if (!nextImg) {
      nextImg = clickedImg.parentElement.firstElementChild;
    }

    // Scroll to the image.
    const targetElement = nextImg.querySelector("img");
    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });

    // Remove the active class from the sibling dots.
    const wrapper = clickedImg.closest(".slider-wrapper");
    const siblingDots = wrapper.querySelectorAll(".slider-dot");
    if (siblingDots.length > 0) {
      siblingDots.forEach((d) => d.classList.remove("active"));

      // Add active to the related dot.
      siblingDots[nextImg.getAttribute("index")].classList.add("active");
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
