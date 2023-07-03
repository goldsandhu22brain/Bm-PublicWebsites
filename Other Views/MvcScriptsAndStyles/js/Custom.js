$(window).scroll(function () {
    var nav = $('.d-nav');
    var top = 50;
    if ($(window).scrollTop() >= top) {

        nav.addClass('nav-bg-purple');

    } else {
        nav.removeClass('nav-bg-purple');
    }
});

$(window).scroll(function () {
    var scroll = $(window).scrollTop();

    //>=, not <=
    if (scroll >= 500) {
        //clearHeader, not clearheader - caps H
        $(".py-menubar").addClass("py-white-bg");
    }
    if (scroll <= 500) {
        //clearHeader, not clearheader - caps H
        $(".py-menubar").removeClass("py-white-bg");
    }
});
function search(srch) {
    if (event.keyCode == 13) {
        event.preventDefault();
        if ($("#navbar-search-input").val() != "") {
            value = $("#navbar-search-input").val();
            event.preventDefault();
            window.location.href = "/Individual/SearchTestsCourses.aspx?srchtxt=" + value;
        }
        else {
            Warning("Search cannot be empty.");
        }
    }
}
//<![CDATA[
var theForm = document.forms['ctl00'];
if (!theForm) {
    theForm = document.ctl00;
}
function __doPostBack(eventTarget, eventArgument) {
    if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
        theForm.__EVENTTARGET.value = eventTarget;
        theForm.__EVENTARGUMENT.value = eventArgument;
        theForm.submit();
    }
}
//]]>


function ValidateTranscript() {

    var message = '<ul>';
    var isValid = true;
    if ($('#txtTranscriptNo').val().trim() == '') {

        isValid = false;
        message += '<li>Please enter transcript no.</li>';

    }
    if ($('#txtTranscriptNo').val().trim() != '') {
        if (!ValidateNumberText($('#txtTranscriptNo').val())) {
            isValid = false;
            message += '<li>Please enter transcript no. in numeric format.</li>';

        }
        else if ($('#txtTranscriptNo').val().length > 20) {
            isValid = false;
            message += '<li>Length of transcript no. cannot exceed 20 characters.</li>';
            // window.location.href = "../Individual/Transcript.aspx?transcriptid=" + $('#txtTranscriptNo').val();
        }
    }

    if (!isValid) {
        message += '</ul>';
        Warning(message);
    }
    return isValid;
}

