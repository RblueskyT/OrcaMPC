var reopenreason = document.getElementById("reopenReason");
var checkpassword1 = document.getElementById("password_check1");
var deletereason = document.getElementById("deleteReason");
var checkpassword2 = document.getElementById("password_check2");
var participant1 = document.getElementById("par-serialNum1");
var deleteFlag1 = false;
var deleteFlag2 = false;

if (reopenreason && checkpassword1) {

    document.getElementById("reopenReason").addEventListener("keyup", checkReason1);
    document.getElementById("password_check1").addEventListener("keyup", checkPwd1);

}

if (deletereason && checkpassword2) {

    document.getElementById("deleteReason").addEventListener("keyup", checkReason2);
    document.getElementById("password_check2").addEventListener("keyup", checkPwd2);

}

if (participant1) {
    participant1.setAttribute("style", "margin-right: 2px;");
}

// Check if user enter the reason of reopening
function checkReason1() {
    var val = document.getElementById("reopenReason").value;

    if (!val || !val.length) {
        $("#expired-reopen-button").attr("disabled", true);
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 50 || val.length > 200) {
        document.getElementById("reopenReason").classList.remove("valid");
        document.getElementById("reopenReason").classList.add("invalid");
        $("#expired-reopen-button").attr("disabled", true);
    } else {
        if (regex.test(val)) {
            document.getElementById("reopenReason").classList.remove("invalid");
            document.getElementById("reopenReason").classList.add("valid");
            $("#expired-reopen-button").attr("disabled", false);
        } else {
            document.getElementById("reopenReason").classList.remove("valid");
            document.getElementById("reopenReason").classList.add("invalid");
            $("#expired-reopen-button").attr("disabled", true);
        }
    }

}

// Check if user enter the password - reopen
function checkPwd1() {
    var val = document.getElementById("password_check1").value;

    if (!val || !val.length) {
        $("#reopen-submit-button").attr("disabled", true);
    } else {
        $("#reopen-submit-button").attr("disabled", false);
    }

}

// Check if user enter the reason of deletion
function checkReason2() {
    var val = document.getElementById("deleteReason").value;

    if (!val || !val.length) {
        deleteFlag1 = false;
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 50 || val.length > 200) {
        document.getElementById("deleteReason").classList.remove("valid");
        document.getElementById("deleteReason").classList.add("invalid");
        deleteFlag1 = false;
    } else {
        if (regex.test(val)) {
            document.getElementById("deleteReason").classList.remove("invalid");
            document.getElementById("deleteReason").classList.add("valid");
            deleteFlag1 = true;
        } else {
            document.getElementById("deleteReason").classList.remove("valid");
            document.getElementById("deleteReason").classList.add("invalid");
            deleteFlag1 = false;
        }
    }

    checkDelete();

}

// Check if user enter the password - delete
function checkPwd2() {
    var val = document.getElementById("password_check2").value;

    if (!val || !val.length) {
        deleteFlag2 = false;
    } else {
        deleteFlag2 = true;
    }

    checkDelete();

}

// Control the submission button - delete
function checkDelete() {

    if (deleteFlag1 && deleteFlag2) {
        $("#expired-delete-submit-button").attr("disabled", false);
    } else {
        $("#expired-delete-submit-button").attr("disabled", true);
    }

}

// Show the voting result in charts
var votingresult = document.getElementById("voting_result");
var optionslen = document.getElementById("voting_optionslen");
if (votingresult && optionslen) {

    var resultArr = votingresult.value.split(',');
    var opLength = optionslen.value;
    var winner;
    var opArr = [];
    var resultData = [];
    var bgcolor1 = [];
    var bgcolor2 = [];
    var colorPool1 = [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(63, 191, 174, 0.5)',
        'rgba(165, 63, 191, 0.5)',
        'rgba(104, 191, 63, 0.5)',
        'rgba(191, 159, 63, 0.5)'
    ];
    var colorPool2 = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(63, 191, 174, 1)',
        'rgba(165, 63, 191, 1)',
        'rgba(104, 191, 63, 1)',
        'rgba(191, 159, 63, 1)'
    ];

    for (var i = 1; i <= opLength; i++) {

        var newoption = document.getElementById("voting_options" + i).value;
        opArr.push(newoption);

    }

    for (var i = 0; i < opLength; i++) {

        var newdata = parseInt(resultArr[i]);
        resultData.push(newdata);

        var newcolor1 = colorPool1[i];
        bgcolor1.push(newcolor1);

        var newcolor2 = colorPool2[i];
        bgcolor2.push(newcolor2);

    }

    winner = votingresult.value.substring(2 * opLength);
    winner.replace(/,(?=[^\s])/g, ", ");
    document.getElementById("most_voted").innerHTML = ('<i class="fas fa-trophy"></i> Most Voted Option(s): ' + winner);

    var ctx = document.getElementById('votingChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: opArr,
            datasets: [{
                label: ' Number of Vote(s)',
                data: resultData,
                backgroundColor: bgcolor1,
                borderColor: bgcolor2,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) { if (value % 1 === 0) { return value; } }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Vote(s)'
                    }
                }]
            }
        }
    });
}
