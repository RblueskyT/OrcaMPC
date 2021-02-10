var input1 = document.getElementById("votingTitle");
var input2 = document.getElementById("description");
var input3 = document.getElementById("partyCount");
var input4 = document.getElementById("opNum");

if (input1 && input2 && input3 && input4) {

    document.getElementById("votingTitle").addEventListener("keyup", checkTitle);
    document.getElementById("description").addEventListener("keyup", checkDes);
    document.getElementById("partyCount").addEventListener("keyup", checkCount);
    document.getElementById("opNum").addEventListener("keyup", checkNum);

} else if (!input1 && !input2 && input3 && input4) {
    document.getElementById("partyCount").addEventListener("keyup", checkCount);
    document.getElementById("opNum").addEventListener("keyup", checkNum);
}

// Status flags - voting creator
var s1 = false;
var s2 = false;
var s3 = false;
var s4 = false;
var s5 = false;

// Status flags - voting editor (unpublished)
var u1 = true;
var u2 = true;
var u3 = true;
var u4 = false;
var u5 = false;

// Status flags - voting editor (published)
var v3 = true;
var v4 = false;
var v5 = false;

// Check the voting title
function checkTitle() {
    var val = document.getElementById("votingTitle").value;

    if (!val || !val.length) {
        s1 = false;
        u1 = false;
        $("#create-button").attr("disabled", true);
        $("#update-button").attr("disabled", true);
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 1 || val.length > 200) {
        document.getElementById("votingTitle").classList.remove("valid");
        document.getElementById("votingTitle").classList.add("invalid");
        s1 = false;
        u1 = false;
    } else {
        if (regex.test(val)) {
            document.getElementById("votingTitle").classList.remove("invalid");
            document.getElementById("votingTitle").classList.add("valid");
            s1 = true;
            u1 = true;
        } else {
            document.getElementById("votingTitle").classList.remove("valid");
            document.getElementById("votingTitle").classList.add("invalid");
            s1 = false;
            u1 = false;
        }
    }

    checkForm();
}

// Check the voting description
function checkDes() {
    var val = document.getElementById("description").value;

    if (!val || !val.length) {
        s2 = false;
        u2 = false;
        $("#create-button").attr("disabled", true);
        $("#update-button").attr("disabled", true);
    }

    if (val.length < 50) {
        document.getElementById("description").classList.remove("valid");
        document.getElementById("description").classList.add("invalid");
        s2 = false;
        u2 = false;
    } else {
        document.getElementById("description").classList.remove("invalid");
        document.getElementById("description").classList.add("valid");
        s2 = true;
        u2 = true;
    }

    checkForm();
}

// Check the number of parties
function checkCount() {
    var val = document.getElementById("partyCount").value;

    if (!val || !val.length) {
        s3 = false;
        u3 = false;
        v3 = false;
        $("#create-button").attr("disabled", true);
        $("#update-button").attr("disabled", true);
        $("#pupdate-button").attr("disabled", true);
    }

    var regex = /^[5][0]$|^[1-4][0-9]$|^[2-9]$/;
    if (regex.test(val)) {
        document.getElementById("partyCount").classList.remove("invalid");
        document.getElementById("partyCount").classList.add("valid");
        s3 = true;
        u3 = true;
        v3 = true;
    } else {
        document.getElementById("partyCount").classList.remove("valid");
        document.getElementById("partyCount").classList.add("invalid");
        s3 = false;
        u3 = false;
        v3 = false;
    }

    checkForm();
}

// Check the number of options
function checkNum() {
    var val = document.getElementById("opNum").value;
    var btn = document.getElementById("addOps");

    if (!val || !val.length) {
        s4 = false;
        u4 = false;
        v4 = false;
        $("#create-button").attr("disabled", true);
        $("#update-button").attr("disabled", true);
        $("#pupdate-button").attr("disabled", true);
    }

    var regex = /^[1][0]$|^[2-9]$/;
    if (regex.test(val)) {
        document.getElementById("opNum").classList.remove("invalid");
        document.getElementById("opNum").classList.add("valid");
        btn.className = "btn waves-effect waves-light blue lighten-1";
        s4 = true;
        u4 = true;
        v4 = true;
    } else {
        document.getElementById("opNum").classList.remove("valid");
        document.getElementById("opNum").classList.add("invalid");
        btn.className = "btn waves-effect waves-light blue lighten-1 disabled";
        s4 = false;
        u4 = false;
        v4 = false;
    }
    checkForm();

}

