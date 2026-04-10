// DOM element selectors.
const navList = document.getElementById("nav-list");
const navListBackground = document.getElementById("nav-list-background");
const navBtn = document.getElementById("sidebar-btn");
const projectsList = document.getElementById("projects-list");
const projectsBtn = document.getElementById("projects-btn");
const projectsContainer = document.querySelector(".projects-container");

// Event listeners.
navBtn.addEventListener("click", toggleSideBar);
projectsBtn.addEventListener("click", toggleProjects);

// Listen to page size changes and update accordingly.
const media = window.matchMedia("(width < 480px)");
let isMobile = media.matches;
updateScreen(); // Initialize inert state.
media.addEventListener("change", (e) => {
  isMobile = e.matches;
  updateScreen();
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

// Add listener for hovering Projects menu, hover = no inert.
projectsContainer.addEventListener("mouseenter", () => {
  projectsList.inert = false;
});

// Add listener for when user stops hovering Projects menu, no hover = inert.
projectsContainer.addEventListener("mouseleave", () => {
  if (!projectsList.classList.contains("show")) {
    projectsList.inert = true;
  }
});

/**
 * Toggles the visibility of the mobile navigation sidebar.
 * Updates ARIA and inert attributes, toggles the "show" class,
 * and prevents body scrolling when the menu is active.
 * @returns {void}
 */
function toggleSideBar() {
  const isOpen = navList.classList.toggle("show");
  navBtn.classList.toggle("show");
  navListBackground.classList.toggle("show");
  // Prevent scrolling page when sidebar is open.
  document.body.classList.toggle("no-scroll");

  if (isOpen) {
    // Update ARIA and inert.
    navBtn.setAttribute("aria-expanded", "true");
    navList.inert = false;
  } else {
    // Nav bar was closed, make sure projects is closed too.
    closeProjects();
    // Update ARIA and inert.
    navBtn.setAttribute("aria-expanded", "false");
    if (isMobile) {
      // User is on mobile, add inert.
      navList.inert = true;
    }
  }
}

/**
 * Toggles the visibility of the Projects dropdown menu.
 * Updates ARIA and inert attributes and toggles the "show" class.
 * @returns {void}
 */
function toggleProjects() {
  const isOpen = projectsList.classList.toggle("show");

  // Projects is open.
  if (isOpen) {
    // Remove listener first to prevent ghost listeners.
    document.removeEventListener("click", closeProjects);
    // Add listener for when user clicks away.
    setTimeout(() => document.addEventListener("click", closeProjects), 0);
    // Update ARIA and inert.
    projectsBtn.setAttribute("aria-expanded", "true");
    projectsList.inert = false;
  } else {
    // Close the project since user toggled it off.
    closeProjects();
  }
}

/**
 * Closes the projects dropdown menu depending on event.
 * Hides the Projects menu, updates ARIA attributes, and enables inert
 * if the user clicked outside of the menu OR if no event was passed.
 * @param {MouseEvent|nul} [event=null] - The click event.
 * @returns {void}
 */
function closeProjects(event = null) {
  // Valid event.
  if (event) {
    // Clicked on one of the project related items.
    if (
      projectsBtn.contains(event.target) ||
      projectsList.contains(event.target)
    ) {
      // Do nothing.
      return;
    }

    // User toggled or clicked somewhere else, close.
    projectsList.classList.remove("show");
    projectsList.inert = true;
  }

  // Continuing closing process including for non-events.
  document.removeEventListener("click", closeProjects);
  // Update ARIA.
  projectsBtn.setAttribute("aria-expanded", "false");
}

/**
 * Synchronizes Nav and Project menu accessibility states
 * based on current viewport size and visibility.
 * @returns {void}
 */
function updateScreen() {
  // User"s screen size is mobile AND navList is hidden.
  if (isMobile && !navList.classList.contains("show")) {
    navList.inert = true;
    closeProjects();
  } else {
    // User"s screen size is not mobile, remove inert attribute.
    navList.inert = false;
  }
}
