var connection = new RTCMultiConnection();
var canProctorLive = isProctorLive;
var ScreenRecordingTimer = 30;
var CameraRecordingTimer = 30;
var PhotoCaptureTimer = 30;
var screenStream;
//connection.socketURL = '/';
connection.socketURL = 'https://www.brainmeasures.com:9001/';

connection.extra = {
    userFullName: userFullName,
    role: role
};
UserAlertTrigger = function () {
      connection.send({useralert: true});
}
/// make this room public
connection.publicRoomIdentifier = publicIdentifier;

connection.socketMessageEvent = 'canvas-dashboard-demo';

// keep room opened even if owner leaves
connection.autoCloseEntireSession = false;

// https://www.rtcmulticonnection.org/docs/maxParticipantsAllowed/
connection.maxParticipantsAllowed = 1000;
// set value 2 for one-to-one connection
// connection.maxParticipantsAllowed = 2;

//// here goes canvas designer
var designer = new CanvasDesigner();

// you can place widget.html anywhere
designer.widgetHtmlURL = '';//compiler-design.html';
designer.widgetJsURL = '';

designer.addSyncListener(function (data) {
    connection.send(data);
});
// here goes RTCMultiConnection

connection.chunkSize = 16000;
connection.enableFileSharing = false;
connection.session = {
    audio: true,
    video: true,
    data: true,
    screen: true,
    oneway: true
};
connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};
connection.mediaConstraints = {
    video: true,
    audio: {
        mandatory: {
            googEchoCancellation: true, // disabling audio processing
            googAutoGainControl: true,
            googNoiseSuppression: true,
            googHighpassFilter: true,
            googTypingNoiseDetection: true,
            //googAudioMirroring: true
        },
        optional: []
    }
};
function getFullName(userid) {
    var _userFullName = userid;
    if (connection.peers[userid] && connection.peers[userid].extra.userFullName) {
        _userFullName = connection.peers[userid].extra.userFullName;
    }
    return _userFullName;
}

function getRoles(userid) {
    var _role = userid;
    if (connection.peers[userid] && connection.peers[userid].extra.role) {
        _role = connection.peers[userid].extra.role;
    }
    return _role;
}

connection.onUserStatusChanged = function (event) {
    var names = [];
    var roles = [];
    connection.getAllParticipants().forEach(function (pid) {
        names.push(getFullName(pid));
        roles.push(getRoles(pid));
    });

    if (!names.length) {
        names = ['Only You'];
    } else {
        names = [/*connection.extra.userFullName || */'You'].concat(names);
    }

};

connection.onopen = function (event) {
    connection.onUserStatusChanged(event);
};

connection.onclose = connection.onerror = connection.onleave = function (event) {
    connection.onUserStatusChanged(event);
};

connection.onmessage = function (event) {
    if (event.data.proof) {
        if (confirm("Admin asking to upload the proof")) {
            $('#proof-test').removeClass('proctor-hide').addClass("proctor-show");        
        }
        return;
    }
    if (event.data.showMainVideo) {
        $('#main-video').show();
        $('#screen-viewer').css({
            top: $('#widget-container').offset().top,
            left: $('#widget-container').offset().left,
            width: $('#widget-container').width(),
            height: $('#widget-container').height()
        });
        $('#screen-viewer').show();
        return;
    }

    if (event.data.hideMainVideo) {
        $('#main-video').hide();
        $('#screen-viewer').hide();
        return;
    }

    if (event.data.typing === true) {
        $('#key-press').show().find('span').html(event.extra.userFullName + ' is typing');
        return;
    }

    if (event.data.typing === false) {
        $('#key-press').hide().find('span').html('');
        return;
    }

    if (event.data.chatMessage && !event.data.private) {
        appendChatMessage(event);
        return;
    }
  
    if (event.data.checkmark === 'received') {
        var checkmarkElement = document.getElementById(event.data.checkmark_id);
        if (checkmarkElement) {
            checkmarkElement.style.display = 'inline';
        }
        return;
    }
    if (event.data.startRecording) {
        startRecording();
        return;
    }
    if (event.data.pauseTest) {
        pauseTest();
        return;
    }
    if (event.data.resumeTest) {
        resumeTest();
        return;
    }
    if (event.data.sendTest) {
        document.getElementById('show-test').classList.remove("proctor-show");
        document.getElementById('show-test').classList.add("proctor-hide");
        document.getElementById('load-test').classList.add("proctor-show");
        document.getElementById('load-test').classList.remove("proctor-hide");
        //document.getElementById('load-test').disabled = false;
        return;
    }
    if (event.data.closeMeeting) {
        closeWindow();
        return;
    }
    if (event.data === 'plz-sync-points') {
        designer.sync();
        return;
    }

    designer.syncData(event.data);
};