// Options handler for the voting creator
function addOps() {
    var opNum = document.getElementById("opNum").value;
    var container = document.getElementById("container");

    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }

    for (i = 0; i < opNum; i++) {
        var newdiv = document.createElement("div");
        var input = document.createElement("input");
        var newlabel = document.createElement("label");
        var newspan = document.createElement("span");

        input.placeholder = "Enter your option here ...";
        input.type = "text";
        input.id = ("option " + (i + 1));
        input.name = "options";
        input.className = "validate";
        input.required = true;

        newlabel.setAttribute("for", ("option " + (i + 1)));
        newlabel.className = "active";
        newlabel.innerHTML = ("Option " + (i + 1));

        newspan.className = "helper-text";
        newspan.setAttribute("data-error", "Please fill in this field");
        newspan.setAttribute("data-success", "Input completed");

        newdiv.className = "input-field";
        newdiv.appendChild(input);
        newdiv.appendChild(newlabel);
        newdiv.appendChild(newspan);

        container.appendChild(newdiv);
        container.appendChild(document.createElement("br"));
    }

    s5 = true;
    u5 = true;
    v5 = true;
    checkForm();

};

// Make sure that the button only active if some fields validated
function checkForm() {

    if (s1 && s2 && s3 && s4 && s5) {
        $("#create-button").attr("disabled", false);
    } else {
        $("#create-button").attr("disabled", true);
    }

    if (u1 && u2 && u3 && u4 && u5) {
        $("#update-button").attr("disabled", false);
    } else {
        $("#update-button").attr("disabled", true);
    }

    if (v3 && v4 && v5) {
        $("#pupdate-button").attr("disabled", false);
    } else {
        $("#pupdate-button").attr("disabled", true);
    }

}

// Validate Published Voting
var expectedNum = document.getElementById("expected_num");
var registerNum = document.getElementById("reg_num");
var promptMsg1 = document.getElementById("prompt_msg");
var promptMsg2 = document.getElementById("prompt_msg2");
var password1 = document.getElementById("password_check1");
var password2 = document.getElementById("password_check2");
var password31 = document.getElementById("password_check31");
var password4 = document.getElementById("password_check4");
var votingid = document.getElementById("votingid1");
var registrant1 = document.getElementById("reg-serialNum1");
var registrants = document.getElementById("all_participants");
var userID = document.getElementById("user_id");

if (expectedNum && registerNum) {

    if (expectedNum.value == registerNum.value) {
        $("#consent-button").attr("disabled", false);
        var newMsg = document.createElement("p");
        newMsg.className = "green-text text-darken-1 center";
        newMsg.innerHTML = ("- This voting is ready to be consented -");
        promptMsg1.appendChild(newMsg);
    } else {
        $("#consent-button").attr("disabled", true);
        if (registerNum.value < expectedNum.value) {
            var newMsg = document.createElement("p");
            newMsg.className = "grey-text text-darken-1 center";
            newMsg.innerHTML = ("- Please wait for other users to register -");
            promptMsg1.appendChild(newMsg);
        } else {
            var newMsg = document.createElement("p");
            newMsg.className = "red-text text-darken-1 center";
            newMsg.innerHTML = ("- Overfull registrants -");
            promptMsg1.appendChild(newMsg);
        }
    }
}

if (registrants && userID && expectedNum) {

    var registrants_arr = (registrants.value).split(',');
    registrants_arr.splice(-1, 1);
    var msgFlag = false;

    for (var i = 0; i < registrants_arr.length; i++) {

        if (userID.value === registrants_arr[i]) {

            $("#published-unreg-button").attr("disabled", false);
            $("#published-reg-button").attr("disabled", true);
            msgFlag = true;
            break;
        }

        $("#published-unreg-button").attr("disabled", true);
        $("#published-reg-button").attr("disabled", false);

    }

    if (msgFlag == true) {

        var newMsg = document.createElement("p");
        newMsg.className = "green-text text-darken-1 center";
        newMsg.innerHTML = ("- You have already registered this voting -");
        promptMsg2.appendChild(newMsg);

    } else {

        if (registrants_arr.length < expectedNum.value) {

            var newMsg = document.createElement("p");
            newMsg.className = "grey-text text-darken-1 center";
            newMsg.innerHTML = ("- Insufficient registrants -");
            promptMsg2.appendChild(newMsg);

        } else {

            var newMsg = document.createElement("p");
            newMsg.className = "red-text text-darken-1 center";
            newMsg.innerHTML = ("- Overfull registrants -");
            promptMsg2.appendChild(newMsg);

        }

    }

}

