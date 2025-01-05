//----------START: ERERVYTHING CONCERNING THE UI--------------//

// First event listener for menu-toggle
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
  
  // Second event listener for menu-buttons (separate logic for buttons)
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
  
  document.addEventListener("DOMContentLoaded", () => {
    const toggleButtons = document.querySelectorAll(".toggle-textarea");
  
    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-target");
        const textarea = document.getElementById(targetId);
  
        if (textarea) {
          textarea.classList.toggle("active");
        }
      });
    });
  });
  