function submitFeedback(input) {
    var id = $(input).attr('data-interview-id');
    var feedback = document.getElementById('FeedBackData').value;
    var feedbackStatus = document.getElementById('FeedBackStatus').value;
    $.ajax({
        url: '/Employer/Interview/PanelFeedBack',
        type: 'POST',
        dataType: 'json',
        data: { InterviewId: id, FeedbackMessage: feedback, FeedBackStatus: feedbackStatus },
        success: function (response) {
            if (response != null && response == '200') {
                alert('Feedback submitted successfully...');
            }
            else if (response != null && response == '100') {
                alert('Error while submitting feedback...');
            }
        },
        error: function () {
            alert('Error while submitting feedback...');
        }
    });
}

function submitOverallFeedback(input) {
    var id = $(input).attr('data-interview-id');
    var feedback = document.getElementById('OverallFeedBackData').value;
    var feedbackStatus = document.getElementById('OverallFeedBackStatus').value;
    $.ajax({
        url: '/Employer/Interview/HrFeedBack',
        type: 'POST',
        dataType: 'json',
        data: { InterviewId: id, FeedbackMessage: feedback, FeedBackStatus: feedbackStatus },
        success: function (response) {
            if (response != null && response == '200') {
                alert('Overall Feedback submitted successfully...');
            }
            else if (response != null && response == '100') {
                alert('Error while submitting Ooverall feedback...');
            }
        },
        error: function () {
            alert('Error while submitting overall feedback...');
        }
    });
}

function updateInterview(input) {
    var id = $(input).attr('data-interview-id');
    var timezone = $(input).attr('data-timezone');
    var daterange = document.getElementById('date-range').value;
    var panel = $("#panel-list :selected").map((_, e) => e.value).get();
    $.ajax({
        url: '/Employer/Interview/UpdateInterview',
        type: 'POST',
        dataType: 'json',
        data: { InterviewId: id, TimeZoneId: timezone, DateRange: daterange, PanelMembers: panel },
        success: function (response) {
            if (response) {
                alert('Updated successfully...');
                location.reload();
            }
        },
        error: function () {
            alert('Error while updating...');
        }
    });
}