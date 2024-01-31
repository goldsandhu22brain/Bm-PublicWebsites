

function UpdateSecretQuestion() {

    if (ValidateSecurityQuestionInputs()) {
        var SecurityQueAnsDetail = [];
        $("#dvInputControls .spnInputControls").each(function () {
            var collectInputDetail = {};
            collectInputDetail.QuestionId = $($(this).find('.qns')[0]).attr("data-qid");
            collectInputDetail.UserAnswer = $(this).find('input.txtanswer').val();
            SecurityQueAnsDetail.push(collectInputDetail);
        });
       
        $.ajax({
            url: "/Test/UpdateSecurityQuestion",
            type: "POST",
            data: { 'questionInput': SecurityQueAnsDetail },
            success: function (result) {
                if (result /* && result.Status == 200*/) {
                    window.SecQnsCallBack && window.SecQnsCallBack();
                }
                else {
                    alert(result.Message);
                }
                //if (result.Status == 200) {
                //   // window.location.href = "/profile";                 
                //}
                //else {
                //    Warning("Questions not saved successfully.");
                //}

            }
        });
        return false;
    }
    return false;
}

function ValidateSecurityQuestionInputs() {
    var validateMessage = '<ul>';
    var isValid = true;
   // var isQuestionSelect = true;
    var isAnsEnter = true;


    $('#dvInputControls .spnInputControls').each(function (i, selected) {
     
        if ($(this).find('input.txtanswer').val() == '') {
            isAnsEnter = false;

        }

    });   

    if (!isAnsEnter) {
        validateMessage += '<li>Please enter answers for all three security questions.</li>';
        isValid = false;
    }

    if (!isValid) {
        validateMessage += '</ul>';
        alert(validateMessage);
    }
    return isValid;
}

