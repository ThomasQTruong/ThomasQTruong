const navList = document.getElementById('nav-list');
const projectsList = document.getElementById('projects-list');


function toggleSideBar(btn) {
  const isOpen = navList.classList.toggle('show');
  btn.classList.toggle('show');

  // Nav bar was closed, make sure projects is closed too.
  if (!isOpen) {
    closeProjects();
  }
}

function toggleProjects() {
  const isOpen = projectsList.classList.toggle('show');

  // Projects is open, add listener for when user clicks away.
  if (isOpen) {
    setTimeout(() => document.addEventListener('click', closeProjects), 0);
  } else { 
    // Projects is closed, remove listener.
    document.removeEventListener('click', closeProjects);
  }
}

function closeProjects(event = null) {
  // Valid event AND clicked on one of the project related items.
  if (event && projectsList.contains(event.target)) {
    // Do nothing.
    return;
  }

  // User toggled or clicked somewhere else, close.
  projectsList.classList.remove('show');
  document.removeEventListener('click', closeProjects);
}
