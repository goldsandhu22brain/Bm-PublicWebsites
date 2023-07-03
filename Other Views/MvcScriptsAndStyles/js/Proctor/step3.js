
var browserFeaturesTable = document.querySelector('#tblProd');

var imageAddr = "https://www.brainmeasures.com/images/022.jpg";
var downloadSize = 1995374; //bytes
var tr = document.createElement('tr');
var tbdy = document.createElement('tbody');
tr.innerHTML = '<td><i class="glyphicon"></i>Download/Install plugin</td><td><a href="#" data-toggle="modal" data-target="#DivPlugin">Download</a></td>';
//browserFeaturesTable.appendChild(tbdy);

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
            $('#imgband').attr('src', '../dist/img/system/tick.png');

            if (Isvalid == true) {
                $('#hfreNext').show();
            }
            else {
                $('#hfreNext').hide();
            }
        }
        else {
            $('#imgband').attr('src', '../dist/img/system/unchecked.png');
            $('#imgband').addClass('stepred');
        }
    }

    download.onerror = function (err, msg) {
        $('#imgband').attr('src', '../dist/img/system/unchecked.png');
        $('#imgband').addClass('stepred');
    }

    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
}


function appendTR(firstValue, secondValue) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td><i class="glyphicon glyphicon-remove"></i>' + firstValue + '</td><td><a href="' + secondValue + '" target="_blank">Download</a></td>';
    //browserFeaturesTable.appendChild(tr);
    return tr;
}

var Isvalid = true;
var imgwebrtc = true;
var Isflash = true;
function onDetectRTCLoaded() {
   var name = DetectRTC.osName;
	//alert("OS : " + name);
    if (name == 'Windows' || name.toUpperCase().indexOf('MAC')>=0) {
        $('#imgos').attr('src', '../dist/img/system/tick.png');
        $('#divos').addClass('stepgreen');
    }
    else {
        $('#imgos').attr('src', '../dist/img/system/unchecked.png');
        $('#divos').removeClass('stepgreen');
        $('#divos').addClass('stepred');
        Isvalid = false;
    }
    if (DetectRTC.browser.isChrome) {
        $('#imgbrowser').attr('src', '../dist/img/system/tick.png');
        $('#divbrowser').addClass('stepgreen');
    }
    else {
        $('#imgbrowser').attr('src', '../dist/img/system/unchecked.png');
        $('#divbrowser').removeClass('stepgreen');
        $('#divbrowser').addClass('stepred');
        Isvalid = false;
    }

    if (DetectRTC.hasMicrophone) {
        $('#imgmicro').attr('src', '../dist/img/system/tick.png');
        $('#divmicro').addClass('stepgreen');
    }
    else {
        $('#imgmicro').attr('src', '../dist/img/system/unchecked.png');
        $('#divmicro').removeClass('stepgreen');
        $('#divmicro').addClass('stepred');
        Isvalid = false;
    }

    if (DetectRTC.isWebRTCSupported) {
        $('#imgwebrtc').attr('src', '../dist/img/system/tick.png');
        $('#divwebrtc').addClass('stepgreen');
    }
    else {
        $('#imgwebrtc').attr('src', '../dist/img/system/unchecked.png');
        $('#divwebrtc').removeClass('stepgreen');
        $('#divwebrtc').addClass('stepred');
        Isvalid = false;

        if (imgwebrtc == true) {
            var tr = document.createElement('tr');
            tr.innerHTML = '<td><i class="glyphicon glyphicon-remove"></i>WebRTC Extension is missing</td><td><a href="#" data-toggle="modal" data-target="#DivPlugin">See How to Install</a></td>';
          //  browserFeaturesTable.appendChild(tr);
            imgwebrtc == false;
        }
    }

    if (DetectRTC.hasWebcam) {
        $('#imgcamera').attr('src', '../dist/img/system/tick.png');
        $('#divcamera').addClass('stepgreen');
    }
    else {
        $('#imgcamera').attr('src', '../dist/img/system/unchecked.png');
        $('#divcamera').removeClass('stepgreen');
        $('#divcamera').addClass('stepred');
        Isvalid = false;
    }
    if (DetectRTC.isWebSocketsSupported) {
        $('#imgport').attr('src', '../dist/img/system/tick.png');
        $('#divport').addClass('stepgreen');
    }
    else {
        $('#imgport').attr('src', '../dist/img/system/unchecked.png');
        $('#divport').removeClass('stepgreen');
        $('#divport').addClass('stepred');
        Isvalid = false;
    }

    if (Isvalid) {
        //$('#hfreNext').attr({ 'visibility': 'visible', 'display': 'block' });
        //$('#hfreNext').show();
    }
    else {
        //$('#hfreNext').hide();
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