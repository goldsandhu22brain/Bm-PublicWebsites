/* Start: Fix Header Strip */
	$(window).scroll(function() {     
		var scroll = $(window).scrollTop();
		if (scroll > 10) {
			$("#header-strip").addClass("active");
		}
		else {
			$("#header-strip").removeClass("active");
		}
	});
/* End: Fix Header Strip */

/* Start: Fix Header */
	$(window).scroll(function() {     
		var scroll = $(window).scrollTop();
		if (scroll > 10) {
			$("#header").addClass("active");
		}
		else {
			$("#header").removeClass("active");
		}
	});
/* End: Fix Header */

/*Start: Back to Top */
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
/*End: Back to Top */



$(".submenu-toggle1").click(function() {
	$('.menu1').toggle(''); 
	$('.submenu-toggle1').addClass('active')
	$('.submenu-toggle2').removeClass('active')		
	$('.menu2').hide(''); 		
  });
  $(".submenu-toggle2").click(function() {
	$('.menu2').toggle('');  	
	$('.submenu-toggle2').addClass('active')
	$('.submenu-toggle1').removeClass('active')		
	$('.menu1').hide(''); 		
  });
  $(".submenu-toggle3").click(function() {
	$('.menu3').toggle(''); 
	$('.submenu-toggle3').addClass('active')
  });
  $(".submenu-toggle4").click(function() {
	$('.menu4').toggle(''); 
	$('.submenu-toggle4').addClass('active')
  });
 
  $(".dropdown-toggle").hover(function() {
	$('this').addClass('active')
});

$(".toggler").click(function() {
	$('.toggler').addClass('d-none'); 
	$('.toggler-close').addClass('d-block');
	$('.toggler-close').removeClass('d-none');
});
$(".toggler-close").click(function() {
	$('.toggler-close').addClass('d-none'); 
	$('.toggler').addClass('d-block'); 
	$('.toggler').removeClass('d-none'); 
});