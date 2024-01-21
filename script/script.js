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


/*
 * Adds a scroll event listener that checks the scroll position on scroll and toggles an 'active' class on the navigation menu links based on the visible section in the viewport.
 */
window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const scrollY = window.scrollY;

    sections.forEach(current => {
        let sectionHeight = current.offsetHeight;
        let sectionTop = current.offsetTop - 50;
        let id = current.getAttribute("id");

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(".nav-menu a[href*=" + id + "]").classList.add("active");
        }
        else {
            document.querySelector(".nav-menu a[href*=" + id + "]").classList.remove("active");
        }
    });
});


/*
 * Adds a scroll event listener that checks the scroll position on scroll.  For each section element with the "reveal" class, it checks if the section is in view (offset by 55). If a section is in view, it adds the "active" class to that section.
 */
window.addEventListener("scroll", () => {

    const sections = document.querySelectorAll("section.reveal");
  
    sections.forEach(section => {
  
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight ;
      const sectionEnd = sectionTop + sectionHeight;
      
      const scrollY = window.scrollY;
  
      if(scrollY > sectionTop - 170 && scrollY <= sectionEnd) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
  
    });
  
});

/*
 * Parallax.js External library. Adds a parallax effect for the character and star image. It needs data-depth (between 0 and 1) as a parameter. The movement will be multiplied by its depth value.
 * Thanks to https://github.com/wagerfield/parallax
 */
var homeScene = document.getElementById('home-scene');
var parallaxInstance = new Parallax(homeScene);
var starsScene = document.getElementById('stars-scene');
var parallaxInstance = new Parallax(starsScene);
  