if (registrant1) {
    registrant1.setAttribute("style", "margin-right: 1px;");
}

if (password1 && password2 && password31) {

    document.getElementById("password_check1").addEventListener("keyup", checkPwd);
    document.getElementById("password_check2").addEventListener("keyup", checkPwd);

    for (var i = 1; i <= registerNum.value; i++) {
        document.getElementById("password_check3" + i).addEventListener("keyup", checkPwd);
    }

} else if (password1 && password2 && !password31) {

    document.getElementById("password_check1").addEventListener("keyup", checkPwd);
    document.getElementById("password_check2").addEventListener("keyup", checkPwd);

} else if (!password1 && !password2 && !password31 && password4) {

    document.getElementById("password_check4").addEventListener("keyup", checkPwd2);

}

if (registerNum && votingid) {
    for (var i = 1; i <= registerNum.value; i++) {
        var votingid3 = document.getElementById("votingid3" + i);
        votingid3.value = votingid.value;

        if (i == 1) {
            $("#reg-remove-button" + i).attr("disabled", true);
        } else {
            $("#reg-remove-button" + i).attr("disabled", false);
        }
    }
}

function checkPwd() {
    var val1 = document.getElementById("password_check1").value;
    var val2 = document.getElementById("password_check2").value;

    if (!val1 || !val1.length) {
        $("#pcancel-button").attr("disabled", true);
        $("#punreg-button").attr("disabled", true);
    } else {
        $("#pcancel-button").attr("disabled", false);
        $("#punreg-button").attr("disabled", false);
    }

    if (!val2 || !val2.length) {
        $("#prepare-button").attr("disabled", true);
        $("#register-button").attr("disabled", true);
    } else {
        $("#prepare-button").attr("disabled", false);
        $("#register-button").attr("disabled", false);
    }

    if (registerNum) {
        for (var i = 1; i <= registerNum.value; i++) {
            var val3 = document.getElementById("password_check3" + i).value;
            if (!val3 || !val3.length) {
                $("#remove-button" + i).attr("disabled", true);
            } else {
                $("#remove-button" + i).attr("disabled", false);
            }
        }
    }

}

// Validate Preparing Voting
var participantsNum = document.getElementById("participants_num");
var participants = document.getElementById("session_participants");
var attendance = document.getElementById("session_attendance");
var myuserid = document.getElementById("my_userid");
var promptcontent = document.getElementById("prompt_msg_content");
var promptcontent2 = document.getElementById("prompt_msg2");

if (participantsNum && participants && attendance && myuserid) {

    var participants_arr = (participants.value).split(',');
    var attendance_arr = (attendance.value).split(',');

    if (participants_arr.length != attendance_arr.length) {

        var flag = false;

        for (var i = 0; i < attendance_arr.length; i++) {

            if (myuserid.value === attendance_arr[i]) {
                flag = true;
                break;
            }
        }

        if (flag == true) {
            promptcontent.className = "grey-text text-darken-1 center";
            promptcontent.innerHTML = ("- Please wait for other users to confirm -");
            promptcontent2.className = "green-text text-darken-2 center";
            promptcontent2.innerHTML = ("- You have already confirmed your attendance -");
            $("#confirmattendance-button").attr("disabled", true);
        } else {
            promptcontent.className = "red-text text-darken-1 center";
            promptcontent.innerHTML = ("- Please confirm your attendance -");
            promptcontent2.className = "cyan-text text-darken-2 center";
            promptcontent2.innerHTML = ('[ <i class="fas fa-file-signature"></i> Voting Session Attendance Confirmation ]');
            $("#confirmattendance-button").attr("disabled", false);
        }

    } else {

        promptcontent.className = "green-text text-darken-1 center";
        promptcontent.innerHTML = ("- Please wait for the creator to initiate -");
        promptcontent2.className = "green-text text-darken-2 center";
        promptcontent2.innerHTML = ("- You have already confirmed your attendance -");
        $("#confirmattendance-button").attr("disabled", true);

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

function checkPwd2() {
    var val4 = document.getElementById("password_check4").value;

    if (!val4 || !val4.length) {
        $("#attendance-submit").attr("disabled", true);
    } else {
        $("#attendance-submit").attr("disabled", false);
    }

}

