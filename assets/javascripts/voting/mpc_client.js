// Initialize mpc session
var cid = document.getElementById("voting_id");
var userID = document.getElementById("voting_user_id");
var partiesNum = document.getElementById("voting_partycount");
var parties = document.getElementById("voting_people");
var myID = document.getElementById("my_party_id");
var secretkey_string = document.getElementById("secret_key");
var publickey_string = document.getElementById("public_key");
var jiffClient;
var optionsLength = $('input[type=radio]').length;
var finalResults = [];

// Automatically connect to jiff client - Only for initiator
if (userID && partiesNum && parties) {
    var partiesArr = (parties.value).split(',');
    var myPartyID;

    for (var i = 0; i < partiesArr.length; i++) {
        if (userID.value == partiesArr[i]) {
            myPartyID = i + 1;
        }
    }

    myID.setAttribute("value", myPartyID);


    if (cid && secretkey_string && publickey_string) {

        var computationid = cid.value;
        var partyid = parseInt(myID.value);
        var partycount = parseInt(partiesNum.value) + 1;

        if (partyid == 1) {
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

}

// handle user inputs - Initiator
function confirmChoice() {
    var inputs = [];
    var radios = $('input[type=radio]');
    var oneChecked = false;

    for (var i = 0; i < radios.length; i++) {
        inputs.push(radios[i].checked ? 1 : 0);
        oneChecked = oneChecked || radios[i].checked;
    }

    if (!oneChecked) {
        alert("Please choose an option");
    } else {
        var confirmButton = document.getElementById("confirmButton");
        confirmButton.setAttribute("disabled", true);
        var computeButton = document.getElementById("initiating-finish-button");
        computeButton.removeAttribute("disabled");

        var checkID = parseInt(myID.value);
        if (checkID == 1) {
            var newPartyCount = parseInt(partiesNum.value) + 1;
            var newJiffClient = new JIFFClient('http://localhost:8080', cid.value, { party_id: 2, party_count: newPartyCount });

            newJiffClient.wait_for([1], function () {
                newJiffClient.share_array(inputs, optionsLength, 1, [1], [2]);
                newJiffClient.disconnect(true, true);
            });
        }

    }

}

// Check compute button
function checkSubmitters() {

    if ((document.getElementById("refresh_parnum").value - 1) == document.getElementById("refresh_submitnum").value) {
        var computeButton = document.getElementById("initiating-compute-submit");
        computeButton.removeAttribute("disabled");
    }
}

function otherUserSubmit() {

    var inputs = [];
    var radios = $('input[type=radio]');
    var oneChecked = false;

    for (var i = 0; i < radios.length; i++) {
        inputs.push(radios[i].checked ? 1 : 0);
        oneChecked = oneChecked || radios[i].checked;
    }

    if (!oneChecked) {

        alert("Please choose an option");

    } else {

        var computationid = cid.value;
        var partyid = parseInt(myID.value);
        var partycount = parseInt(partiesNum.value) + 1;

        var options = {
            party_id: partyid + 1,
            party_count: partycount
        };

        jiffClient = new JIFFClient('http://localhost:8080', computationid, options);

        jiffClient.wait_for([1], function () {
            jiffClient.share_array(inputs, optionsLength, 1, [1], [jiffClient.id]);
            jiffClient.disconnect(true, true);
        });

        document.getElementById("initiating-submit-button").setAttribute("disabled", true);
        document.getElementById("initiating-back-button").setAttribute("disabled", true);
        document.getElementById("initiating-submit-button").innerHTML = ('<strong>Please Wait</strong>');
        document.getElementById("loading_prompt").className = "progress";
        document.getElementById("loading_prompt").innerHTML = ('<div class="indeterminate blue lighten-1"></div>');

        setTimeout(function () {
            $('#others_vote').submit();
        }, 10000);

    }

}

function initiatorCompute() {

    var shares = {};
    for (var i = 2; i <= jiffClient.party_count; i++) {
        shares[i] = jiffClient.share_array(null, optionsLength, 1, [1], [i])[i];
    }

    var results = shares[2];
    for (var j = 3; j <= jiffClient.party_count; j++) {
        for (var i = 0; i < shares[j].length; i++) {
            results[i] = results[i].sadd(shares[j][i]);
        }
    }

    jiffClient.open_array(results, [1]).then(function (results) {
        console.log("Original Results: ");
        console.log(results);

        var maxVote = 0;
        var maxIndex = [];
        var OpArr = [];

        for (var i = 1; i <= optionsLength; i++) {
            var newoption = document.getElementById("voting_options" + i).value;
            OpArr.push(newoption);
        }

        finalResults = results;
        console.log(finalResults);
        console.log(OpArr);

        for (var i = 0; i < results.length; i++) {
            if (results[i] > maxVote) {
                maxVote = results[i];
            }
        }

        for (var i = 0; i < results.length; i++) {
            if (results[i] == maxVote) {
                maxIndex.push(i);
            }
        }

        for (var i = 0; i < maxIndex.length; i++) {
            finalResults.push(OpArr[maxIndex[i]]);
        }
        console.log("Results that will be written to database: ");
        console.log(finalResults);

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

var cancelReason = document.getElementById("cancelReason");

if(cancelReason){

    document.getElementById("cancelReason").addEventListener("keyup", checkReason);

}

// Check if user enter the reason of cancellation
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
var refreshid = document.getElementById("refresh_votingid");
var refreshval;

if (refreshid) {
    refreshval = document.getElementById("refresh_votingid").value;
}

$(document).ready(function () {
    $("#submitters_refresh").click(function (evt) {
        $("#submitter_refresh_div").load("/users/voting/initiating/view/" + refreshval + " #submitter_refresh_div");
        evt.preventDefault();
        console.log('yeah, refresh');
    });
});