// extra code
connection.onstream = function (event) {
    screenStream = event.stream;
    if (event.stream.isScreen && !event.stream.canvasStream) {
        $('#screen-viewer').get(0).srcObject = event.stream;
        $('#screen-viewer').hide();
    }
    else if (event.extra.role === 'Candidate') {
        let obj = JSON.parse(event.stream.idInstance);
        //to enable screen share by default
        if (obj !== null && (obj.isScreen === true || obj.isScreen === 'true')) {
            var existing = document.getElementById(event.streamid);
            if (existing && existing.parentNode) {
                existing.parentNode.removeChild(existing);
            }

            event.mediaElement.removeAttribute('src');
            event.mediaElement.removeAttribute('srcObject');
            event.mediaElement.muted = true;
            event.mediaElement.volume = 0;
            event.mediaElement.controls = false;
            event.stream.isScreen = true;
            var videoScreen = document.createElement('video');

            if (event.type === 'local') {
                videoScreen.volume = 0;
                try {
                    videoScreen.setAttributeNode(document.createAttribute('muted'));
                } catch (e) {
                    PushTracking(513);
                    videoScreen.setAttribute('muted', true);
                }
            }
            videoScreen.srcObject = event.stream;
            if (isProctorLive || isProctor) {
                startRecording();
            }
        }
        else {
            var video = document.getElementById('main-video');
            video.setAttribute('data-streamid', event.streamid);
            video.controls = false;
            if (event.type === 'local') {
                video.muted = true;
                video.volume = 0;
            }
            video.srcObject = event.stream;
            $('#main-video').show();
        }
    }
    else {
        event.mediaElement.controls = false;
        if (event.type === 'local') {
            event.mediaElement.muted = true;
            event.mediaElement.volume = 0;
        }
        var otherVideos = document.querySelector('#other-videos');
        otherVideos.appendChild(event.mediaElement);
    }
    connection.onUserStatusChanged(event);
};

