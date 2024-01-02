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

// below function to add purple bg in header whenever user scroll down for better visibility - 02-01-24 Tosif
$(window).scroll(function () {
    var nav = $('.d-nav');
    var top = 50;
    if ($(window).scrollTop() >= top) {

        nav.addClass('nav-bg-purple');

    } else {
        nav.removeClass('nav-bg-purple');
    }
});

// text transcript below 02-02-24 Tosif
function ValidateTranscript() {

    var message = '';
    var isValid = true;
    if ($('#txtTranscriptNoNew').val().trim() == '') {

        isValid = false;
        message += 'Please enter transcript no.';

    }
    if ($('#txtTranscriptNoNew').val().trim() != '') {
        if (!parseInt($('#txtTranscriptNoNew').val())) {
            isValid = false;
            message += 'Please enter transcript no. in numeric format.';

        }
        else if ($('#txtTranscriptNoNew').val().length > 20) {
            isValid = false;
            message += 'Length of transcript no. cannot exceed 20 characters.';
            // window.location.href = "../Individual/Transcript.aspx?transcriptid=" + $('#txtTranscriptNoNew').val();
        }
    }

    if (!isValid) {
        //message += '</ul>';
        alert(message);
		    return false;

    }
	else
	{
		window.location.href = "Transcript.aspx?transcriptid=" + $('#txtTranscriptNoNew').val();
	}
}
