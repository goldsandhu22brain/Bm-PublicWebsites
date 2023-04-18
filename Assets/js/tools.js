var $ = jQuery.noConflict();
function Success(message) {
    $.gritter.add({
        title: 'Success',
        text: message,
        class_name: 'gritter-success'
    });
    $('.gritter-item').css({ 'font-weight': 'bold' });
}

function Warning(message) {

    $.gritter.add({
        title: 'Error',
        text: message,
        class_name: 'gritter-warning'
    });
    $('.gritter-item').css({ 'font-weight': 'bold' });
}

function InfoGritter(message) {
    $.gritter.add({
        // (string | mandatory) the heading of the notification
        title: 'Info',
        // (string | mandatory) the text inside the notification
        text: message,
        class_name: 'my-sticky-class'//'gritter-light'
    });
    $('.gritter-item').css({ 'font-weight': 'bold' });
}

function GenerateSEOFriendlyURL(Title) {
    var strTitle = Title;
    strTitle = strTitle.trim();
    strTitle = strTitle.trim("-");
	strTitle = strTitle.replace(/\++/g, "");
    strTitle = strTitle.toLowerCase();
    var char = "$%@!*?;:~`+=()[]{}|\'<>,/^&.".split("");
	
	
    strTitle = strTitle.replace(/c#(\S*)/g, "C-Sharp");
    strTitle = strTitle.replace(/\vb.net/g, "VB-Net");
    strTitle = strTitle.replace(/\asp.net/g, "Asp-Net");
    strTitle = strTitle.replace(/\./g, "-");
    for (var i = 0; i < char.length; i++) {
        var strchar = char[i];
        if (strTitle.indexOf(strchar) > -1) {
            strTitle = strTitle.replace(strchar, "");
        }
    }
	
    strTitle = strTitle.replace(/\s/g, "-");
    strTitle = strTitle.replace(/\--/g, "-");
    strTitle = strTitle.replace(/\---/g, "-");
    strTitle = strTitle.replace(/\----/g, "-");
    strTitle = strTitle.replace(/\-----/g, "-");
    strTitle = strTitle.replace(/\----/g, "-");
    strTitle = strTitle.replace(/\---/g, "-");
    strTitle = strTitle.replace(/\--/g, "-");
    strTitle = strTitle.trim();
	
    strTitle = strTitle + ".aspx";
    return strTitle;
}

function showLoading(isLoad) {
    if (isLoad) {
        $("#pageloaddiv").css("display", "inherit");

    } else {
        $("#pageloaddiv").css("display", "none");
    }
}

function queryString(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function ButtonDisableEnable(btntxt, isEnable, btnId) {
    if (isEnable) {
        $("#" + btnId).text(btntxt);
        if ($("#" + btnId).is("input:submit")) {
            $("#" + btnId).attr("value", btntxt);
        }
        $("#" + btnId).attr("disabled", true);
        $("#" + btnId).css("opacity", "0.5");
    }
    else {
        $("#" + btnId).text(btntxt);
        if ($("#" + btnId).is("input:submit")) {
            $("#" + btnId).attr("value", btntxt);
        }
        $("#" + btnId).attr("disabled", false);
        $("#" + btnId).css("opacity", "1");
    }
}

function ValidateEmail(txtEmail) {
    var emailReg = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
    if (emailReg.test(txtEmail)) {
        return true;
    }
    else {
        return false;
    }
}

function ValidateMultiEmails(Emails) {
    var glbEmail = [];
    var EmailArr = Emails.split(/,|;/);

    for (var i = 0; i < EmailArr.length; i++) {

        var emailReg = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
        if (!emailReg.test(EmailArr[i].trim())) {
            glbEmail.push(EmailArr[i]);

        }

    }
    return glbEmail;
}

function ValidatePhone(txtPhone) {
    var phoneReg = new RegExp(/^[0-9-+]+$/);
    if (phoneReg.test(txtPhone))
    { return true; }
    else
    { return false; }
}
function ValidateZipPostal(txtPostal) {
    var postalReg = new RegExp(/^[A-Za-z0-9]+$/);
    if (postalReg.test(txtPostal)) {
        return true;
    }
    else { return false; }
}

function ValidateNumberText(txtNumber) {
    var numReg = new RegExp(/^[0-9]+$/);
    if (numReg.test(txtNumber))
    { return true; }
    else
    { return false; }
}

function ValidateWebsite(txtWebsite) {
    var websiteReg = new RegExp(/^((http|https|ftp):\/\/)?[a-zA-Z0-9-\.]+\.[a-z]{2,4}/);
    if (websiteReg.test(txtWebsite)) {
        return true;
    }
    else { return false; }
}

var decodeHtmlEntity = function (str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
    });
};

