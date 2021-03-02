// Initialize Materialize Collapsible
$(document).ready(function () {
    $('.collapsible').collapsible();
});

/* Question Creator Validate */

// Single Choice
var input1 = document.getElementById("questionName1");
var input2 = document.getElementById("description1");
var input3 = document.getElementById("opNum1");

if (input1 && input2 && input3) {

    document.getElementById("questionName1").addEventListener("keyup", checkName1);
    document.getElementById("description1").addEventListener("keyup", checkDes1);
    document.getElementById("opNum1").addEventListener("keyup", checkNum1);

}

// Status flags - single choice
var s1 = false;
var s2 = false;
var s3 = false;
var s4 = false;
var s5 = true;
var s6 = true;
var s7 = false;
var s8 = false;

function checkName1() {
    var val = document.getElementById("questionName1").value;

    if (!val || !val.length) {
        s1 = false;
        s5 = false;
        $("#create-button1").attr("disabled", true);
        $("#update-button1").attr("disabled", true);
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 1 || val.length > 100) {
        document.getElementById("questionName1").classList.remove("valid");
        document.getElementById("questionName1").classList.add("invalid");
        s1 = false;
        s5 = false;
    } else {
        if (regex.test(val)) {
            document.getElementById("questionName1").classList.remove("invalid");
            document.getElementById("questionName1").classList.add("valid");
            s1 = true;
            s5 = true;
        } else {
            document.getElementById("questionName1").classList.remove("valid");
            document.getElementById("questionName1").classList.add("invalid");
            s1 = false;
            s5 = false;
        }
    }

    checkForm();
}

// Check the question description
function checkDes1() {
    var val = document.getElementById("description1").value;

    if (!val || !val.length) {
        s2 = false;
        s6 = false;
        $("#create-button1").attr("disabled", true);
        $("#update-button1").attr("disabled", true);
    }

    if (val.length < 50) {
        document.getElementById("description1").classList.remove("valid");
        document.getElementById("description1").classList.add("invalid");
        s2 = false;
        s6 = false;
    } else {
        document.getElementById("description1").classList.remove("invalid");
        document.getElementById("description1").classList.add("valid");
        s2 = true;
        s6 = true;
    }

    checkForm();
}

// Check the number of options
function checkNum1() {
    var val = document.getElementById("opNum1").value;
    var btn = document.getElementById("addOps1");

    if (!val || !val.length) {
        s3 = false;
        s7 = false;
        $("#create-button1").attr("disabled", true);
        $("#update-button1").attr("disabled", true);
    }

    var regex = /^[1][0]$|^[2-9]$/;
    if (regex.test(val)) {
        document.getElementById("opNum1").classList.remove("invalid");
        document.getElementById("opNum1").classList.add("valid");
        btn.className = "btn waves-effect waves-light blue lighten-1";
        s3 = true;
        s7 = true;
    } else {
        document.getElementById("opNum1").classList.remove("valid");
        document.getElementById("opNum1").classList.add("invalid");
        btn.className = "btn waves-effect waves-light blue lighten-1 disabled";
        s3 = false;
        s7 = false;
    }

    checkForm();

}

// Options handler for the voting creator
function addOps1() {
    var opNum = document.getElementById("opNum1").value;
    var container = document.getElementById("container1");

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

    s4 = true;
    s8 = true;
    checkForm();

};

// Multiple Choices
var input11 = document.getElementById("questionName2");
var input22 = document.getElementById("description2");
var input33 = document.getElementById("opNum2");
var input44 = document.getElementById("numLimit1");

if (input11 && input22 && input33 && input44) {

    document.getElementById("questionName2").addEventListener("keyup", checkName2);
    document.getElementById("description2").addEventListener("keyup", checkDes2);
    document.getElementById("opNum2").addEventListener("keyup", checkNum2);
    document.getElementById("numLimit1").addEventListener("keyup", checkLimit1);

}

// Status flags - multiple choices
var u1 = false;
var u2 = false;
var u3 = false;
var u4 = false;
var u5 = false;
var u6 = true;
var u7 = true;
var u8 = false;
var u9 = false;
var u10 = false;

