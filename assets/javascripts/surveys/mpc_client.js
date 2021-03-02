// Set limitations for all multiple choices questions
var checkboxQNum = document.getElementById("checkboxQNum");

var checkboxNames = [];

if (checkboxQNum) {

    for (var i = 0; i < parseInt(checkboxQNum.value); i++) {

        var checkboxName = "Coptions" + i;
        checkboxNames.push(checkboxName);

    }

    checkboxNames.forEach(setLimit);

}

function setLimit(item, index) {

    var newLimit = parseInt(document.getElementById("checkboxLimit" + index).value);

    $('input[name=' + item + ']').on('change', function (e) {
        if ($('input[name=' + item + ']:checked').length > newLimit) {
            $(this).prop('checked', false);
        }
    });

}

// Check the survey pattern - Only for User Initiator
var checkPattern = document.getElementById("SurveyPattern");
var checkComputeBtn = document.getElementById("initiating-finish-button");

if (checkPattern.value == "Collect" && checkComputeBtn) {
    checkComputeBtn.removeAttribute("disabled");
}


// Set PartyID for all users
var userID = document.getElementById("survey_user_id");
var parties = document.getElementById("survey_people");
var partiesArr = (parties.value).split(',');
var myPartyID;
var myID = document.getElementById("my_party_id");

for (var i = 0; i < partiesArr.length; i++) {
    if (userID.value == partiesArr[i]) {
        myPartyID = i + 1;
    }
}

myID.setAttribute("value", myPartyID);

// Automatically connect to jiff client - Only for the survey initiator
var jiffClient;

if (parseInt(myID.value) == 1) {

    var cid = document.getElementById("survey_id");
    var partiesNum = document.getElementById("survey_partycount");
    var secretkey_string = document.getElementById("secret_key");
    var publickey_string = document.getElementById("public_key");
    var surveyType = document.getElementById("SurveyPattern");

    if (cid && secretkey_string && publickey_string) {

        var computationid = cid.value;
        var partyid = parseInt(myID.value);
        var partycount;

        if (surveyType.value == "Participate") {
            partycount = parseInt(partiesNum.value) + 1;
        } else {
            partycount = parseInt(partiesNum.value);
        }

        var secretkey_o = (document.getElementById("secret_key").value).split(',');
        var publickey_o = (document.getElementById("public_key").value).split(',');
        var secretkey_m = [];
        var publickey_m = [];


        for (var i = 0; i < secretkey_o.length; i++) {
            secretkey_m.push(parseInt(secretkey_o[i]));
        }

        for (var i = 0; i < publickey_o.length; i++) {
            publickey_m.push(parseInt(publickey_o[i]));
        }

        var secretkey = new Uint8Array(secretkey_m);
        var publickey = new Uint8Array(publickey_m);

        var options = {
            party_id: partyid,
            party_count: partycount,
            secret_key: secretkey,
            public_key: publickey,
            crypto_provider: true,
            socketOptions: {
                reconnectionDelay: 3000,
                reconnectionDelayMax: 4000
            }
        };

        jiffClient = new JIFFClient('http://localhost:8080', computationid, options);

    }

}

// handle user inputs - Initiator
function confirmAnswers() {

    var radioQ = document.getElementById("radioQNum");
    var checkboxQ = document.getElementById("checkboxQNum");
    var inputQ = document.getElementById("inputQNum");
    var checkFlags = [];

    // Check user input
    if (radioQ) {

        if ($('input[type=radio]:checked').length != parseInt(radioQ.value)) {
            checkFlags.push(0);
        } else {
            checkFlags.push(1);
        }

    }

    if (checkboxQ) {

        var newFlag = true;

        for (var i = 0; i < parseInt(checkboxQ.value); i++) {

            var newQName = "Coptions" + i;
            if ($('input[name=' + newQName + ']:checked').length == 0) {
                newFlag = false;
                break;
            }

        }

        if (newFlag) {
            checkFlags.push(1);
        } else {
            checkFlags.push(0);
        }

    }

    if (inputQ) {

        var newFlag = true;

        var regex = /^[0-9]+$/;

        for (var i = 0; i < parseInt(inputQ.value); i++) {

            var numVal = document.getElementById("numInput" + i).value;

            if (!numVal || !numVal.length) {
                newFlag = false;
                break;
            }

            if (regex.test(numVal)) {

                var inputLimit = document.getElementById("inputNumLimit" + i).value.split(',');

                if (parseInt(numVal) < parseInt(inputLimit[0]) || parseInt(numVal) > parseInt(inputLimit[1])) {
                    newFlag = false;
                    break;
                }

            } else {
                newFlag = false;
                break;
            }

        }

        if (newFlag) {
            checkFlags.push(1);
        } else {
            checkFlags.push(0);
        }


    }

    // If all the inputs validated, connect to the jiff client and submit the answers
    var flagLen = checkFlags.length;

    if ((checkFlags.reduce((a, b) => a + b, 0)) != flagLen) {
        alert('Please finish all the questions or check your input format');
    } else {

        var userInputs = [];
        var radios = $('input[type=radio]');
        var checkboxes = $('input[type=checkbox]');
        var numbers = $('input[type=number]');

        for (var i = 0; i < radios.length; i++) {
            userInputs.push(radios[i].checked ? 1 : 0);
        }

        for (var i = 0; i < checkboxes.length; i++) {
            userInputs.push(checkboxes[i].checked ? 1 : 0);
        }

        for (var i = 0; i < numbers.length; i++) {
            userInputs.push(parseInt(numbers[i].value));
        }

        var confirmButton = document.getElementById("confirmButton");
        confirmButton.setAttribute("disabled", true);
        radios.prop('disabled', true);
        checkboxes.prop('disabled', true);
        numbers.prop('disabled', true);
        var computeButton = document.getElementById("initiating-finish-button");
        computeButton.removeAttribute("disabled");

        var checkID = parseInt(myID.value);
        var cid = document.getElementById("survey_id");

        if (checkID == 1) {
            var newPartyCount = parseInt(partiesNum.value) + 1;
            var newJiffClient = new JIFFClient('http://localhost:8080', cid.value, { party_id: 2, party_count: newPartyCount });

            newJiffClient.wait_for([1], function () {
                newJiffClient.share_array(userInputs, userInputs.length, 1, [1], [2]);
                newJiffClient.disconnect(true, true);
            });
        }

    }

}

