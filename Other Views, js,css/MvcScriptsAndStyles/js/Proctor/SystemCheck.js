var imageAddr = "https://www.brainmeasures.com/images/022.jpg";
var downloadSize = 1995374; //bytes

function InitiateSpeedDetection() {
    window.setTimeout(MeasureConnectionSpeed, 1);
};

if (window.addEventListener) {
    window.addEventListener('load', InitiateSpeedDetection, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', InitiateSpeedDetection);
}

function MeasureConnectionSpeed() {
    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    }

    function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);

        if (speedMbps >= 1.0) {
            $('#speed-error').addClass('d-none');
            $('#speed-success').removeClass('d-none');
            if (Isvalid) {
                $('#go-button').removeAttr('disabled');
            }
        }
        else {
            $('#speed-error').removeClass('d-none');
            $('#speed-success').addClass('d-none');
        }
    }

    download.onerror = function (err, msg) {
        $('#speed-error').removeClass('d-none');
        $('#speed-success').addClass('d-none');
    }

    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
}

var Isvalid = true;
var imgwebrtc = true;
var Isflash = true;
function onDetectRTCLoaded() {
    var name = DetectRTC.osName;
    //alert("OS : " + name);
    if (name == 'Windows' || name.toUpperCase().indexOf('MAC') >= 0) {
        $('#os-error').addClass('d-none');
        $('#os-success').removeClass('d-none');
    }
    else {
        $('#os-error').removeClass('d-none');
        $('#os-success').addClass('d-none');
        Isvalid = false;
    }
    if (DetectRTC.browser != null && DetectRTC.browser.isChrome != null && DetectRTC.browser.isChrome) {
        $('#browser-error').addClass('d-none');
        $('#browser-success').removeClass('d-none');
    }
    else {
        $('#browser-error').removeClass('d-none');
        $('#browser-success').addClass('d-none');
        Isvalid = false;
    }

    if (DetectRTC.hasMicrophone) {
        $('#mic-error').addClass('d-none');
        $('#mic-success').removeClass('d-none');
    }
    else {
        $('#mic-error').removeClass('d-none');
        $('#mic-success').addClass('d-none');
        Isvalid = false;
    }

    if (DetectRTC.hasSpeakers) {
        $('#speaker-error').addClass('d-none');
        $('#speaker-success').removeClass('d-none');
    }
    else {
        $('#speaker-error').removeClass('d-none');
        $('#speaker-success').addClass('d-none');
        Isvalid = false;
    }

    if (DetectRTC.isWebRTCSupported) {
    }
    else {
        Isvalid = false;

        if (imgwebrtc == true) {
            imgwebrtc == false;
        }
    }

    if (DetectRTC.hasWebcam) {
        $('#cam-error').addClass('d-none');
        $('#cam-success').removeClass('d-none');
    }
    else {
        $('#cam-error').removeClass('d-none');
        $('#cam-success').addClass('d-none');
        Isvalid = false;
    }
    if (DetectRTC.isWebSocketsSupported) {
    }
    else {
        Isvalid = false;
    }
}

function reloadDetectRTC() {
    DetectRTC.load(onDetectRTCLoaded);
}

DetectRTC.load(function () {
    reloadDetectRTC();

    if (DetectRTC.MediaDevices[0] && DetectRTC.MediaDevices[0].label === 'Please invoke getUserMedia once.') {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(reloadDetectRTC).catch(reloadDetectRTC);
        return;
    }

    onDetectRTCLoaded();
});

$(document).ready(function () {
    reloadDetectRTC();
});