connection.onstreamended = function (event) {
    var video = document.querySelector('video[data-streamid="' + event.streamid + '"]');
    if (!video) {
        video = document.getElementById(event.streamid);
        if (video) {
            video.parentNode.removeChild(video);
            return;
        }
    }
    if (video) {
        video.srcObject = null;
        video.style.display = 'none';
    }
};
var UserNewProofTrigger = function (proof,UrlId) {
    connection.send({ ViewNewProof: proof, Id:UrlId });
}
function UploadProof() {
    var fileInput = $("#newproof");
    if (fileInput && fileInput[0].files) {
        var fileData = new FormData();
        for (i = 0; i < fileInput[0].files.length; i++) {
            //Appending each file to FormData object
            fileData.append(fileInput[0].files[i].name, fileInput[0].files[i]);
        }
        // recorded data
        //formData.append('File', input[0].files);
        $.ajax({
            url: '/Proof/Upload',
            type: 'POST',
            data: fileData,                   
            dataType: 'json',            
            cache: false,
            async: false,
            processData: false,
            contentType: false,
            success: function (response) {                
                console.log("Proof Uploaded Successfully!!!")               
                $('#candidate-myModal').modal("hide");
                UserNewProofTrigger(true, response.imageUrl);
            },
            error: function (response) {
                $("#Inject-UAA").html(response.responseText);
                UserNewProofTrigger(false, "");                         
                $('#Candidate-myModal').modal("show");                
            },
        });
    }        
    }
    function NewProofUpload() {
        $("#Inject-UAA").html("");
        $("#Inject-UAA").html("<input type='file' id='newproof' /><img class='w-100' id='preview-newproof'></img><a onclick='UploadProof()' class='btn btn-primary'>submit</a>");
       
        $('#candidate-myModal').modal('show');
        $("#newproof").change(function () {
            newproof(this);
        });
}
function newproof(input) {
    if (input.files && input.files[0]) {
        var reader3 = new FileReader();

        reader3.onload = function (e) {
            $('#preview-newproof').attr('src', e.target.result);
        }
        reader3.readAsDataURL(input.files[0]);
    }
}
function appendChatMessage(event, checkmark_id) {
    var conversationPanel = document.getElementById('conversation-panel');
    var div = document.createElement('div');
    if (event.data) {
        div.className = 'col-11 interview-chat-message-left';
        div.innerHTML = '<p>' + event.data.chatMessage + '</p><h6>' + (event.extra.userFullName || event.userid) + '</h6>';

        if (event.data.checkmark_id) {
            connection.send({
                checkmark: 'received',
                checkmark_id: event.data.checkmark_id
            });
        }
    } else {
        div.className = 'col-11 offset-1 interview-chat-message-right text-right';
        div.innerHTML = '<p>' + event + '</p><h6>Me</h6>';
    }
    conversationPanel.appendChild(div);

    conversationPanel.scrollTop = conversationPanel.clientHeight;
    conversationPanel.scrollTop = conversationPanel.scrollHeight - conversationPanel.scrollTop;
}

$(window).blur(function () {
    var checkmark_id = connection.userid + connection.token();
    var message = "Warning: Candidate has moved out of the current window/switched between tabs in the Browser/minimized the Tab/New browser tab or new browser opened";
    insertChatMessage(message, true);
    connection.send({
        chatMessage: message,
        checkmark_id: checkmark_id,
        private: true
    });
});

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});

var elem = document.getElementById("fullScreenElement");
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}
if (document.addEventListener) {
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
}

document.onkeydown = function (ev) {
    console.log(ev.keyCode);
    if (ev.keyCode === 27 || ev.keyCode === 122) return false
}

function exitHandler() {
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        alert("Cannot exit full screen");       
    }
}

/* Storing user's device details in a variable*/
let details = navigator.userAgent;

/* Creating a regular expression 
containing some mobile devices keywords 
to search it in details string*/
let regexp = /android|iphone|kindle|ipad/i;

/* Using test() method to search regexp in details
it returns boolean value*/
let isMobileDevice = regexp.test(details);

if (isMobileDevice) {
    alert("You are not using Desktop Mode, Use Desktop Mode");
}

