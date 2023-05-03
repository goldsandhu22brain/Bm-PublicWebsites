<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>Hush – Contact Us</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<!--Font Awesome -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<!--Bootstrap 5 css -->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">

	<!-- Style css -->
	<link rel="stylesheet" type="text/css" href="assets/css/style-header.css">
	<link rel="stylesheet" type="text/css" href="assets/css/common.css">
	<link rel="stylesheet" type="text/css" href="assets/css/style.css">
	<link rel="stylesheet" type="text/css" href="assets/css/responsive.css">
	<link rel="stylesheet" type="text/css" href="assets/css/style-footer.css">

</head>

<body>

<header>

	<nav class="navbar navbar-expand-lg fixed-top" id="header">
		<div class="container">
			<a class="navbar-brand p-0 m-0" href="index.html">
				<img src="assets/images/logo.png" class="logo" alt="Logo" />
			</a>
			<ul class="top-app mx-auto d-lg-none d-flex align-items-center">
				<li class="">
					<a class="" href="https://apps.apple.com/us/app/hush-express-freely/id1672847314" target="_blank"><img src="assets/images/icons/app-store.svg" class="img-fluid" alt="" /></a>
				</li>
				<li class="">
					<a class="" href="https://play.google.com/store/apps/details?id=ac.hush.app" target="_blank"><img src="assets/images/icons/google-play.svg" class="img-fluid" alt="" /></a>
				</li>
			</ul>
			<button class="navbar-toggler navbar-toggler-right collapsed" id="toggleBtn" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">				
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse flex-lg-column" id="navbarCollapse">
				<ul class="navbar-nav mx-auto justify-content-end align-items-center d-none d-lg-flex nav-dk">
					<li class="nav-item z-index-9">
						<a class="nav-link" href="index.html"><span>Features</span></a>
					</li>
					<li class="nav-item z-index-9">
						<a class="nav-link" href="community-guidelines.html"><span>Community Guidelines</span></a>
					</li>
					<li class="nav-item z-index-9">
						<a class="nav-link" href="faq.html"><span>FAQ</span></a>
					</li>
				</ul>
				
				<div class="nav-mb d-lg-none">
					<div class="px-3 pb-4 d-flex align-items-center justify-content-between">
						<a class="navbar-brand" href="index.html"><img src="assets/images/logo.png" class="logo" alt="Logo" /></a>
						<button class="navbar-toggler navbar-toggler-right collapsed" id="toggleBtn" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
							<span class="close"><img src="assets/images/icons/close.png" alt="Close" /></span>							
						</button>
					</div>
					
					<ul class="navbar-nav ms-auto justify-content-end px-3">
						<li class="nav-item z-index-9">
							<a class="nav-link" href="index.html"><span>Features</span></a>
						</li>
						<li class="nav-item z-index-9">
							<a class="nav-link" href="community-guidelines.html"><span>Community Guidelines</span></a>
						</li>
						<li class="nav-item z-index-9">
							<a class="nav-link" href="faq.html"><span>FAQ</span></a>
						</li>
						<li class="nav-item z-index-9">
							<a class="nav-link" href="https://play.google.com/store/apps/details?id=ac.hush.app" target="_blank"><img src="assets/images/icons/app-store.svg" class="img-fluid" alt="" /></a>
						</li>
						<li class="nav-item z-index-9">
							<a class="nav-link" href="https://apps.apple.com/us/app/hush-express-freely/id1672847314" target="_blank"><img src="assets/images/icons/google-play.svg" class="img-fluid" alt="" /></a>
						</li>
					</ul>
				</div>
			</div>
			<ul class="navbar-nav ms-auto nav-rigth d-none d-lg-flex">
				<li class="nav-item z-index-9">
					<a class="nav-link" href="https://apps.apple.com/us/app/hush-express-freely/id1672847314" target="_blank"><img src="assets/images/icons/app-store.svg" class="img-fluid" alt="" /></a>
				</li>
				<li class="nav-item z-index-9">
					<a class="nav-link" href="https://play.google.com/store/apps/details?id=ac.hush.app" target="_blank"><img src="assets/images/icons/google-play.svg" class="img-fluid" alt="" /></a>
				</li>
			</ul>
		</div>
	</nav>
	<!-- /*Main Navigation -->

</header>
<!-- /*Header -->

<main class="inner-page contact-page community-page">

	<section class="banner-section">
		<div class="container">
			<div class="wrap">
				<h2><span>Contact Us</span></h2>
			</div>
		</div>
	</section>
	<!-- /*Banner Section -->
	
	<section class="contact-section community-section seperator">
		<div class="container">
			<div class="wrap">
				<h3 class="text-center mb-2">Contact Us</h3>
				<p class="text-center mb-4">For any query please fill below form or mail us on <a href="mailto:contactus@hush.ac">contactus@hush.ac,</a> Thanks!</p>
				
				<p class="text-center mb-4"><?php echo $_SESSION['sess_msg=']; $_SESSION['sess_msg=']='';?></p>
				
				<form method="post" class="row g-3" action="contact-form.php">
					<div class="col-sm-6">
						<label class="form-label">2First Name</label>
						<input type="text" name="first_name" class="form-control" placeholder="First Name" />
					</div>
					<div class="col-sm-6">
						<label class="form-label">Last Name</label>
						<input type="text" name="last_name" class="form-control" placeholder="Last Name" />
					</div>
					<div class="col-md-12">
						<label class="form-label">Email</label>
						<input type="email" name="email" class="form-control" placeholder="Email" />
					</div>
					<div class="col-md-12">
						<label class="form-label">Message</label>
						<textarea name="mesg" class="form-control" rows="4" placeholder="Type your message here..."></textarea>
					</div>
					
					<div class="col-12">
						<button type="submit" class="btn btn-default">Send</button>
					</div>
				</form>
			</div>
		</div>
	</section>
	<!-- /*Banner Section -->

</main>

<footer>
	<div class="container">
		<div class="row g-3 align-items-center">
			<div class="col-md-4">
				<div class="footer-logo">
					<a href="index.html"><img src="assets/images/white-logo.png" class="img-fluid" alt="" /></a>
				</div>
				<div class="copyright">&copy; 2023 Hush</div>
			</div>
			<div class="col-md-4">
				<ul class="footer-nav">
					<li>
						<a href="terms-of-use.html">Terms of Use</a>
					</li>
					<li>
						<a href="privacy-policy.html">Privacy Policy</a>
					</li>
					<li>
						<a href="contact.html">Contact Us</a>
					</li>
				</ul>
			</div>
			<div class="col-md-4">
				<ul class="social">
					<li>
						<a href="https://www.facebook.com/hush.express.freely" target="_blank"><i class="fa fa-facebook-square"></i></a>
					</li>
					<li>
						<a href="javascript:void(0);"><i class="fa fa-twitter-square"></i></a>
					</li>
					<li>
						<a href="javascript:void(0);"><i class="fa fa-linkedin-square"></i></a>
					</li>
					<li>
						<a href="javascript:void(0);"><i class="fa fa-instagram"></i></a>
					</li>
				</ul>
			</div>
		</div>
		
	</div>
	
</footer>
<!-- /*Footer -->

	<!-- scroll to top button 
	<button type="button" id="scrollTop"><i class="fa fa-angle-up"></i></button>
	-->
</body>

	<!-- Bootstrap 5 js -->
	<script src="assets/js/jquery.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
	
	<!-- Custom js -->
	<script src="assets/js/custom.js"></script>
	
</html>
