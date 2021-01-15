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
var AllOptions = document.getElementById("voting_options");
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
        var computeButton = document.getElementById("initiatorSubmit");
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

// Reload submitters info for initiator
$(document).ready(function(){
    setInterval(function(){
          $("#submitters").load(window.location.href + " #submitters" );
    }, 3000);
    });

// Other participants vote
$('#others_vote').submit(function () {
    var inputs = [];
    var radios = $('input[type=radio]');
    var oneChecked = false;

    for (var i = 0; i < radios.length; i++) {
        inputs.push(radios[i].checked ? 1 : 0);
        oneChecked = oneChecked || radios[i].checked;
    }

    if (!oneChecked) {
        alert("Please choose an option");
        return false;
    }

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

    return false;

});

// Compute and write the results into database
$('#initiator_compute').submit(function () {
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
        var OpArr = (AllOptions.value).split(',');

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

    return false;

});