var connection = new RTCMultiConnection();
var candidateJoined = false;
//connection.socketURL = '/';
connection.socketURL = 'https://www.brainmeasures.com:9001/';

connection.extra = {
    userFullName: userFullName,
    role: role
};

/// make this room public
connection.publicRoomIdentifier = publicIdentifier;

connection.socketMessageEvent = 'canvas-dashboard-demo';

// keep room opened even if owner leaves
connection.autoCloseEntireSession = false;

// https://www.rtcmulticonnection.org/docs/maxParticipantsAllowed/
connection.maxParticipantsAllowed = 1000;
// set value 2 for one-to-one connection
// connection.maxParticipantsAllowed = 2;

// here goes canvas designer
var designer = new CanvasDesigner();

////// you can place widget.html anywhere
designer.widgetHtmlURL = '';//compiler-design.html';
designer.widgetJsURL = '';

designer.addSyncListener(function (data) {
    connection.send(data);
});
// here goes RTCMultiConnection

connection.chunkSize = 16000;
connection.enableFileSharing = true;

connection.session = {
    audio: false,
    data: true
};

connection.mediaConstraints = {
    video: false,
    audio: false
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};

syncChatMessage();
connection.onUserStatusChanged = function (event) {
    var infoBar = document.getElementById('onUserStatusChanged');
    var candidateInfoBar = document.getElementById('onCandidateJoinedStatus');
    candidateInfoBar.innerHTML = 'Candidate has not joined yet';
    UpdateButtons(true);
    var names = [];
    var roles = [];
    connection.getAllParticipants().forEach(function (pid) {
        names.push(getFullName(pid));
        roles.push(getRoles(pid));
    });

    if (!names.length) {
        names = ['Only You'];
    } else {
        names = [/*connection.extra.userFullName ||*/ 'You'].concat(names);
        if (roles.includes('Candidate')) {
            candidateInfoBar.innerHTML = 'Candidate has joined';
            candidateJoined = true;
            UpdateButtons(false);
        }
    }

    infoBar.innerHTML = '<b>Active users:</b> ' + names.join(', ');
};

function RequestNewProof() {
    if (confirm("Want to Send the request alert to Candidate!")) {
        connection.send({
            proof: true
        });
    }
}
function ViewProof() {
    $.ajax({
        url: '/Proof/ViewOldProof',
        type: 'GET',
        dataType: 'json',
        data: {},
        cache: false,
        async: false,
        success: function (response) {
            $("#Inject-UAA").html("");
            $("#Inject-UAA").html("<img class='w-100' src='" + response.responseText + "'/>");
            $('#test-myModal').modal("show");
            return true;

        },
        error: function (response) {
            $("#Inject-UAA").html(response.responseText);
            $('#test-myModal').modal("show");
            return true;
        },
    });
}
var NewProofId = "";
function ViewNewProof() {    
    $.ajax({
        url: '/Proof/AdminView',
        type: 'GET',
        dataType: 'json',
        data: { filePath: NewProofId },
        cache: false,
        async: false,
        success: function (response) {
            $("#Inject-UAA").html("");
            $("#Inject-UAA").html("<img class='w-100' src='" + response.responseText + "'/>");
            $('#test-myModal').modal("show");
            return true;

        },
        error: function (response) {
            $("#Inject-UAA").html("<img class='w-100' src='" + response.responseText + "'/>");
            $('#test-myModal').modal("show");
            return true;
        },
    });
}
function UserAlertTest() { 
    $(".interview-alert-btn").removeClass("glow");
    $.ajax({
        url: '/Tracker/GetActivities',
        type: 'GET',
        dataType: 'json',
        data: {},
        cache: false,
        async: false,
        success: function (response) {
            $("#Inject-UAA").html(response);
            $('#test-myModal').modal("show");
            return true;

        },
        error: function (response) {
            $("#Inject-UAA").html(response.responseText);
            $('#test-myModal').modal("show");
            return true;
        },      
    });
}
function UpdateButtons(disable) {
    var sendTestBtn = document.getElementById('btn-send-test');
    var recordBtn = document.getElementById('btn-start-recording');
    var pauseTestBtn = document.getElementById('btn-pause-start-test');
    if (sendTestBtn != null && recordBtn != null && pauseTestBtn!=null) {
        if (disable) {
            sendTestBtn.setAttribute('disabled', 'disabled');
            recordBtn.setAttribute('disabled', 'disabled');
            pauseTestBtn.setAttribute('disabled', 'disabled');
        }
        else {
            sendTestBtn.removeAttribute('disabled');
            recordBtn.removeAttribute('disabled');
            pauseTestBtn.removeAttribute('disabled');
        }
    }
}

connection.onopen = function (event) {
    connection.onUserStatusChanged(event);
};
connection.onclose = connection.onerror = connection.onleave = function (event) {
    connection.onUserStatusChanged(event);
};

