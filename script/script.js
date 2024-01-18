/*
 * Toggles the open class on the hamburger icon and menu links elements to open/close the menu using the onclick event.
 */
function toggleMenu() {
  // Targets the hamburger icon and menu links using the DOM
  const icon = document.querySelector('.menu-links');
  const menu = document.querySelector('.ham-icon');

  // Toggles the "open" class on both elements
  icon.classList.toggle('open');
  menu.classList.toggle('open');
}

/*
 * Opens and closes project modals on click
 */
// Targets all project modals, img cards, and close buttons
const projectModals = document.querySelectorAll('.project-modal');
const imgCards = document.querySelectorAll('.img-card');
const projectCloseBtns = document.querySelectorAll('.project-close-btn');

// Adds the open class to project modals
var projectModal = function (modalclick) {
  projectModals[modalclick].classList.add('open');
}

// Adds the event listener for adding the open class to project modals when the user clicks the img cards
imgCards.forEach((imgCard, i) => {
  imgCard.addEventListener("click", () => {
    projectModal(i);
  });
});

// Removes the open class from project modals when the user clicks the close button
projectCloseBtns.forEach((projectCloseBtn) => {
  projectCloseBtn.addEventListener("click", () => {
    projectModals.forEach((projectModalView) => {
      projectModalView.classList.remove('open');
    });
  });
});