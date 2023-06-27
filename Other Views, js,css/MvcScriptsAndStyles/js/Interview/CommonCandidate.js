function TestClearSelection(input) {
    var currentQuestionType = $(input).attr('data-current-questionType');
    var ans = [];
    switch (currentQuestionType) {
        case 'RadioButton':
            ans = $("input:radio[name='radio']:checked");
            break;
        //case 'ImageRadioButton':
        //    ans = $("input:radio[name='imageRadio']:checked");
        //    break;
        case 'CheckBox':
            ans = $("input:checkbox[name='checkbox']:checked");
            break;
        //case 'ImageCheckBox':
        //    ans = $("input:checkbox[name='imageCheck']:checked");
        //    break;
    }
    for (var i = 0; i < ans.length; i++) {
        ans[i].checked = false;
    }
    return false;
}
function attendTest(input) {
    var interviewId = $(input).attr('data-interview-id');
    var testId = $(input).attr('data-test-id');
    $.ajax({
        url: '/Candidate/UserTest/EvaluateTestPost',
        type: 'POST',
        dataType: 'json',
        data: { InterviewId: interviewId, TestId: testId },
        success: function () {
        },
        error: function () {
            alert('Error while submitting overall feedback...');
        }
    });
}

//code to get questions based on question no0
function getQuestion(nextQuestionId, currentQuestionId, answer, currentQuestionType) {
    $.ajax({
        url: '/Candidate/UserTest/LoadQuestion',
        type: 'POST',
        dataType: 'html',
        data: { McqId: testId, CandidateId: userId, InterviewId: roomId, NextQuestionId: nextQuestionId, Id: currentQuestionId, OptionNo: answer, QuestionType: currentQuestionType },
        success: function (response) {
            var result = response;
            $('#testDiv').html(result);
        },
        error: function () {
            alert('Error while loading questions...');
        }
    });
}

function GetAnswer(currentQuestionType) {
    var ans;
    switch (currentQuestionType) {
        case 'RadioButton':
            ans = $("input:radio[name='radio']:checked").val()
            break;
        case 'ImageRadioButton':
            ans = $("input:radio[name='imageRadio']:checked").val()
            break;
        case 'CheckBox':
            ans = $("input:checkbox[name='checkbox']:checked").val()
            break;
        case 'ImageCheckBox':
            ans = $("input:checkbox[name='imageCheckbox']:checked").val()
            break;
    }
    return ans;
}

//code for onclick of question no
function onClickQuestionNo(nextQuestionId, currentQuestionId, currentQuestionType) {
    var answer = GetAnswer(currentQuestionType);
    getQuestion(nextQuestionId, currentQuestionId, answer, currentQuestionType);
}

//code for getting next question based on question no
function nextQuestion(input) {
    var nextQuestionId = $(input).attr('data-question-id');
    var currentQuestionId = $(input).attr('data-current-question');
    var currentQuestionType = $(input).attr('data-current-questionType');
    var answer = GetAnswer(currentQuestionType);
    getQuestion(nextQuestionId, currentQuestionId, answer, currentQuestionType);
}

//submitting test
function submitTest(input) {
    var currentQuestionId = $(input).attr('data-current-question');
    var currentQuestionType = $(input).attr('data-current-questionType');
    var answer = GetAnswer(currentQuestionType);
    $.ajax({
        url: '/Candidate/UserTest/SubmitMcq',
        type: 'POST',
        dataType: 'html',
        data: { McqId: testId, CandidateId: userId, InterviewId: roomId, Id: currentQuestionId, OptionNo: answer, QuestionType: currentQuestionType },
        success: function (response) {
            var result = response;
            $('#testDiv').html(result);
        },
        error: function () {
            alert('Error while submitting test...');
        }
    });
}