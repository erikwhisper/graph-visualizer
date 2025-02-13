//----------START: ERERVYTHING CONCERNING THE UI--------------//

/***********************************************************/
/************START: Website Navigation Functions************/
/***********************************************************/

//First event listener for menu-toggle
document.addEventListener("DOMContentLoaded", () => {
  const navigationBarButton = document.getElementById("right-slidemenu-toggle");
  const slideMenuMinor = document.getElementById("right-slidemenu-minor");
  const slideMenuMajor = document.querySelectorAll(".right-slidemenu-major");

  navigationBarButton.addEventListener("click", () => {
    const isActive = slideMenuMinor.classList.contains("active");

    if (isActive) {
      slideMenuMajor.forEach((menu) => menu.classList.remove("active"));
    }

    slideMenuMinor.classList.toggle("active");
  });
});

//Second event listener for menu-buttons (separate logic for buttons)
document.addEventListener("DOMContentLoaded", () => {
  const slideMenuMinorButtons = document.querySelectorAll(
    "#right-slidemenu-minor-buttons button"
  );
  const slideMenuMajor = document.querySelectorAll(".right-slidemenu-major");

  slideMenuMinorButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const currentSlideMenuMajor = document.getElementById(
        `menu-content-${index + 1}`
      );

      if (currentSlideMenuMajor) {
        const isActive = currentSlideMenuMajor.classList.contains("active");

        slideMenuMajor.forEach((menu) => menu.classList.remove("active"));

        if (!isActive) {
          currentSlideMenuMajor.classList.add("active");
        }
      }
    });
  });
});

//Third event listener
document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".toggle-textarea");
  const updateButtons = document.querySelectorAll(".update-button");

  // Hide all update buttons initially
  updateButtons.forEach((button) => {
    button.style.display = "none";
  });

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const textarea = document.getElementById(targetId);

      // Find the related button within the same section
      const section = button.closest("section");
      const relatedButton = section.querySelector(".update-button");

      if (textarea && relatedButton) {
        textarea.classList.toggle("active");
        relatedButton.style.display = textarea.classList.contains("active")
          ? "block"
          : "none";
      }
    });
  });
});





/***********************************************************/
/*************END: Website Navigation Functions*************/
/***********************************************************/

/***********************************************************/

//todo: in the future add every event-listener here?
//do that after i know what my button layout is gonna look like, when i added admg button
//and turned the transform buttons into download as .txt or .csv or .json
//whats with the eventlisteners from contextmenus? do they stay in the contextmenu? probably yeah?
//should i make an own contextmenu.js file?

//----------END: ERERVYTHING CONCERNING THE UI--------------//
