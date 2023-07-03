function DisplayAlert(type, msg = "") {
	var title = $('.warning-display').attr("data-bs-original-title");
	var list = [];
	var TitleValue = "";
	if (title != "" && title != null) {
		list = $(title);
		var Ids = ["fullScreen", "mouseActivity", "debuggerCheck", "webcamCheck", "NoFaceDetection", "MultiFaceDetection", "FaceDetectionError"];
		if (Ids.includes(type)) {
			TitleValue = TitleValue + AlertType(type, msg);
		}
		for (var a = 0; a < list.length; a++) {
			var Id = list[a].id;
			if (type == Id) { }
			else if (Ids.includes(Id)) {
				TitleValue = TitleValue + AlertType(Id, msg);
			}
		}
	}
	else {
		TitleValue = AlertType(type, msg);
	}
	if (TitleValue != null && TitleValue != "") {
		if ($(".test-small-text").hasClass("d-none")) {
			$(".test-small-text").removeClass("d-none");
		}
	}
	else {
		if (!$(".test-small-text").hasClass("d-none")) {
			$(".test-small-text").addClass("d-none");
		}
	}
	$('.warning-display').attr("data-bs-original-title", TitleValue);
}
function GetDisplayAlert(type) {
	var title = $('.warning-display').attr("data-bs-original-title");
	var list = [];
	var valid = false; 
	if (title != "" && title != null) {
		list = $(title);
		var Ids = ["fullScreen", "mouseActivity", "debuggerCheck", "webcamCheck", "NoFaceDetection", "MultiFaceDetection", "FaceDetectionError"];				
		for (var a = 0; a < list.length; a++) {
			var Id = list[a].id;
			if (type == Id) {
				valid = true;
				break;
			}			
		}
	}
	return valid;
}
function AlertType(type, msg = "") {
	var text = "";
	if (type == "fullScreen") {
		text = '<p id="fullScreen">Full-screen mode is always active</p></br>';
	}
	else if (type == "mouseActivity") {
		text = '<p id="mouseActivity">Mouse is always in the assessment window</p></br>';
	}
	else if (type == "debuggerCheck") {
		text = '<p id="debuggerCheck">Tried to break Test</p></br>';
	}
	else if (type == "webcamCheck") {
		text = '<p id="webcamCheck">Webcam enabled</p></br>';
	}
	else if (type == "NoFaceDetection" || type == "MultiFaceDetection" || type == "FaceDetectionError") {
		text = '<p id="' + type +'">'+msg+'</p></br>';
	}
	return text;
}
function getBaseUrl() {
	return "/Test";
}

function PushTracking(activityId, questionNo = "") {

	$.ajax({
		url: '/Tracker/ReportActions',
		type: 'POST',
		data: { ActivityType: activityId, Details: questionNo },
		success: function (response) {
			//if (isProctorLive) {
				//UserAlertTrigger();				
			//}
		},
		error: function () {
		},
	});
}

///* Get into full screen */
function GoInFullscreen(element) {
	if (element.requestFullscreen)
		element.requestFullscreen();
	else if (element.mozRequestFullScreen)
		element.mozRequestFullScreen();
	else if (element.webkitRequestFullscreen)
		element.webkitRequestFullscreen();
	else if (element.msRequestFullscreen)
		element.msRequestFullscreen();
}


///* Is currently in full screen or not */
function IsFullScreenCurrently() {
	var full_screen_element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;

	// If no element is in full-screen
	if (full_screen_element === null)
		return false;
	else
		return true;
}