var encodeHtmlEntity = function (str) {
    var buf = [];
    for (var i = str.length - 1; i >= 0; i--) {
        buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
    }
    return buf.join('');
};
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function LoadTimeZone() {
    var timezone = getTimezoneName();
    //$('#hdnTimezone').val(timezone);

    $.ajax({
        type: 'POST',
        cache: false,
        async: true,
        contentType: 'application/json; charset=utf-8',
        url: 'Login.aspx/SaveTimezone',
        data: JSON.stringify({ 'timeZone': timezone }),
        dataType: 'json',
        success: function (response) {
            var result = response.d;
            if (result) {

            }
            else {

            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}

function LoadTimeZoneIndv() {
    var timezone = getTimezoneName();
    //$('#hdnTimezone').val(timezone);

    $.ajax({
        type: 'POST',
        cache: false,
        async: true,
        contentType: 'application/json; charset=utf-8',
        url: 'Index.aspx/SaveTimezone',
        data: JSON.stringify({ 'timeZone': timezone }),
        dataType: 'json',
        success: function (response) {
            var result = response.d;
            if (result) {

            }
            else {

            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}
function getTimezoneName() {
    var timeSummer = new Date(Date.UTC(2005, 6, 30, 0, 0, 0, 0));
    var summerOffset = -1 * timeSummer.getTimezoneOffset();
    var timeWinter = new Date(Date.UTC(2005, 12, 30, 0, 0, 0, 0));
    var winterOffset = -1 * timeWinter.getTimezoneOffset();
    var timeZoneHiddenField;

    if (-720 == summerOffset && -720 == winterOffset) { timeZoneHiddenField = 'Dateline Standard Time'; }
    else if (-660 == summerOffset && -660 == winterOffset) { timeZoneHiddenField = 'UTC-11'; }
    else if (-660 == summerOffset && -660 == winterOffset) { timeZoneHiddenField = 'Samoa Standard Time'; }
    else if (-660 == summerOffset && -600 == winterOffset) { timeZoneHiddenField = 'Hawaiian Standard Time'; }
    else if (-570 == summerOffset && -570 == winterOffset) { timeZoneHiddenField.value = 'Pacific/Marquesas'; }
        //                else if (-540 == summerOffset && -600 == winterOffset) { timeZoneHiddenField.value = 'America/Adak'; }
        //                else if (-540 == summerOffset && -540 == winterOffset) { timeZoneHiddenField.value = 'Pacific/Gambier'; }
    else if (-480 == summerOffset && -540 == winterOffset) { timeZoneHiddenField = 'Alaskan Standard Time'; }
        //                else if (-480 == summerOffset && -480 == winterOffset) { timeZoneHiddenField = 'Pacific/Pitcairn'; }
    else if (-420 == summerOffset && -480 == winterOffset) { timeZoneHiddenField = 'Pacific Standard Time'; }
    else if (-420 == summerOffset && -420 == winterOffset) { timeZoneHiddenField = 'US Mountain Standard Time'; }
    else if (-360 == summerOffset && -420 == winterOffset) { timeZoneHiddenField = 'Mountain Standard Time'; }
    else if (-360 == summerOffset && -360 == winterOffset) { timeZoneHiddenField = 'Central America Standard Time'; }
        //                else if (-360 == summerOffset && -300 == winterOffset) { timeZoneHiddenField = 'Pacific/Easter'; }
    else if (-300 == summerOffset && -360 == winterOffset) { timeZoneHiddenField = 'Central Standard Time'; }
    else if (-300 == summerOffset && -300 == winterOffset) { timeZoneHiddenField = 'SA Pacific Standard Time'; }
    else if (-240 == summerOffset && -300 == winterOffset) { timeZoneHiddenField = 'Eastern Standard Time'; }
    else if (-270 == summerOffset && -270 == winterOffset) { timeZoneHiddenField = 'Venezuela Standard Time'; }
    else if (-240 == summerOffset && -240 == winterOffset) { timeZoneHiddenField = 'SA Western Standard Time'; }
    else if (-240 == summerOffset && -180 == winterOffset) { timeZoneHiddenField = 'Central Brazilian Standard Time'; }
    else if (-180 == summerOffset && -240 == winterOffset) { timeZoneHiddenField = 'Atlantic Standard Time'; }
    else if (-180 == summerOffset && -180 == winterOffset) { timeZoneHiddenField = 'Montevideo Standard Time'; }
    else if (-180 == summerOffset && -120 == winterOffset) { timeZoneHiddenField = 'E. South America Standard Time'; }
    else if (-150 == summerOffset && -210 == winterOffset) { timeZoneHiddenField = 'Mid-Atlantic Standard Time'; }
    else if (-120 == summerOffset && -180 == winterOffset) { timeZoneHiddenField = 'America/Godthab'; }
    else if (-120 == summerOffset && -120 == winterOffset) { timeZoneHiddenField = 'SA Eastern Standard Time'; }
    else if (-60 == summerOffset && -60 == winterOffset) { timeZoneHiddenField = 'Cape Verde Standard Time'; }
    else if (0 == summerOffset && -60 == winterOffset) { timeZoneHiddenField = 'Azores Daylight Time'; }
    else if (0 == summerOffset && 0 == winterOffset) { timeZoneHiddenField = 'Morocco Standard Time'; }
    else if (60 == summerOffset && 0 == winterOffset) { timeZoneHiddenField = 'GMT Standard Time'; }
    else if (60 == summerOffset && 60 == winterOffset) { timeZoneHiddenField = 'Africa/Algiers'; }
    else if (60 == summerOffset && 120 == winterOffset) { timeZoneHiddenField = 'Namibia Standard Time'; }
    else if (120 == summerOffset && 60 == winterOffset) { timeZoneHiddenField = 'Central European Standard Time'; }
    else if (120 == summerOffset && 120 == winterOffset) { timeZoneHiddenField = 'South Africa Standard Time'; }
    else if (180 == summerOffset && 120 == winterOffset) { timeZoneHiddenField = 'GTB Standard Time'; }
    else if (180 == summerOffset && 180 == winterOffset) { timeZoneHiddenField = 'E. Africa Standard Time'; }
    else if (240 == summerOffset && 180 == winterOffset) { timeZoneHiddenField = 'Russian Standard Time'; }
    else if (240 == summerOffset && 240 == winterOffset) { timeZoneHiddenField = 'Arabian Standard Time'; }
    else if (270 == summerOffset && 210 == winterOffset) { timeZoneHiddenField = 'Iran Standard Time'; }
    else if (270 == summerOffset && 270 == winterOffset) { timeZoneHiddenField = 'Afghanistan Standard Time'; }
    else if (300 == summerOffset && 240 == winterOffset) { timeZoneHiddenField = 'Pakistan Standard Time'; }
    else if (300 == summerOffset && 300 == winterOffset) { timeZoneHiddenField = 'West Asia Standard Time'; }
    else if (330 == summerOffset && 330 == winterOffset) { timeZoneHiddenField = 'India Standard Time'; }
    else if (345 == summerOffset && 345 == winterOffset) { timeZoneHiddenField = 'Nepal Standard Time'; }
    else if (360 == summerOffset && 300 == winterOffset) { timeZoneHiddenField = 'N. Central Asia Standard Time'; }
    else if (360 == summerOffset && 360 == winterOffset) { timeZoneHiddenField = 'Central Asia Standard Time'; }
    else if (390 == summerOffset && 390 == winterOffset) { timeZoneHiddenField = 'Myanmar Standard Time'; }
    else if (420 == summerOffset && 360 == winterOffset) { timeZoneHiddenField = 'North Asia Standard Time'; }
    else if (420 == summerOffset && 420 == winterOffset) { timeZoneHiddenField = 'SE Asia Standard Time'; }
    else if (480 == summerOffset && 420 == winterOffset) { timeZoneHiddenField = 'North Asia East Standard Time'; }
    else if (480 == summerOffset && 480 == winterOffset) { timeZoneHiddenField = 'China Standard Time'; }
    else if (540 == summerOffset && 480 == winterOffset) { timeZoneHiddenField = 'Yakutsk Standard Time'; }
    else if (540 == summerOffset && 540 == winterOffset) { timeZoneHiddenField = 'Tokyo Standard Time'; }
    else if (570 == summerOffset && 570 == winterOffset) { timeZoneHiddenField = 'Cen. Australia Standard Time'; }
    else if (570 == summerOffset && 630 == winterOffset) { timeZoneHiddenField = 'Australia/Adelaide'; }
    else if (600 == summerOffset && 540 == winterOffset) { timeZoneHiddenField = 'Asia/Yakutsk'; }
    else if (600 == summerOffset && 600 == winterOffset) { timeZoneHiddenField = 'E. Australia Standard Time'; }
    else if (600 == summerOffset && 660 == winterOffset) { timeZoneHiddenField = 'AUS Eastern Standard Time'; }
    else if (630 == summerOffset && 660 == winterOffset) { timeZoneHiddenField = 'Australia/Lord_Howe'; }
    else if (660 == summerOffset && 600 == winterOffset) { timeZoneHiddenField = 'Tasmania Standard Time'; }
    else if (660 == summerOffset && 660 == winterOffset) { timeZoneHiddenField = 'West Pacific Standard Time'; }
    else if (690 == summerOffset && 690 == winterOffset) { timeZoneHiddenField = 'Central Pacific Standard Time'; }
    else if (720 == summerOffset && 660 == winterOffset) { timeZoneHiddenField = 'Magadan Standard Time'; }
    else if (720 == summerOffset && 720 == winterOffset) { timeZoneHiddenField = 'Fiji Standard Time'; }
    else if (720 == summerOffset && 780 == winterOffset) { timeZoneHiddenField = 'New Zealand Standard Time'; }
    else if (765 == summerOffset && 825 == winterOffset) { timeZoneHiddenField = 'Pacific/Chatham'; }
    else if (780 == summerOffset && 780 == winterOffset) { timeZoneHiddenField = 'Tonga Standard Time'; }
    else if (840 == summerOffset && 840 == winterOffset) { timeZoneHiddenField = 'Pacific/Kiritimati'; }
    else { timeZoneHiddenField = 'US/Pacific'; }
    return timeZoneHiddenField;
}

