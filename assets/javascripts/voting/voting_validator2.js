var input1 = document.getElementById("votingToken");
var input2 = document.getElementById("userNotice");
var password1 = document.getElementById("password_check1");
var password2 = document.getElementById("password_check2");
var password3 = document.getElementById("password_check3");
var participant1 = document.getElementById("par-serialNum1");
var cancelFlag1 = false;
var cancelFlag2 = false;

if (input1 && input2) {
    document.getElementById("votingToken").addEventListener("keyup", checkToken);
    document.getElementById("userNotice").addEventListener("keyup", checkNotice);
}

if (password1 && password2 && !password3) {

    document.getElementById("password_check1").addEventListener("keyup", checkPwd);
    document.getElementById("password_check2").addEventListener("keyup", checkPwd);

} else if (password1 && password2 && password3) {

    document.getElementById("password_check1").addEventListener("keyup", checkPwd);
    document.getElementById("password_check2").addEventListener("keyup", checkPwd);
    document.getElementById("password_check3").addEventListener("keyup", checkPwd2);

}

if (participant1) {
    participant1.setAttribute("style", "margin-right: 1px;");
}

// Status flags - voting configuration
s1 = false;
s2 = false;

// Check the voting token
function checkToken() {
    var val = document.getElementById("votingToken").value;

    if (!val || !val.length) {
        s1 = false;
        $("#configure-button").attr("disabled", true);
    }

    if (val.length > 30) {
        document.getElementById("votingToken").classList.remove("valid");
        document.getElementById("votingToken").classList.add("invalid");
        s1 = false;
    } else {
        document.getElementById("votingToken").classList.remove("invalid");
        document.getElementById("votingToken").classList.add("valid");
        s1 = true;
    }

    checkForm();
}

// Check the user notice
function checkNotice() {
    var val = document.getElementById("userNotice").value;

    if (!val || !val.length) {
        s2 = false;
        $("#configure-button").attr("disabled", true);
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 1 || val.length > 200) {
        document.getElementById("userNotice").classList.remove("valid");
        document.getElementById("userNotice").classList.add("invalid");
        s2 = false;
    } else {
        if (regex.test(val)) {
            document.getElementById("userNotice").classList.remove("invalid");
            document.getElementById("userNotice").classList.add("valid");
            s2 = true;
        } else {
            document.getElementById("userNotice").classList.remove("valid");
            document.getElementById("userNotice").classList.add("invalid");
            s2 = false;
        }
    }

    checkForm();
}

// Make sure that the button only active if some fields validated
function checkForm() {

    if (s1 && s2) {
        $("#configure-button").attr("disabled", false);
    } else {
        $("#configure-button").attr("disabled", true);
    }

}

// Check if user enter the password
function checkPwd() {
    var val1 = document.getElementById("password_check1").value;
    var val2 = document.getElementById("password_check2").value;

    if (!val1 || !val1.length) {
        cancelFlag1 = false;
    } else {
        cancelFlag1 = true;
    }

    if (!val2 || !val2.length) {
        $("#initiate-submit-button").attr("disabled", true);
    } else {
        $("#initiate-submit-button").attr("disabled", false);
    }

    checkCancel();

}

function checkPwd2() {
    var val3 = document.getElementById("password_check3").value;

    if (!val3 || !val3.length) {
        $("#configure-submit-button").attr("disabled", true);
    } else {
        $("#configure-submit-button").attr("disabled", false);
    }

}

// Validate preparing voting
var participantsNum = document.getElementById("participants_num");
var participants = document.getElementById("session_participants");
var attendance = document.getElementById("session_attendance");
var promptcontent = document.getElementById("prompt_msg_content");
var cancelreason = document.getElementById("cancelReason");

if (participantsNum && participants && attendance) {

    var participants_arr = (participants.value).split(',');
    var attendance_arr = (attendance.value).split(',');

    if (participants_arr.length != attendance_arr.length) {

        promptcontent.className = "grey-text text-darken-1 center";
        promptcontent.innerHTML = ("- Please wait for other users to confirm -");
        $("#initiate-button").attr("disabled", true);

    } else {

        promptcontent.className = "green-text text-darken-1 center";
        promptcontent.innerHTML = ("- This voting is ready to be initiated -");
        $("#initiate-button").attr("disabled", false);
    }

    for (var i = 0; i < participants_arr.length; i++) {

        var flag = false;

        for (var j = 0; j < attendance_arr.length; j++) {

            if (participants_arr[i] === attendance_arr[j]) {
                flag = true;
                break;
            }

        }


        if (flag == true) {

            var serialNum = i + 1;
            var newStatusFlag1 = document.createElement("p");

            newStatusFlag1.setAttribute("style", "padding-top: 6px;");
            newStatusFlag1.innerHTML = ('<i class="far fa-check-circle"></i>');
            document.getElementById("confirm-attendance-div" + serialNum).appendChild(newStatusFlag1);

        } else {

            var serialNum = i + 1;
            var newStatusFlag2 = document.createElement("p");

            newStatusFlag2.setAttribute("style", "padding-top: 6px;");
            newStatusFlag2.innerHTML = ('<i class="far fa-circle"></i>');
            document.getElementById("confirm-attendance-div" + serialNum).appendChild(newStatusFlag2);

        }


    }

} else if (participantsNum && !participants && !attendance) {

    for (var i = 1; i <= participantsNum.value; i++) {
        var newStatusFlag = document.createElement("p");
        newStatusFlag.setAttribute("style", "padding-top: 6px;");
        newStatusFlag.innerHTML = ('<i class="far fa-circle"></i>');
        document.getElementById("confirm-attendance-div" + i).appendChild(newStatusFlag);
    }

}

if(cancelreason){

    document.getElementById("cancelReason").addEventListener("keyup", checkReason);

}

function checkReason() {
    var val = document.getElementById("cancelReason").value;

    if (!val || !val.length) {
        cancelFlag2 = false;
        $("#preparing-cancel-submit-button").attr("disabled", true);
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 50 || val.length > 200) {
        document.getElementById("cancelReason").classList.remove("valid");
        document.getElementById("cancelReason").classList.add("invalid");
        cancelFlag2 = false;
    } else {
        if (regex.test(val)) {
            document.getElementById("cancelReason").classList.remove("invalid");
            document.getElementById("cancelReason").classList.add("valid");
            cancelFlag2 = true;
        } else {
            document.getElementById("cancelReason").classList.remove("valid");
            document.getElementById("cancelReason").classList.add("invalid");
            cancelFlag2 = false;
        }
    }

    checkCancel();

}

function checkCancel() {

    if (cancelFlag1 && cancelFlag2) {
        $("#preparing-cancel-submit-button").attr("disabled", false);
    } else {
        $("#preparing-cancel-submit-button").attr("disabled", true);
    }

}
