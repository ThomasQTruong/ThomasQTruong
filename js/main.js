const navList = document.getElementById("nav-list");
const projectsList = document.getElementById("projects-list");
const projectsBtn = document.getElementById("projects-btn");


function toggleSideBar(btn) {
  const isOpen = navList.classList.toggle("show");
  btn.classList.toggle("show");

  if (isOpen) {
    // Update ARIA.
    btn.setAttribute("aria-expanded", "true");
  } else {
    // Nav bar was closed, make sure projects is closed too.
    closeProjects();
    // Update ARIA.
    btn.setAttribute("aria-expanded", "false");
  }
}

function toggleProjects() {
  const isOpen = projectsList.classList.toggle("show");

  // Projects is open.
  if (isOpen) {
    // Add listener for when user clicks away.
    setTimeout(() => document.addEventListener("click", closeProjects), 0);
    // Update ARIA.
    projectsBtn.setAttribute("aria-expanded", "true");
  } else {
    // Close the project since user toggled it off.
    closeProjects()
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
}
