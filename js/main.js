/**
 * Loads the secret API key if exists for local testing.
 */
async function loadConfig() {
  try {
    const response = await fetch("js/config.js");
    const contentType = response.headers.get("Content-Type");

    // Check if its OK AND if its actually a JS file.
    if (
      response.ok &&
      contentType &&
      contentType.includes("application/javascript")
    ) {
      const script = document.createElement("script");
      script.src = "js/config.js";
      document.head.appendChild(script);
    }
  } catch {
    // Silent error.
  }
}
loadConfig();

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
const sliders = document.querySelectorAll(".slider__track");
const sliderImgs = document.querySelectorAll(".slider__slide");
const dots = document.querySelectorAll(".slider__dot");
const contactForm = document.getElementById("contact-form");
const contactSubmitBtn = document.getElementById("contact-submit-btn");

// Event listeners.
navBtn.addEventListener("click", toggleSideBar);
themeBtn.addEventListener("click", toggleTheme);

// Listen to page size changes and update accordingly.
updateScreen(); // Initialize inert state.
media.addEventListener("change", (e) => {
  // Stop all animations while resizing.
  document.body.classList.add("u-no-animate");

  isLargeScreen = e.matches;
  updateScreen();

  // Debounce: Remove the stopper once resizing stops.
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("u-no-animate");
  }, 400);
});

// Enable floating navbar when scrolled past a distance.
window.addEventListener("scroll", function () {
  if (sidebarIsOpen) {
    return;
  }

  if (window.scrollY > 200) {
    header.classList.add("header--sticky");
  } else {
    header.classList.remove("header--sticky");
  }
});

// Add listener to each nav link.
navLinks.forEach((link) => {
  // User clicked link and sidebar is shown, hide sidebar.
  link.addEventListener("click", () => {
    if (navList.classList.contains("is-visible")) {
      toggleSideBar();
    }
  });
});

// Add a listener for each slider.
sliders.forEach((slider) => {
  const slides = slider.children;
  const sliderDots = slider.parentElement.querySelectorAll(".slider__dot");

  // Flag to lock the slider to prevent over-animating slider dots.
  slider.dataset.isLocked = "false";

  // Observes the imgs to see if the user scrolls past 50% of the image.
  const observer = new IntersectionObserver(
    (entries) => {
      // Slider is locked, do not over-animate the slider dots.
      if (slider.dataset.isLocked === "true") return;

      // For each image.
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Obtain img's index.
          const index = Array.from(slides).indexOf(entry.target);

          // Set proper dot states.
          const activeDot = sliderDots[index];
          if (activeDot) {
            sliderDots.forEach((dot) => {
              dot.classList.remove("is-active");
              dot.ariaCurrent = "false";
            });
            activeDot.classList.add("is-active");
            activeDot.ariaCurrent = "true";
          }
        }
      });
    },
    { root: slider, threshold: 0.5 },
  );

  Array.from(slides).forEach((slide) => observer.observe(slide));
});

// Add listener to each project slider's dot.
dots.forEach((dot) => {
  dot.addEventListener("click", (e) => {
    const clickedDot = e.target;

    // The image is already active.
    if (clickedDot.classList.contains("is-active")) {
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
  });
});

// Add listener to each project image.
sliderImgs.forEach((img) => {
  img.addEventListener("click", (e) => {
    const clickedImg = e.currentTarget;
    const nextImg = clickedImg.nextElementSibling;
    // At the end or no other image to scroll through, cycle to the first.
    if (!nextImg) {
      sliderGoToStart(clickedImg.parentElement);
      return;
    }

    // Scroll to the image.
    const targetElement = nextImg.querySelector("img");
    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  });
});

// Add listener to when the user submits the contact form.
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const textSpan = contactSubmitBtn.lastElementChild;
  const btnText = textSpan.textContent;
  contactSubmitBtn.disabled = true;
  textSpan.textContent = "Sending...";

  // Parse data.
  const data = new FormData(contactForm);
  const queryString = new URLSearchParams(data).toString();

  // Retrieve API key.
  const G_SCRIPT_URL = window.G_SCRIPT_URL_LOCAL
    ? window.G_SCRIPT_URL_LOCAL
    : "API_URL_PLACEHOLDER";

  // If the placeholder hasnt been replaced, try local.
  if (G_SCRIPT_URL === "API_URL" + "_PLACEHOLDER") {
    console.error("API URL not configured.");
    alert(
      "Something went wrong in sending the message, please try again later.",
    );
    return;
  }

  // Send the information to the API.
  fetch(`${G_SCRIPT_URL}?${queryString}`, {
    method: "GET",
    mode: "no-cors",
  })
    .then(() => {
      alert("Message sent! I'll get back to you soon.");
      contactForm.reset();
      contactSubmitBtn.disabled = false;
      textSpan.textContent = btnText;
    })
    .catch((err) => {
      alert("Something went wrong in sending the message, please try again.");
      console.error("Error sending message:", err);
      contactSubmitBtn.disabled = false;
      textSpan.textContent = btnText;
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
  if (!navList.classList.contains("is-visible")) {
    navList.classList.add("is-visible");
    navBtn.classList.add("is-visible");

    // Wait for open/close animation.
    setTimeout(() => {
      // Remember position on page.
      scrollPosition = window.scrollY;
      // document.body.style.top = `-${scrollPosition}px`;

      // Update ARIA and inert.
      navBtn.setAttribute("aria-expanded", "true");
      navList.inert = false;

      // Prevent scrolling page when sidebar is open.
      document.body.classList.add("is-no-scroll");
    }, 400);
  } else {
    // Prevent scrolling page when sidebar is open.
    document.body.classList.remove("is-no-scroll");
    header.classList.add("u-no-animate");

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
        header.classList.remove("u-no-animate");
        // Close nav bar with animations.
        navList.classList.remove("is-visible");
        navBtn.classList.remove("is-visible");
      });
    });
  }
}

/**
 * Toggles the theme (light/dark mode).
 * @returns {void}
 */
function toggleTheme() {
  const isLightMode = document.documentElement.classList.toggle("is-light-mode");

  themeBtn.setAttribute("aria-pressed", String(isLightMode));
}

/**
 * Synchronizes Nav accessibility states
 * based on current viewport size and visibility.
 * @returns {void}
 */
function updateScreen() {
  // User"s screen size is mobile AND navList is hidden.
  const isHidden = !isLargeScreen && !navList.classList.contains("is-visible");

  navList.inert = isHidden;
}

/**
 * Moves the specific slider to the starting image while locking the slider
 * so that it does not over-animate the slider dots.
 * @param {HTMLElement} slider - the slider being interacted with.
 */
function sliderGoToStart(slider) {
  // Lock the slider nav from animating.
  slider.dataset.isLocked = "true";

  // Set proper dot active states.
  const sliderDots = slider.parentElement.querySelectorAll(".slider__dot");
  sliderDots.forEach((dot) => {
    dot.classList.remove("is-active");
    dot.ariaCurrent = "false";
  });
  if (sliderDots.length > 0) {
    sliderDots[0].classList.add("is-active");
    sliderDots[0].ariaCurrent = "true";
  }

  // Scroll to the start.
  slider.scrollTo({ left: 0, behavior: "smooth" });

  // Enable slider nav to animate again.
  setTimeout(() => {
    slider.dataset.isLocked = "false";
  }, 200);
}