function checkName2() {
    var val = document.getElementById("questionName2").value;

    if (!val || !val.length) {
        u1 = false;
        u6 = false;
        $("#create-button2").attr("disabled", true);
        $("#update-button1").attr("disabled", true);
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 1 || val.length > 100) {
        document.getElementById("questionName2").classList.remove("valid");
        document.getElementById("questionName2").classList.add("invalid");
        u1 = false;
        u6 = false;
    } else {
        if (regex.test(val)) {
            document.getElementById("questionName2").classList.remove("invalid");
            document.getElementById("questionName2").classList.add("valid");
            u1 = true;
            u6 = true;
        } else {
            document.getElementById("questionName2").classList.remove("valid");
            document.getElementById("questionName2").classList.add("invalid");
            u1 = false;
            u6 = false;
        }
    }

    checkForm();
}

// Check the question description
function checkDes2() {
    var val = document.getElementById("description2").value;

    if (!val || !val.length) {
        u2 = false;
        u7 = false;
        $("#create-button2").attr("disabled", true);
        $("#update-button1").attr("disabled", true);
    }

    if (val.length < 50) {
        document.getElementById("description2").classList.remove("valid");
        document.getElementById("description2").classList.add("invalid");
        u2 = false;
        u7 = false;
    } else {
        document.getElementById("description2").classList.remove("invalid");
        document.getElementById("description2").classList.add("valid");
        u2 = true;
        u7 = true;
    }

    checkForm();
}

// Check the number of options
function checkNum2() {
    var val = document.getElementById("opNum2").value;

    if (!val || !val.length) {
        u3 = false;
        u8 = false;
        $("#create-button2").attr("disabled", true);
        $("#update-button1").attr("disabled", true);
    }

    var regex = /^[1][0]$|^[2-9]$/;
    if (regex.test(val)) {
        document.getElementById("opNum2").classList.remove("invalid");
        document.getElementById("opNum2").classList.add("valid");
        u3 = true;
        u8 = true;
    } else {
        document.getElementById("opNum2").classList.remove("valid");
        document.getElementById("opNum2").classList.add("invalid");
        u3 = false;
        u8 = false;
    }

    checkForm();
    checkAddOps();

}

// Check the number of parties
function checkLimit1() {
    var val1 = document.getElementById("opNum2").value;
    var val2 = document.getElementById("numLimit1").value;

    if (!val1 || !val1.length) {

        document.getElementById("numLimit1").classList.remove("valid");
        document.getElementById("numLimit1").classList.add("invalid");
        u4 = false;
        u9 = false;
        $("#create-button2").attr("disabled", true);
        $("#update-button1").attr("disabled", true);

    } else {

        if (!val2 || !val2.length) {

            u4 = false;
            u9 = false;
            $("#create-button2").attr("disabled", true);

        } else {
            var regex = /^[1][0]$|^[2-9]$/;
            if (regex.test(val2)) {

                if (parseInt(val1) >= parseInt(val2)) {

                    document.getElementById("numLimit1").classList.remove("invalid");
                    document.getElementById("numLimit1").classList.add("valid");
                    u4 = true;
                    u9 = true;

                } else {

                    document.getElementById("numLimit1").classList.remove("valid");
                    document.getElementById("numLimit1").classList.add("invalid");
                    u4 = false;
                    u9 = false;

                }

            } else {

                document.getElementById("numLimit1").classList.remove("valid");
                document.getElementById("numLimit1").classList.add("invalid");
                u4 = false;
                u9 = false;

            }
        }

    }

    checkForm();
    checkAddOps();
}

// Options handler for the voting creator
function addOps2() {
    var opNum = document.getElementById("opNum2").value;
    var container = document.getElementById("container2");

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

    u5 = true;
    u10 = true;
    checkForm();

};

function checkAddOps() {

    var btn = document.getElementById("addOps2");

    if (u3 && u4) {
        btn.className = "btn waves-effect waves-light blue lighten-1";
    } else {
        btn.className = "btn waves-effect waves-light blue lighten-1 disabled";
    }

}

// Fill In the Blank (Numbers Only)
var input111 = document.getElementById("questionName3");
var input222 = document.getElementById("description3");
var input333 = document.getElementById("inputLimit1");
var input444 = document.getElementById("inputLimit2");

if (input111 && input222 && input333 && input444) {

    document.getElementById("questionName3").addEventListener("keyup", checkName3);
    document.getElementById("description3").addEventListener("keyup", checkDes3);
    document.getElementById("inputLimit1").addEventListener("keyup", checkLimit2);
    document.getElementById("inputLimit2").addEventListener("keyup", checkLimit3);

}