function CheckItemPaymentProcess(cid) {
    var test = confirm('Are you sure you want to delete from the Cart?');
    if (test == true || test == 'true') {
        $.ajax({
            type: 'POST',
            cache: false,
            async: true,
            contentType: 'application/json; charset=utf-8',
            url: '/Courses.aspx/CheckItemPaymentProcess',
            data: JSON.stringify({ 'itemId': cid }),
            dataType: 'json',
            success: function (response) {
                var result = response.d;
                if (result) {
                    if (result.ResponseData != '') {
                        alert(result.ResponseData);
                        return false;
                    } else {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
            ,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
            }
        });
    }
}
$(document).on('click', '.TestFullReport', function () {

});


$(document).ready(function () {
    $('#IsProctorTip').tooltip();
    $('#IsProctorTipLive').tooltip();
    $(".select2").select2();
    setTimeout(function () {
        $('body').addClass('loaded');
    }, 500);
    LoadGraphData();
    LoadTimeZoneIndv();
    var seconds = 120;
    var intervalId = null;

    var dvCountDown = document.getElementById("MyPendingItems");

    function showpanel() {
        $(".ddldropdefault").addClass(' open');
    }
    setTimeout(function () {
        $('#MyCourses>table>tbody>tr:nth-child(2)>td>.ddldropdefault').addClass('open');
    }, 900);

    //checkStatus();
    //setTimeout(showpanel, 3000);

    function checkStatus() {
        $.ajax({
            type: 'POST',
            cache: false,
            async: true,
            contentType: 'application/json; charset=utf-8',
            url: 'Index.aspx/CheckItemPaymentProcess',
            dataType: 'json',
            success: function (response) {
                var result = response.d;
                if (result) {
                    if (result.ResponseData != '') {
                        if (result.ResponseData == 'inprogress') {
                            $('.nav-tabs-custom a[href$="#MyCart"]').trigger('click');
                            dvCountDown.style.display = "block";
                            setInterval(function () {
                                seconds--;
                                //lblCount.innerHTML = seconds;
                                if (seconds == 0) {
                                    checkStatus();
                                }
                            }, 1000);

                            seconds = 120;
                        }
                        else {
                            dvCountDown.style.display = "none";
                            clearInterval(200);
                            location.href = "Index.aspx";
                            $('.nav-tabs-custom a[href$="#MyCourses"]').trigger('click');
                        }
                    } else {
                        dvCountDown.style.display = "none";
                        clearInterval(200);
                        //location.href = "Index.aspx";
                        $('.nav-tabs-custom a[href$="#MyCourses"]').trigger('click');
                    }
                }
                else {
                    return true;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
            }
        });
        //dvCountDown.style.display = "none";
    }

    function LoadGraphData() {
        $.ajax({
            type: 'POST',
            cache: false,
            async: true,
            contentType: 'application/json; charset=utf-8',
            url: 'Index.aspx/GetChartDetails',
            data: JSON.stringify({ 'type': 'indv' }),
            dataType: 'json',
            success: function (response) {

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
            }
        });
    }
});

function UserStartTest(usertestid) {
    $.ajax({
        type: 'POST',
        cache: false,
        async: true,
        contentType: 'application/json; charset=utf-8',
        url: 'MyCourses.aspx/CheckStartTestDate',
        data: JSON.stringify({ 'usertestid': usertestid }),
        dataType: 'json',
        success: function (response) {
            var result = response.d;
            if (result.Status == "1") {
                location.href = result.ResponseData;
            }
            else {
                Warning(result.ResponseData);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //ButtonDisableEnable("Save", false, "btnSubmit");

            //alert(textStatus + "----"+ errorThrown);
        }
    });
}

function UserScheduleTest(testId, usertestid) {
    $.ajax({
        type: 'POST',
        cache: false,
        async: true,
        contentType: 'application/json; charset=utf-8',
        url: 'MyCourses.aspx/CheckPurchasedDate',
        data: JSON.stringify({ 'usertestid': usertestid }),
        dataType: 'json',
        success: function (response) {
            var result = response.d;
            if (result.Status == "1") {
                var responsedt = result.ResponseData;
                if (responsedt == "5") {
                    window.location.href = "Schedule.aspx?Id=" + usertestid + "&tid=" + testId;
                }
                else {
                    Warning("Schedule after 5 day of purchased");
                }
            }
            else {
                Warning(result.ResponseData);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //ButtonDisableEnable("Save", false, "btnSubmit");

            //alert(textStatus + "----"+ errorThrown);
        }
    });
}

function filedownload(path, cid) {
    console.log(path);

    location.href = '/Handler/DownloadHandler.ashx?fileName=' + path + "&id=" + cid
}

function buyCourse() {
    var element = document.getElementById("testSection");
    if (element != null) {
        event.preventDefault();
        element.scrollIntoView(true);
    }
}

$(function () {
    var data = [], totalPoints = 100

    function getRandomData() {
        if (data.length > 0)
            data = data.slice(1);
        var res = [];
        for (var i = 0; i < data.length; ++i) {
            res.push([i, data[i]]);
        }

        return res;
    }

    var interactive_plot = $.plot("#interactive", [getRandomData()], {
        grid: {
            borderColor: "#f3f3f3",
            borderWidth: 1,
            tickColor: "#f3f3f3"
        },
        series: {
            shadowSize: 0, // Drawing is faster without shadows
            color: "#3c8dbc"
        },
        lines: {
            fill: true, //Converts the line chart to area chart
            color: "#3c8dbc"
        },
        yaxis: {
            min: 0,
            max: 100,
            show: true
        },
        xaxis: {
            show: true
        }
    });

    var updateInterval = 500; //Fetch data ever x milliseconds
    var realtime = "on"; //If == to on then fetch data every x seconds. else stop fetching
    function update() {

        interactive_plot.setData([getRandomData()]);
        // Since the axes don't change, we don't need to call plot.setupGrid()
        interactive_plot.draw();
        if (realtime === "on")
            setTimeout(update, updateInterval);
    }

    //INITIALIZE REALTIME DATA FETCHING
    if (realtime === "on") {
        update();
    }
});