function LoadQuestion() {
	var isExists = document.getElementById('InjectTest');
	if (isExists != null) {
		PushTracking(200);
		$("#fullScreenElement").hide();
		var fullScreen = GetDisplayAlert("fullScreen");
		var mouseActivity = GetDisplayAlert("mouseActivity");
		var debuggerCheck = GetDisplayAlert("debuggerCheck");
		var url = getBaseUrl() + "/LoadTest?Id=" + testingId;
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'html',
			data: {},
			cache: false,
			beforeSend: function () {
				$('.ajax-loader').css("visibility", "visible");
			},
			success: function (response) {
				var result = response;
				$('#InjectTest').replaceWith(result);
				Timer();
				Disable_Keys();
				DisableMouseRightClick();
				DisableCutCopyPaste();
			},
			complete: function () {
				$('.ajax-loader').css("visibility", "hidden");
			},
			error: function () {
				WarningSection(fullScreen, mouseActivity, debuggerCheck);
			}
		});
		if (typeof (syncChatMessage) != 'undefined') {
			syncChatMessage();
		}
	}
}
function InitiatingTimer() {
	//for timer
	var timer;
	var timerExamInterval;
	if (document.getElementById("exam-timer") != null) {
		var minutes, seconds;
		timerExamInterval = setInterval(countExamTimer, 1000);
		if (initialTimer && !window.pauseAll) {
			var duration = 60 * totalMcqTime;
			timer = duration, minutes, seconds;
			initialTimer = false;
		}

		function countExamTimer() {
			if (!window.pauseAll) {
				minutes = parseInt(timer / 60, 10);
				seconds = parseInt(timer % 60, 10);

				minutes = minutes < 10 ? "0" + minutes : minutes;
				seconds = seconds < 10 ? "0" + seconds : seconds;

				if (document.getElementById("exam-timer") != null) {
					document.getElementById("exam-timer").innerHTML = maxMcqTime + " / " + minutes + ":" + seconds;
				}
				if (--timer < 0) {
					timer = duration;
					SubmitTestAutomatically();
				}
			}
		}
	}

}
function Timer() {
	InitiatingTimer();
	var debuggerCheck = false;
	setInterval(function () {
		var startTime = performance.now(), check, diff;
		for (check = 0; check < 1000; check++) {
			//	console.log(check);
			//console.clear();
		}
		diff = performance.now() - startTime;
		if (diff > 200 || debuggerCheck) {
			DisplayAlert("debuggerCheck");			
			debuggerCheck = true;
			PushTracking(120);
		}
	}, 500);

	$(window).blur(function () {
		DisplayAlert("mouseActivity");		
		PushTracking(110);
	});
}

$(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function () {
	//if (IsFullScreenCurrently()) {
	LoadQuestion();
	if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
		//TODO: Make Ajax Call to Send Tracking
		PushTracking(8);
		DisplayAlert("fullScreen");				
		//if (isProctor) {
		//	pauseTest();
		//}
	}

});
var QuizButton = setInterval(() => {
	if (document.getElementById('load-test') != null) {
		clearInterval(QuizButton);
		document.getElementById('load-test').onclick = function () {
			if (!IsFullScreenCurrently())
				GoInFullscreen(document.documentElement);
		}
	}	
}, 1000);
//$(document).ready(function () {
//	if (!IsFullScreenCurrently())
//		GoInFullscreen(document.documentElement);
//});

//Keyboard Keys Disable 
function Disable_Keys() {
	document.addEventListener("keydown", function (event) {
		if (event.ctrlKey) {
			PushTracking(48);
			return false;
		}
		if (event.altKey) {
			PushTracking(47);
			return false;
		}
		if (event.keyCode === 44) {
			//PrintScreen
			alert("PrintScreen is disabled.");
			PushTracking(44);
			return false;
		}
		if (event.keyCode === 122) {
			//F11
			PushTracking(122);
			return false;
		}
		if (event.keyCode === 123) {
			//F12
			alert("Developer Tool is disabled.");
			PushTracking(123);
			return false;
		}
		if (event.keyCode === 116) {
			//f5
			alert("Refresh Page is disabled.");
			PushTracking(116);
			return false;
		}
	});
}
function DisableCutCopyPaste() {
	//Disable cut copy paste
	$('body').bind('cut copy paste', function (e) {
		//alert("cut copy paste functionalities are disabled.");		
		PushTracking(49);
		alert("Cut copy paste functionalities are disabled.");
		iscontext = true;
		e.preventDefault();
		return false;
	});
}
function DisableMouseRightClick() {
	window.oncontextmenu = function () {
		//alert("right click is disabled for this page.");
		PushTracking(50);
		alert("Right click is disabled for this page.");
		iscontext = true;
		return false;
	}
}

$(window).on('load', function () {
	$('.ajax-loader').css("visibility", "hidden");
})