// Status flags - multiple choices
var v1 = false;
var v2 = false;
var v3 = false;
var v4 = false;
var v5 = false;
var v6 = true;
var v7 = true;
var v8 = false;
var v9 = false;
var v10 = false;

function checkName3() {
    var val = document.getElementById("questionName3").value;

    if (!val || !val.length) {
        v1 = false;
        v6 = false;
        $("#create-button3").attr("disabled", true);
        $("#update-button1").attr("disabled", true);
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 1 || val.length > 100) {
        document.getElementById("questionName3").classList.remove("valid");
        document.getElementById("questionName3").classList.add("invalid");
        v1 = false;
        v6 = false;
    } else {
        if (regex.test(val)) {
            document.getElementById("questionName3").classList.remove("invalid");
            document.getElementById("questionName3").classList.add("valid");
            v1 = true;
            v6 = true;
        } else {
            document.getElementById("questionName3").classList.remove("valid");
            document.getElementById("questionName3").classList.add("invalid");
            v1 = false;
            v6 = false;
        }
    }

    checkForm();
}

// Check the question description
function checkDes3() {
    var val = document.getElementById("description3").value;

    if (!val || !val.length) {
        v2 = false;
        v7 = false;
        $("#create-button3").attr("disabled", true);
        $("#update-button1").attr("disabled", true);
    }

    if (val.length < 50) {
        document.getElementById("description3").classList.remove("valid");
        document.getElementById("description3").classList.add("invalid");
        v2 = false;
        v7 = false;
    } else {
        document.getElementById("description3").classList.remove("invalid");
        document.getElementById("description3").classList.add("valid");
        v2 = true;
        v7 = true;
    }

    checkForm();
}

// Check the lower limit and the upper limit
function checkLimit2() {
    var val = document.getElementById("inputLimit1").value;

    if (!val || !val.length) {

        document.getElementById("inputLimit1").classList.remove("valid");
        document.getElementById("inputLimit1").classList.add("invalid");
        v3 = false;
        v8 = false;
        $("#create-button3").attr("disabled", true);
        $("#update-button1").attr("disabled", true);

    }

    var regex = /^([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1][0][0][0][0])$/;
    if (regex.test(val)) {

        document.getElementById("inputLimit1").classList.remove("invalid");
        document.getElementById("inputLimit1").classList.add("valid");
        v3 = true;
        v8 = true;

    } else {

        document.getElementById("inputLimit1").classList.remove("valid");
        document.getElementById("inputLimit1").classList.add("invalid");
        v3 = false;
        v8 = false;

    }

    checkLimits();
    checkForm();
}

function checkLimit3() {
    var val = document.getElementById("inputLimit2").value;

    if (!val || !val.length) {

        document.getElementById("inputLimit2").classList.remove("valid");
        document.getElementById("inputLimit2").classList.add("invalid");
        v4 = false;
        v9 = false;
        $("#create-button3").attr("disabled", true);
        $("#update-button1").attr("disabled", true);

    }

    var regex = /^([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1][0][0][0][0])$/;
    if (regex.test(val)) {

        document.getElementById("inputLimit2").classList.remove("invalid");
        document.getElementById("inputLimit2").classList.add("valid");
        v4 = true;
        v9 = true;

    } else {

        document.getElementById("inputLimit2").classList.remove("valid");
        document.getElementById("inputLimit2").classList.add("invalid");
        v4 = false;
        v9 = false;

    }

    checkLimits();
    checkForm();
}