function insertChatMessage(message, onlyEmployer) {
    var messageObj = [
        { UserId: userId, UserName: connection.extra.userFullName, Message: message, EmployerOnly: onlyEmployer }
    ];
    $.ajax({
        url: '/Tracker/InsertChat',
        type: 'POST',
        dataType: 'json',
        data: { InterviewId: roomId, ChatMessages: messageObj },
        success: function (response) {
        },
        error: function () {
        }
    });
}
function syncChatMessage() {
    var conversationPanel = document.getElementById('conversation-panel');
    $.ajax({
        url: '/Tracker/GetChat',
        type: 'POST',
        dataType: 'json',
        data: { InterviewId: roomId },
        success: function (response) {
            if (response != null && response.ChatMessages != null) {
                for (var item in response.ChatMessages) {
                    chat = response.ChatMessages[item];
                    if (chat != null && !chat.EmployerOnly && chat.Message != '') {
                        var div = document.createElement('div');
                        if (userId == chat.UserId) {
                            var checkmark_id = connection.userid + connection.token();
                            div.className = 'col-11 offset-1 interview-chat-message-right text-right';
                            div.innerHTML = '<p>' + chat.Message + '</p><h6>Me</h6>';
                        }
                        else {
                            div.className = 'col-11 interview-chat-message-left';
                            div.innerHTML = '<p>' + chat.Message + '</p><h6>' + (chat.UserName || chat.UserId) + '</h6>';
                        }
                        if (conversationPanel != null) {
                            conversationPanel.appendChild(div);

                            conversationPanel.scrollTop = conversationPanel.clientHeight;
                            conversationPanel.scrollTop = conversationPanel.scrollHeight - conversationPanel.scrollTop;
                        }
                    }
                }
            }
        },
        error: function () {
        }
    });
}
if (SendButtonClick == null) {
    SendButtonClick = function () {
        $('#txt-chat-message').emojioneArea({
            pickerPosition: "top",
            filtersPosition: "bottom",
            tones: false,
            autocomplete: true,
            inline: true,
            hidePickerOnBlur: true,
            events: {
                focus: function () {
                    $('.emojionearea-category').unbind('click').bind('click', function () {
                        $('.emojionearea-button-close').click();
                    });
                },
                keyup: function (e) {
                    var chatMessage = $('.emojionearea-editor').html();
                    if (!chatMessage || !chatMessage.replace(/ /g, '').length) {
                        connection.send({
                            typing: false
                        });
                    }


                    clearTimeout(keyPressTimer);
                    numberOfKeys++;

                    if (numberOfKeys % 3 === 0) {
                        connection.send({
                            typing: true
                        });
                    }

                    keyPressTimer = setTimeout(function () {
                        connection.send({
                            typing: false
                        });
                    }, 1200);
                },
                blur: function () {
                    // $('#btn-chat-message').click();
                    connection.send({
                        typing: false
                    });
                }
            }
        });

        window.onkeyup = function (e) {
            var code = e.keyCode || e.which;
            if (code == 13) {
                $('#btn-chat-message').click();
            }
        };
        document.getElementById('btn-chat-message').onclick = function () {
            var chatMessage = $('.emojionearea-editor').html();
            $('.emojionearea-editor').html('');

            if (!chatMessage || !chatMessage.replace(/ /g, '').length) return;

            var checkmark_id = connection.userid + connection.token();

            appendChatMessage(chatMessage, checkmark_id);
            insertChatMessage(chatMessage, false);
            connection.send({
                chatMessage: chatMessage,
                checkmark_id: checkmark_id
            });

            connection.send({
                typing: false
            });
        };
    }
}
var keyPressTimer;
var numberOfKeys = 0; 
if (!!password) {
    connection.password = password;
}

designer.appendTo(document.getElementById('content'), function () {
    var sessionid = roomId;
    connection.extra.roomOwner = true;
    connection.open(sessionid, function (isRoomOpened, roomid, error1) {
        if (error1) {
            if (error1 === connection.errors.ROOM_NOT_AVAILABLE) {
                connection.join(sessionid, function (isRoomJoined, roomid, error) {
                    if (error) {
                        if (error === connection.errors.ROOM_NOT_AVAILABLE) {
                            alert('This room does not exist. Please either create it or wait for moderator to enter in the room.');
                        }
                        alert(error);
                    }
                });
            }
        }
        connection.socket.on('disconnect', function () {
            location.reload();
        });
    });
    designer.destroy();
});