// Check finish button
function checkSubmitters() {

    if ((document.getElementById("refresh_parnum").value - 1) == document.getElementById("refresh_submitnum").value) {
        var computeButton = document.getElementById("initiating-compute-submit");
        computeButton.removeAttribute("disabled");
    }
}

// Handle submissions from other users
function otherUserSubmit() {

    var radioQ = document.getElementById("radioQNum");
    var checkboxQ = document.getElementById("checkboxQNum");
    var inputQ = document.getElementById("inputQNum");
    var checkFlags = [];

    // Check user input
    if (radioQ) {

        if ($('input[type=radio]:checked').length != parseInt(radioQ.value)) {
            checkFlags.push(0);
        } else {
            checkFlags.push(1);
        }

    }

    if (checkboxQ) {

        var newFlag = true;

        for (var i = 0; i < parseInt(checkboxQ.value); i++) {

            var newQName = "Coptions" + i;
            if ($('input[name=' + newQName + ']:checked').length == 0) {
                newFlag = false;
                break;
            }

        }

        if (newFlag) {
            checkFlags.push(1);
        } else {
            checkFlags.push(0);
        }

    }

    if (inputQ) {

        var newFlag = true;

        var regex = /^[0-9]+$/;

        for (var i = 0; i < parseInt(inputQ.value); i++) {

            var numVal = document.getElementById("numInput" + i).value;

            if (!numVal || !numVal.length) {
                newFlag = false;
                break;
            }

            if (regex.test(numVal)) {

                var inputLimit = document.getElementById("inputNumLimit" + i).value.split(',');

                if (parseInt(numVal) < parseInt(inputLimit[0]) || parseInt(numVal) > parseInt(inputLimit[1])) {
                    newFlag = false;
                    break;
                }

            } else {
                newFlag = false;
                break;
            }

        }

        if (newFlag) {
            checkFlags.push(1);
        } else {
            checkFlags.push(0);
        }


    }

    // If all the inputs validated, connect to the jiff client and submit the answers
    var flagLen = checkFlags.length;

    if ((checkFlags.reduce((a, b) => a + b, 0)) != flagLen) {
        alert('Please finish all the questions or check your input format');
    } else {

        var userInputs = [];
        var radios = $('input[type=radio]');
        var checkboxes = $('input[type=checkbox]');
        var numbers = $('input[type=number]');

        for (var i = 0; i < radios.length; i++) {
            userInputs.push(radios[i].checked ? 1 : 0);
        }

        for (var i = 0; i < checkboxes.length; i++) {
            userInputs.push(checkboxes[i].checked ? 1 : 0);
        }

        for (var i = 0; i < numbers.length; i++) {
            userInputs.push(parseInt(numbers[i].value));
        }

        var computationid = document.getElementById("survey_id").value;
        var partyid;
        var partiesNum = document.getElementById("survey_partycount");
        var newpartyCount;

        if (checkPattern.value == "Participate") {
            newpartyCount = parseInt(partiesNum.value) + 1;
            partyid = parseInt(myID.value) + 1;
        } else {
            newpartyCount = parseInt(partiesNum.value);
            partyid = parseInt(myID.value);
        }

        var options = {
            party_id: partyid,
            party_count: newpartyCount
        };

        jiffClient = new JIFFClient('http://localhost:8080', computationid, options);

        jiffClient.wait_for([1], function () {
            jiffClient.share_array(userInputs, userInputs.length, 1, [1], [jiffClient.id]);
            jiffClient.disconnect(true, true);
        });

        document.getElementById("initiating-submit-button").setAttribute("disabled", true);
        document.getElementById("initiating-back-button").setAttribute("disabled", true);
        var radios = $('input[type=radio]');
        var checkboxes = $('input[type=checkbox]');
        var numbers = $('input[type=number]');
        radios.prop('disabled', true);
        checkboxes.prop('disabled', true);
        numbers.prop('disabled', true);

        document.getElementById("initiating-submit-button").innerHTML = ('<strong>Please Wait</strong>');
        document.getElementById("loading_prompt").className = "progress";
        document.getElementById("loading_prompt").innerHTML = ('<div class="indeterminate blue lighten-1"></div>');

        setTimeout(function () {
            $('#others_answers').submit();
        }, 10000);

    }

}