function checkLimits() {

    var val1 = document.getElementById("inputLimit1").value;
    var val2 = document.getElementById("inputLimit2").value;

    if (val1 && val2) {

        var regex = /^([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|[1][0][0][0][0])$/;
        if (regex.test(val1) && regex.test(val2)) {

            if (parseInt(val1) <= parseInt(val2)) {

                document.getElementById("inputLimit1").classList.remove("invalid");
                document.getElementById("inputLimit1").classList.add("valid");
                document.getElementById("inputLimit2").classList.remove("invalid");
                document.getElementById("inputLimit2").classList.add("valid");
                v5 = true;
                v10 = true;

            } else {

                document.getElementById("inputLimit1").classList.remove("valid");
                document.getElementById("inputLimit1").classList.add("invalid");
                document.getElementById("inputLimit2").classList.remove("valid");
                document.getElementById("inputLimit2").classList.add("invalid");
                v5 = false;
                v10 = false;

            }

        } else {

            v5 = false;
            v10 = false;

        }

    } else {

        v5 = false;
        v10 = false;

    }
}

// Make sure that the button only active if some fields validated
function checkForm() {

    if (s1 && s2 && s3 && s4) {
        $("#create-button1").attr("disabled", false);
    } else {
        $("#create-button1").attr("disabled", true);
    }

    if (u1 && u2 && u3 && u4 && u5) {
        $("#create-button2").attr("disabled", false);
    } else {
        $("#create-button2").attr("disabled", true);
    }

    if (v1 && v2 && v3 && v4 && v5) {
        $("#create-button3").attr("disabled", false);
    } else {
        $("#create-button3").attr("disabled", true);
    }

    var questionedit = document.getElementById("checkQuestionType");

    if (questionedit) {

        if (questionedit.value == "Radio") {

            if (s5 && s6 && s7 && s8) {
                $("#update-button1").attr("disabled", false);
            } else {
                $("#update-button1").attr("disabled", true);
            }

        } else if (questionedit.value == "Checkbox") {

            if (u6 && u7 && u8 && u9 && u10) {
                $("#update-button1").attr("disabled", false);
            } else {
                $("#update-button1").attr("disabled", true);
            }

        } else {

            if (v6 && v7 && v8 && v9 && v10) {
                $("#update-button1").attr("disabled", false);
            } else {
                $("#update-button1").attr("disabled", true);
            }

        }

    }

}

// Validate Survey Creation
var inputs1 = document.getElementById("surveyTitle");
var inputs2 = document.getElementById("description");
var inputs3 = document.getElementById("partyCount");

if (inputs1 && inputs2 && inputs3) {

    document.getElementById("surveyTitle").addEventListener("keyup", checkTitle);
    document.getElementById("description").addEventListener("keyup", checkDes);
    document.getElementById("partyCount").addEventListener("keyup", checkCount);

} else if (!inputs1 && !inputs2 && inputs3) {

    document.getElementById("partyCount").addEventListener("keyup", checkCount);

}

// Status flags - survey creator
var sc1 = false;
var sc2 = false;
var sc3 = false;

// Status flags - survey editor (unpublished)
var su1 = true;
var su2 = true;
var su3 = true;

/// Status flags - survey editor (published)
var sp3 = true;

// Check the survey title
function checkTitle() {
    var val = document.getElementById("surveyTitle").value;

    if (!val || !val.length) {
        sc1 = false;
        su1 = false;
        $("#survey-create-button").attr("disabled", true);
        $("#survey-update-button").attr("disabled", true);
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 1 || val.length > 200) {
        document.getElementById("surveyTitle").classList.remove("valid");
        document.getElementById("surveyTitle").classList.add("invalid");
        sc1 = false;
        su1 = false;
    } else {
        if (regex.test(val)) {
            document.getElementById("surveyTitle").classList.remove("invalid");
            document.getElementById("surveyTitle").classList.add("valid");
            sc1 = true;
            su1 = true;
        } else {
            document.getElementById("surveyTitle").classList.remove("valid");
            document.getElementById("surveyTitle").classList.add("invalid");
            sc1 = false;
            su1 = false;
        }
    }

    checkForm2();
}

// Check the survey description
function checkDes() {
    var val = document.getElementById("description").value;

    if (!val || !val.length) {
        sc2 = false;
        su2 = false;
        $("#survey-create-button").attr("disabled", true);
        $("#survey-update-button").attr("disabled", true);
    }

    if (val.length < 50) {
        document.getElementById("description").classList.remove("valid");
        document.getElementById("description").classList.add("invalid");
        sc2 = false;
        su2 = false;
    } else {
        document.getElementById("description").classList.remove("invalid");
        document.getElementById("description").classList.add("valid");
        sc2 = true;
        su2 = true;
    }

    checkForm2();
}

// Check the number of parties
function checkCount() {
    var val = document.getElementById("partyCount").value;

    if (!val || !val.length) {
        sc3 = false;
        su3 = false;
        sp3 = false;
        $("#survey-create-button").attr("disabled", true);
        $("#survey-update-button").attr("disabled", true);
        $("#survey-pupdate-button").attr("disabled", true);
    }

    var regex = /^[5][0]$|^[1-4][0-9]$|^[2-9]$/;
    if (regex.test(val)) {
        document.getElementById("partyCount").classList.remove("invalid");
        document.getElementById("partyCount").classList.add("valid");
        sc3 = true;
        su3 = true;
        sp3 = true;
    } else {
        document.getElementById("partyCount").classList.remove("valid");
        document.getElementById("partyCount").classList.add("invalid");
        sc3 = false;
        su3 = false;
        sp3 = false;
    }

    checkForm2();
}

// Make sure that the button only active if some fields validated
function checkForm2() {

    if (sc1 && sc2 && sc3) {
        $("#survey-create-button").attr("disabled", false);
    } else {
        $("#survey-create-button").attr("disabled", true);
    }

    if (su1 && su2 && su3) {
        $("#survey-update-button").attr("disabled", false);
    } else {
        $("#survey-update-button").attr("disabled", true);
    }

    if (sp3) {
        $("#survey-pupdate-button").attr("disabled", false);
    } else {
        $("#survey-pupdate-button").attr("disabled", true);
    }

}

// Validate unpublished and published surveys
var surveyidval = document.getElementById("surveyidval");
var radioQNum = document.getElementById("radioQNum");
var checkboxQNum = document.getElementById("checkboxQNum");
var inputQNum = document.getElementById("inputQNum");

if (radioQNum && checkboxQNum && inputQNum) {

    var Qnum = parseInt(radioQNum.value) + parseInt(checkboxQNum.value) + parseInt(inputQNum.value);

    document.getElementById("QuestionNum").innerHTML = ('Number of Questions:&nbsp;&nbsp; ' + Qnum);

    if (Qnum > 0 && Qnum <= 10) {

        if (document.getElementById("unpublished-prompt")) {

            document.getElementById("unpublished-prompt").className = "green-text text-darken-2 center";
            document.getElementById("unpublished-prompt").innerHTML = ('- This survey is ready to be published -');
            $("#publish-button").attr("disabled", false);

        }

    } else {

        if (document.getElementById("unpublished-prompt")) {

            document.getElementById("unpublished-prompt").className = "red-text text-darken-2 center";
            document.getElementById("unpublished-prompt").innerHTML = ('- Please go to your &nbsp;<a href="/users/surveys/question"><span class="light-blue-text text-darken-1"><i class="fas fa-book"></i> Question Bank</span></a>&nbsp; to add some questions in this survey  -');
            $("#publish-button").attr("disabled", true);

        }
    }

    if (parseInt(radioQNum.value) > 0) {

        for (var i = 1; i <= parseInt(radioQNum.value); i++) {

            document.getElementById("surveyid1" + i).setAttribute("value", document.getElementById("surveyidval").value);

        }

    }

    if (parseInt(checkboxQNum.value) > 0) {

        for (var i = 1; i <= parseInt(checkboxQNum.value); i++) {

            document.getElementById("surveyid2" + i).setAttribute("value", document.getElementById("surveyidval").value);

        }

    }

    if (parseInt(inputQNum.value) > 0) {

        for (var i = 1; i <= parseInt(inputQNum.value); i++) {

            document.getElementById("surveyid3" + i).setAttribute("value", document.getElementById("surveyidval").value);

        }

    }

}

// Validate Published Survey
var expectedNum = document.getElementById("expected_num");
var registerNum = document.getElementById("reg_num");
var promptMsg1 = document.getElementById("prompt_msg");
var promptMsg2 = document.getElementById("prompt_msg2");
var password1 = document.getElementById("password_check1");
var password2 = document.getElementById("password_check2");
var password31 = document.getElementById("password_check31");
var password4 = document.getElementById("password_check4");
var surveyid = document.getElementById("surveyidval1");
var registrant1 = document.getElementById("reg-serialNum1");
var registrants = document.getElementById("all_participants");
var userID = document.getElementById("user_id");

if (expectedNum && registerNum) {

    if (expectedNum.value == registerNum.value) {
        $("#consent-button").attr("disabled", false);
        var newMsg = document.createElement("p");
        newMsg.className = "green-text text-darken-1 center";
        newMsg.innerHTML = ("- This survey is ready to be consented -");
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
        newMsg.innerHTML = ("- You have already registered this survey -");
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

if (registerNum && surveyid) {
    for (var i = 1; i <= registerNum.value; i++) {
        var surveyid3 = document.getElementById("surveyidR" + i);
        surveyid3.value = surveyid.value;

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

// Validate Preparing Survey
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
            promptcontent2.innerHTML = ('[ <i class="fas fa-file-signature"></i> Survey Session Attendance Confirmation ]');
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