function addStreamStopListener(stream, callback) {
    stream.addEventListener('ended', function () {
        callback();
        callback = function () { };
    }, false);

    stream.addEventListener('inactive', function () {
        callback();
        callback = function () { };
    }, false);

    stream.getTracks().forEach(function (track) {
        track.addEventListener('ended', function () {
            callback();
            callback = function () { };
        }, false);

        track.addEventListener('inactive', function () {
            callback();
            callback = function () { };
        }, false);
    });
}

function replaceTrack(videoTrack, screenTrackId) {
    if (!videoTrack) return;
    if (videoTrack.readyState === 'ended') {
        alert('Can not replace an "ended" track. track.readyState: ' + videoTrack.readyState);
        return;
    }
    connection.getAllParticipants().forEach(function (pid) {
        var peer = connection.peers[pid].peer;
        if (!peer.getSenders) return;
        var trackToReplace = videoTrack;
        peer.getSenders().forEach(function (sender) {
            if (!sender || !sender.track) return;
            if (screenTrackId) {
                if (trackToReplace && sender.track.id === screenTrackId) {
                    sender.replaceTrack(trackToReplace);
                    trackToReplace = null;
                }
                return;
            }

            if (sender.track.id !== tempStream.getTracks()[0].id) return;
            if (sender.track.kind === 'video' && trackToReplace) {
                sender.replaceTrack(trackToReplace);
                trackToReplace = null;
            }
        });
    });
}

function replaceScreenTrack(stream) {
    stream.isScreen = true;
    stream.streamid = stream.id;
    stream.type = 'local';

    connection.attachStreams.push(stream);
    connection.onstream({
        stream: stream,
        type: 'local',
        streamid: stream.id,
        //mediaElement: video
    });

    var screenTrackId = stream.getTracks()[0].id;
    addStreamStopListener(stream, function () {
        connection.send({
            hideMainVideo: true
        });

        $('#main-video').hide();
        $('#screen-viewer').hide();
        $('#btn-share-screen').show();
        replaceTrack(tempStream.getTracks()[0], screenTrackId);
    });

    stream.getTracks().forEach(function (track) {
        if (track.kind === 'video' && track.readyState === 'live') {
            replaceTrack(track);
        }
    });

    connection.send({
        showMainVideo: true
    });

    $('#main-video').show();
    $('#screen-viewer').css({
        top: $('#widget-container').offset().top,
        left: $('#widget-container').offset().left,
        width: $('#widget-container').width(),
        height: $('#widget-container').height()
    });
    $('#screen-viewer').show();
}


/****************Screen Recoring Section********************/
if (!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
    var error = 'Your browser does NOT supports getDisplayMedia API.';
    throw new Error(error);
}

function invokeGetDisplayMedia(success, error) {
    var displaymediastreamconstraints = {
        video: {
            displaySurface: 'monitor', // monitor, window, application, browser
            logicalSurface: true,
            cursor: 'always' // never, always, motion
        }
    };

    // above constraints are NOT supported YET
    // that's why overridnig them
    displaymediastreamconstraints = {
        video: true
    };

    if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
    }
    else {
        navigator.getDisplayMedia(displaymediastreamconstraints).then(success).catch(error);
    }
}

function captureScreen(callback) {
    invokeGetDisplayMedia(function (screen) {
        addStreamStopListener(screen, function () {
            PushTracking(513);
        });
        callback(screen);
    }, function (error) {
        PushTracking(530);        
        console.error(error);
        alert('Unable to capture your screen. Please check console logs.\n' + error);
    });
}

function captureCamera(cb) {
    try {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(cb);
    } catch (e) {
        //camera failed.
        PushTracking(520);
    }
  
}
function keepStreamActive(stream, Id = "Stream", mute = false) {
    var video = document.createElement('video');
    video.muted = mute;
    video.srcObject = stream;
    video.id = "record_" + Id;
    video.style.display = 'none';
    (document.body || document.documentElement).appendChild(video);
}

var recorder = null;
var srecorder = null;
var camera = null; // globally accessible

