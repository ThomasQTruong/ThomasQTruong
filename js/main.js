const navList = document.getElementById('nav-list')
navShown = false

function toggleSideBar(buttonElement) {
  if (!navShown) {
    navList.classList.add('show')
    buttonElement.classList.add('show')
    navShown = true
  } else {
    navList.classList.remove('show')
    buttonElement.classList.remove('show')
    navShown = false
  }
}