connection.onmessage = function (event) {
    if (event.data.ViewNewProof==true) {
        NewProofId = event.data.Id;
        document.getElementById("btn-view-new-proof").removeAttribute('disabled');       
        return;
    }
    else if (event.data.ViewNewProof == false) {  
        NewProofId = "";
        document.getElementById("btn-view-new-proof").removeAttribute('disabled').setAttribute('disabled', 'disabled');       
        return;
    }
    if (event.data.useralert) {
        $(".interview-alert-btn").addClass("glow");
        return;
    }

    if (event.data.closeMeeting) {
        closeWindow();
        return;
    }
    if (event.data.showMainVideo) {
        // $('#main-video').show();
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
        // $('#main-video').hide();
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

    if (event.data.chatMessage) {
        appendChatMessage(event);
        return;
    }
    if (event.data.closeMeeting) {
        closeWindow();
        return;
    }
    if (event.data.checkmark === 'received') {
        var checkmarkElement = document.getElementById(event.data.checkmark_id);
        if (checkmarkElement) {
            checkmarkElement.style.display = 'inline';
        }
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
    if (event.extra.role === 'Candidate') {
        if (event.stream.isScreen === true || event.stream.isScreen === 'true') {
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
            var videoScreen = document.getElementById('screen-viewer');

            if (event.type === 'local') {
                videoScreen.volume = 0;
                try {
                    videoScreen.setAttributeNode(document.createAttribute('muted'));
                } catch (e) {
                    videoScreen.setAttribute('muted', true);
                }
            }
            videoScreen.srcObject = event.stream;
            $('#screen-viewer').show();
        }
        else {
            var video = document.getElementById('main-video');
            video.setAttribute('data-streamid', event.streamid);
            video.controls = false;
            if (event.type === 'local') {
                video.muted = true;
                video.volume = 0;
            }
            video.muted = true;
            video.volume = 0;
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

var conversationPanel = document.getElementById('conversation-panel');

function appendChatMessage(event, checkmark_id) {
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
    $.ajax({
        url: '/Tracker/GetChat',
        type: 'POST',
        dataType: 'json',
        data: { InterviewId: roomId },
        success: function (response) {
            if (response != null && response.ChatMessages != null) {
                for (var item in response.ChatMessages) {
                    chat = response.ChatMessages[item];
                    if (chat != null && chat.Message != '') {
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
                        conversationPanel.appendChild(div);

                        conversationPanel.scrollTop = conversationPanel.clientHeight;
                        conversationPanel.scrollTop = conversationPanel.scrollHeight - conversationPanel.scrollTop;
                    }
                }
            }
        },
        error: function () {
        }
    });
}

var keyPressTimer;
var numberOfKeys = 0;
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
document.getElementById('btn-send-test').onclick = function () {
    var checkmark_id = connection.userid + connection.token();

    connection.send({
        sendTest: true,
        checkmark_id: checkmark_id
    });
};
document.getElementById('btn-start-recording').onclick = function () {
    var checkmark_id = connection.userid + connection.token();

    connection.send({
        startRecording: true,
        checkmark_id: checkmark_id
    });
};

//code for pausing test
function pauseTest() {
    var checkmark_id = connection.userid + connection.token();
    connection.send({
        pauseTest: true,
        checkmark_id: checkmark_id
    });
    var btnHtml = "<i class='bi bi-x-circle-fill' onclick='resumeTest()'></i><span>Resume Test</span>";
    document.getElementById('btn-pause-start-test').innerHTML = btnHtml;
}

//code for resuming test
function resumeTest() {
    var checkmark_id = connection.userid + connection.token();
    connection.send({
        resumeTest: true,
        checkmark_id: checkmark_id
    });
    var btnHtml = "<i class='bi bi-x-circle-fill' onclick='pauseTest()'></i><span>Pause Test</span>";
    document.getElementById('btn-pause-start-test').innerHTML = btnHtml;
}

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

if (!!password) {
    connection.password = password;
}

designer.appendTo(document.getElementById('content'), function () {
    //var tempStreamCanvas = document.getElementById('temp-stream-canvas');
    //var tempStream = tempStreamCanvas.captureStream();
    //tempStream.isScreen = true;
    //tempStream.streamid = tempStream.id;
    //tempStream.type = 'local';
    //connection.attachStreams.push(tempStream);
    //window.tempStream = tempStream;

    var sessionid = roomId;
    connection.extra.roomOwner = false;
    connection.open(sessionid, function (isRoomOpened, roomid, error1) {
        if (error1) {
            if (error1 === connection.errors.ROOM_NOT_AVAILABLE) {
                //alert('Someone already created this room. Please either join or create a separate room.');

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

    // connection.attachStreams.push(stream);
    connection.onstream({
        stream: stream,
        type: 'local',
        streamid: stream.id,
        // mediaElement: video
    });

    var screenTrackId = stream.getTracks()[0].id;
    addStreamStopListener(stream, function () {
        connection.send({
            hideMainVideo: true
        });

        // $('#main-video').hide();
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

    // $('#main-video').show();
    $('#screen-viewer').css({
        top: $('#widget-container').offset().top,
        left: $('#widget-container').offset().left,
        width: $('#widget-container').width(),
        height: $('#widget-container').height()
    });
    $('#screen-viewer').show();
}

$('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 4
        },
        1000: {
            items: 8
        },
        1500: {
            items: 12
        }
    }
});
$(".top-thumb-box-toggle").click(function () {
    $(".interview-top-thumbs").slideToggle();
    $(".interview-video-container").toggleClass("full-height");
    $(".top-thumb-box-toggle-1").toggleClass("bi-caret-down bi-caret-up");
});
$(".rightbar-toggle").click(function () {
    $(".interview-rightbar").toggle("'slide', {direction: 'right' }, 1000");
    $(".interview-mainbar").toggleClass("full-width");
    $(".rightbar-toggle-1").toggleClass("bi-caret-left bi-caret-right");
});