
/* ========================================== 
MENU RESPONSIVE
========================================== */
$(function () {
    const header = $('header').outerHeight();
    console.log(header);
    const burgerMenu = document.getElementById("burger");
    const navbarMenu = document.getElementById("menu-nav");

    // Show and Hide Navbar Menu
    burgerMenu.addEventListener("click", () => {
        burgerMenu.classList.toggle("is-active");
        navbarMenu.classList.toggle("is-active");

        if (navbarMenu.classList.contains("is-active")) {
            //   navbarMenu.style.height = 400+ "px";
            $("#menu").css("height", "calc(100vh - " + header + "px)")
            //  navbarMenu.style.maxHeight = navbarMenu.scrollHeight + "px";

        } else {
            navbarMenu.removeAttribute("style");
        }
    });
});










