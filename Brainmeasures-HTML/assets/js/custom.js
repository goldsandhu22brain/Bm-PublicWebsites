/* Start: Fix Header */
	$(window).scroll(function() {     
		var scroll = $(window).scrollTop();
		if (scroll > 600) {
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

/*Start: Tab as select option */
	$('select.nav-select').on('change',function(){
		var selected_id=$(this).find('option:selected').attr('href');
	   $('.tab-content .tab-pane').removeClass('show active');
	   $(selected_id).addClass('show active');
	 });
/*End: Tab as select option */


