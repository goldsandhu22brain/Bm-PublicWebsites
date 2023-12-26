/*--------------------------------------*/

/* Fix Header
/*--------------------------------------*/
	$(window).scroll(function() {     
		var scroll = $(window).scrollTop();
		if (scroll > 10) {
			$("#header").addClass("active");
		}
		else {
			$("#header").removeClass("active");
		}
	});
/*--------------------------------------*/

/* Back to Top
/*--------------------------------------*/
$(window).scroll(function () {
	if ($(this).scrollTop() > 650) {
		$('#scrollTop').fadeIn();
	} else {
		$('#scrollTop').fadeOut();
	}
});
// scroll up function
$('#scrollTop').click(function () {
	$('html, body').animate({ scrollTop: 0 }, 650);
});
/*--------------------------------------*/

/* Effect
/*--------------------------------------*/
AOS.init({
	disable: 'mobile',
	duration: 1000
});
/*--------------------------------------*/

$(document).ready(function () {
	$(".specialities-slider").slick({
		centerMode: true,
		centerPadding: '0',
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: true,
		speed: 1200,
		autoplaySpeed: 1200,	
		dots: false,
		pauseOnHover: true,
		arrows: true,
		infinite: true,
		
		responsive: [
		{
		  breakpoint: 991,
		  settings: {
			slidesToShow: 3,
		  }
		},
		{
		  breakpoint: 767,
		  settings: {
			slidesToShow: 2,
		  }
		},
		{
		  breakpoint: 575,
		  settings: {
			slidesToShow: 1,
		  }
		},
	  ]
		
	});
});