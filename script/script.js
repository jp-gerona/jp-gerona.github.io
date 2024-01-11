function toggleMenu() {
  // Targets the hamburger icon and menu links using the DOM
  const icon = document.querySelector('.menu-links');
  const menu = document.querySelector('.ham-icon');

  // Toggles the "open" class on both elements
  icon.classList.toggle('open');
  menu.classList.toggle('open');
}