function startRecording() {
    var screen = screenStream;
    keepStreamActive(screen, "screen");
    srecorder = RecordRTC(screen, {
        type: 'video',
        video: { width: 320, height: 240 },
        canvas: { width: 320, height: 240 }, bitsPerSecond: 1000000
    });
    StartScreenRecording(srecorder);
    captureCamera(function (camera) {
        keepStreamActive(camera, "camera");
        keepStreamActive(camera, "photo", true);
        var recorder = RecordRTC(camera, {
            type: 'video',
            mimeType: 'video/webm',
            //previewStream: function (s) {
            //    document.querySelector('video').muted = true;
            //    document.querySelector('video').srcObject = s;
            //}
        });

        StartVideoRecord(recorder);

        var video = document.getElementById('record_photo');
        if (video != null && video.paused) {
            var callBack = (response) => {
                var msg = "";
                var type = "";
                if (response.ActivityTypeCode == 1) {
                    msg = "User Face Not Deducted";
                    type = "NoFaceDetection";
                }
                else if (response.ActivityTypeCode == 2) {
                    msg = "Multipe Faces Detected";
                    type = "MultiFaceDetection", "FaceDetectionError"
                }
                else if (response.ActivityTypeCode == 4) {
                    msg = "Error Occured at Detecting Face";
                    type = "FaceDetectionError";
                }
                if (msg != "" && type != "") {
                    DisplayAlert(type, msg);
                }
            }
        
            video.play();          
            CaptureUserPhoto(video, callBack);
           
            var photoMilliSeconds = PhotoCaptureTimer * 1000;
          
            var triggerTimeOut =
                setInterval(function () {
                    stopRecordingForce = stopRecordingForce ?? window.stopRecordingForce;
                    if (stopRecordingForce != null && stopRecordingForce.photo == false) {                        
                        CaptureUserPhoto(video, callBack);
                    }
                    else if (stopRecordingForce != null && stopRecordingForce.photo == true) {
                        clearInterval(triggerTimeOut);
                        callBack = (response) => {
                            video.pause();
                            CompletedRecording.photo = true;                            
                        };
                        CaptureUserPhoto(video, callBack);
                    }
                }, photoMilliSeconds);
        }
    });
}
function CaptureUserPhoto(video, callBack = null) {
    try {

        if (video == "undefined") {
            PushTracking("514");
            console.log("Due to no camera unable to capture photo");
            return;
        }
        //Extra start
        if (document.getElementById('canvas_photo') == null) {            
            var c = document.createElement('canvas');
            c.setAttribute("id", "canvas_photo");
            c.style.display = "none";
            (document.body || document.documentElement).appendChild(c);
        }
        var canvas = document.getElementById('canvas_photo'); //document.getElementById('canvas');//
        
        canvas.setAttribute("width", "480");//480
        canvas.setAttribute("height", "350");//350
        var ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, 480, 350);
        var image = canvas.toDataURL("image/png");
        var blob = dataURItoBlob(image);
        if (!EmptyStream(blob, "426")) {
            // we need to upload "File" --- not "Blob"
            var fileObject = new File([blob], "test.png", {
                type: 'image/png'
            });
          
            var formData = new FormData();

            // recorded data
            formData.append('File', fileObject);
            formData.append('RecorderType', "Photo");
            //// upload using jQuery
            UploadRecorder("425", formData, callBack);
        }

    } catch (e) {
        PushTracking("515");
        console.log("Error in save capture : " + e);
    }
}
function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return ia;    
}
function StartVideoRecord(recorder) {
    try {
        recorder.startRecording();
    }
    catch (ex) {
        PushTracking(512);       
        return;
        //location.href = "/individual/default.aspx";
    }

    // release camera on stopRecording
    //recorder.camera = camera;

    var milliSeconds = CameraRecordingTimer * 1000;
    var videotimeoutId;
    videotimeoutId = setTimeout(function () {
        try {
            // stop recording
            recorder.stopRecording(function () {

                // get recorded blob
                var blob = recorder.getBlob();
                if (!EmptyStream(blob, "416")) {
                    // generating a random file name
                    var fileName = 'test.webm';

                    // we need to upload "File" --- not "Blob"
                    var fileObject = new File([blob], fileName, {
                        type: 'video/webm'
                    });
                    var callBack = null;
                    stopRecordingForce = stopRecordingForce ?? window.stopRecordingForce;
                    if (stopRecordingForce != null && stopRecordingForce.camera == false) {
                        clearTimeout(videotimeoutId);
                        StartVideoRecord(recorder);
                    }
                    else if (stopRecordingForce != null && stopRecordingForce.camera == true) {
                        callBack = () => { CompletedRecording.camera = true; };
                    }
                    var formData = new FormData();

                    // recorded data
                    formData.append('File', fileObject);
                    formData.append('RecorderType', "Camera");

                    //// upload using jQuery
                    UploadRecorder("415", formData, callBack);
                }
            });
        }
        catch (ex) {
            PushTracking(542);
            return;            
        }
    }, milliSeconds);
}
function StartScreenRecording(srecorder) {
    try {
        srecorder.startRecording();
    }
    catch (ex) {
        PushTracking(513);
        return;
    }

    // srecorder.screen = screen;
    var milliSeconds = ScreenRecordingTimer * 1000;
    var screentimeoutId;
    screentimeoutId =
        setTimeout(function () {
            try {
                srecorder.stopRecording(function () {

                    // get recorded blob
                    var blob = srecorder.getBlob();
                    if (!EmptyStream(blob, "406")) {
                        // generating a random file name
                        var fileName = 'test.webm';

                        // we need to upload "File" --- not "Blob"
                        var fileObject = new File([blob], fileName, {
                            type: 'video/webm'
                        });
                        var callBack = null;
                        stopRecordingForce = stopRecordingForce ?? window.stopRecordingForce;
                        if (stopRecordingForce != null && stopRecordingForce.screen == false) {
                            clearTimeout(screentimeoutId);
                            StartScreenRecording(srecorder);
                        }
                        else if (stopRecordingForce != null && stopRecordingForce.screen == true) {
                            callBack = () => { CompletedRecording.screen = true; };
                        }
                        var formData = new FormData();

                        // recorded data
                        formData.append('File', fileObject);
                        formData.append('RecorderType', "Screen");
                        //// upload using jQuery
                        UploadRecorder("405", formData, callBack);
                    }
                });
            }
            catch (ex) {
                PushTracking(543);
                return;
            }
        }, milliSeconds);
}
function EmptyStream(blob, Type) {
    var IsEmpty = blob == null || blob.size == 0;
    if (IsEmpty) {
        PushTracking(Type);
    }
    return IsEmpty;
}
function UploadRecorder(Type, FormData,callbackFn=null) {
    $.ajax({
        url: '/Tracker/UploadRecorder',
        type: 'POST',
        data: FormData,        
        cache: false,
        async: false,
        contentType: false,
        processData: false,
        success: function (response) {
            callbackFn && callbackFn(response);
            console.log("screen recording uploaded successfully");

        },
        error: function () {            
            PushTracking(Type);
            console.log("screen recording couldnt be uploaded");
        }
    });
}

function pauseTest() {
    alert("pause exam");
    window.pauseAll = true;
    if (!$(".test-question-grid").hasClass("test-pause")) {
        $(".test-question-grid").addClass("test-pause");
    }
    if (!$(".test-question-container").hasClass("test-pause")) {
        $(".test-question-container").addClass("test-pause");
    }
}

function resumeTest() {
    alert("resume exam");
    window.pauseAll = false;
    var items = document.querySelectorAll(".test-pause");
    for (var i = 0; i < items.length; i++) {
        items[0].classList.remove("test-pause");       
    }
}