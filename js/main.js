const navList = document.getElementById("nav-list");
const navBtn = document.getElementById("sidebar-button");
const projectsList = document.getElementById("projects-list");
const projectsBtn = document.getElementById("projects-btn");


const media = window.matchMedia("(width < 480px)");
let isMobile = media.matches;
updateScreen();  // Initialize inert state.
media.addEventListener("change", (e) => {
  isMobile = e.matches;
  updateScreen();
});

const navLinks = document.querySelectorAll("nav a");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (isMobile && navList.classList.contains("show")) {
      toggleSideBar();
    }
  });
});


function toggleSideBar() {
  const isOpen = navList.classList.toggle("show");
  navBtn.classList.toggle("show");
  // Prevent scrolling page when sidebar is open.
  document.body.classList.toggle("no-scroll");

  if (isOpen) {
    // Update ARIA.
    navBtn.setAttribute("aria-expanded", "true");
    navList.removeAttribute("inert");
  } else {
    // Nav bar was closed, make sure projects is closed too.
    closeProjects();
    // Update ARIA.
    navBtn.setAttribute("aria-expanded", "false");
    if (isMobile) {
      // User is on mobile, add inert.
      navList.setAttribute("inert", "");
    }
  }
}

function toggleProjects() {
  const isOpen = projectsList.classList.toggle("show");

  // Projects is open.
  if (isOpen) {
    // Remove listener first to prevent ghost listeners.
    document.removeEventListener("click", closeProjects);
    // Add listener for when user clicks away.
    setTimeout(() => document.addEventListener("click", closeProjects), 0);
    // Update ARIA.
    projectsBtn.setAttribute("aria-expanded", "true");
    projectsList.removeAttribute("inert");
  } else {
    // Close the project since user toggled it off.
    closeProjects();
  }
}

function closeProjects(event = null) {
  // Valid event AND clicked on one of the project related items.
  if (event && (projectsBtn.contains(event.target)
                  || projectsList.contains(event.target))) {
    // Do nothing.
    return;
  }

  // User toggled or clicked somewhere else, close.
  projectsList.classList.remove("show");
  document.removeEventListener("click", closeProjects);
  // Update ARIA.
  projectsBtn.setAttribute("aria-expanded", "false");
  projectsList.setAttribute("inert", "");
}

function updateScreen() {
  // User's screen size is mobile AND navList is hidden.
  if (isMobile && !navList.classList.contains("show")) {
    navList.setAttribute("inert", "");
    closeProjects();
  } else {
    // User's screen size is not mobile, remove inert attribute.
    navList.removeAttribute("inert");
  }
}