// Compute the final results
function initiatorCompute() {

    var shares = {};
    var finalResults = [];
    var surveyLength = 0;
    var checkRadio = document.getElementById("checkSRadioL");
    var checkCheckbox = document.getElementById("checkSCheckboxL");
    var checkInput = document.getElementById("checkSInputL");

    if (checkRadio) {
        for (var i = 0; i < parseInt(checkRadio.value); i++) {
            surveyLength = surveyLength + parseInt(document.getElementById("checkOpRadioL" + i).value);
        }
    }

    if (checkCheckbox) {
        for (var i = 0; i < parseInt(checkCheckbox.value); i++) {
            surveyLength = surveyLength + parseInt(document.getElementById("checkOpCheckboxL" + i).value);
        }
    }

    if (checkInput) {
        surveyLength = surveyLength + parseInt(checkInput.value);
    }

    for (var i = 2; i <= jiffClient.party_count; i++) {
        shares[i] = jiffClient.share_array(null, surveyLength, 1, [1], [i])[i];
    }

    var results = shares[2];
    for (var j = 3; j <= jiffClient.party_count; j++) {
        for (var i = 0; i < shares[j].length; i++) {
            results[i] = results[i].sadd(shares[j][i]);
        }
    }

    jiffClient.open_array(results, [1]).then(function (results) {

        finalResults = results;
        var inputResults = document.getElementById("result");
        inputResults.setAttribute("value", finalResults);
        jiffClient.disconnect(true, true);

    });

    document.getElementById("initiating-finish-button").setAttribute("disabled", true);
    document.getElementById("initiating-cancel-button").setAttribute("disabled", true);
    document.getElementById("initiating-finish-button").innerHTML = ('<strong>Please Wait</strong>');
    document.getElementById("loading_prompt").className = "progress";
    document.getElementById("loading_prompt").innerHTML = ('<div class="indeterminate blue lighten-1"></div>');

    setTimeout(function () {
        $('#initiator_compute').submit();
    }, 10000);

}

// Check if user enter the reason of cancellation
var cancelReason = document.getElementById("cancelReason");

if (cancelReason) {

    document.getElementById("cancelReason").addEventListener("keyup", checkReason);

}

function checkReason() {
    var val = document.getElementById("cancelReason").value;

    if (!val || !val.length) {
        cancelFlag2 = false;
        $("#initiating-cancel-submit-button").attr("disabled", true);
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 50 || val.length > 200) {
        document.getElementById("cancelReason").classList.remove("valid");
        document.getElementById("cancelReason").classList.add("invalid");
        $("#initiating-cancel-submit-button").attr("disabled", true);
    } else {
        if (regex.test(val)) {
            document.getElementById("cancelReason").classList.remove("invalid");
            document.getElementById("cancelReason").classList.add("valid");
            $("#initiating-cancel-submit-button").attr("disabled", false);
        } else {
            document.getElementById("cancelReason").classList.remove("valid");
            document.getElementById("cancelReason").classList.add("invalid");
            $("#initiating-cancel-submit-button").attr("disabled", true);
        }
    }

}

// Session Timer
var sec = 0;
function pad(val) { return val > 9 ? val : "0" + val; }
setInterval(function () {
    $("#seconds").html(pad(++sec % 60));
    $("#minutes").html(pad(parseInt(sec / 60, 10)));
}, 1000);

// Click button to refresh the submitters div
var refreshid = document.getElementById("refresh_surveyid");
var refreshval;

if (refreshid) {
    refreshval = document.getElementById("refresh_surveyid").value;
}

$(document).ready(function () {
    $("#submitters_refresh").click(function (evt) {
        $("#submitter_refresh_div").load("/users/surveys/initiating/view/" + refreshval + " #submitter_refresh_div");
        evt.preventDefault();
    });
});

// User Interface Style
var participant1 = document.getElementById("par-serialNum1");
var submitter1 = document.getElementById("submit-serialNum1");

if (participant1) {
    participant1.setAttribute("style", "margin-right: 2px;");
}

if (submitter1) {
    submitter1.setAttribute("style", "margin-right: 2px;");
}

