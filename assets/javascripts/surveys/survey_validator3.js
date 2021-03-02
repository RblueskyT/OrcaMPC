// Show the survey results in charts
var surveyResults = document.getElementById("survey_result");
var resultData = [];
var radioQ = document.getElementById("radioQNum");
var checkboxQ = document.getElementById("checkboxQNum");
var inputQ = document.getElementById("inputQNum");
var colorPool1 = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(63, 191, 174, 0.2)',
    'rgba(165, 63, 191, 0.2)',
    'rgba(104, 191, 63, 0.2)',
    'rgba(191, 159, 63, 0.2)'
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

if (surveyResults) {
    var resultArr = surveyResults.value.split(',');

    for (var i = 0; i < resultArr.length; i++) {

        var newdata = parseInt(resultArr[i]);
        resultData.push(newdata);

    }

    if (radioQ) {

        var radioR = [];

        for (var i = 0; i < parseInt(document.getElementById("radioQNum").value); i++) {

            var newName = "radioQOpNum" + i;
            radioR.push(newName);

        }

        radioR.forEach(drawChart1);

    }

    if (checkboxQ) {

        var checkboxR = [];

        for (var i = 0; i < parseInt(document.getElementById("checkboxQNum").value); i++) {

            var newName = "checkboxQOpNum" + i;
            checkboxR.push(newName);

        }

        checkboxR.forEach(drawChart2);

    }

    if (inputQ) {

        var inputR = [];

        for (var i = 0; i < parseInt(document.getElementById("inputQNum").value); i++) {

            var newName = "inputQdiv" + i;
            inputR.push(newName);

        }

        inputR.forEach(drawChart3);

    }

}

function drawChart1(item, index) {

    var Oplength = parseInt(document.getElementById(item).value);
    var OpArr = [];
    var Newdata = [];
    var color1 = [];
    var startPoint = 0;

    if (index == 0) {

        for (var i = 0; i < Oplength; i++) {

            Newdata.push(resultData[i]);

        }

    } else {

        for (var i = 0; i < index; i++) {

            startPoint = startPoint + parseInt(document.getElementById("radioQOpNum" + i).value);

        }

        for (var i = 0; i < Oplength; i++) {

            Newdata.push(resultData[startPoint + i]);

        }

    }

    for (var i = 0; i < Oplength; i++) {

        var newoption = document.getElementById(item + i).value;
        OpArr.push(newoption);

        var newcolor1 = colorPool2[i];
        color1.push(newcolor1);

    }

    var ctx = document.getElementById('radioChart' + index);
    var myChart1 = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: OpArr,
            datasets: [{
                label: 'Single-Select Question ' + index,
                data: Newdata,
                backgroundColor: color1
            }]
        }
    });

}

function drawChart2(item, index) {

    var Oplength = parseInt(document.getElementById(item).value);
    var OpArr = [];
    var Newdata = [];
    var color1 = [];
    var startPoint = 0;

    if (radioQ) {

        for (var i = 0; i < parseInt(document.getElementById("radioQNum").value); i++) {

            startPoint = startPoint + parseInt(document.getElementById("radioQOpNum" + i).value);

        }

    }

    if (index == 0) {

        for (var i = 0; i < Oplength; i++) {

            Newdata.push(resultData[startPoint + i]);

        }

    } else {

        for (var i = 0; i < index; i++) {

            startPoint = startPoint + parseInt(document.getElementById("checkboxQOpNum" + i).value);

        }

        for (var i = 0; i < Oplength; i++) {

            Newdata.push(resultData[startPoint + i]);

        }

    }

    for (var i = 0; i < Oplength; i++) {

        var newoption = document.getElementById(item + i).value;
        OpArr.push(newoption);

        var newcolor1 = colorPool2[i];
        color1.push(newcolor1);

    }

    var ctx = document.getElementById('checkboxChart' + index);
    var myChart2 = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: OpArr,
            datasets: [{
                label: 'Multi-Select Question ' + index,
                data: Newdata,
                backgroundColor: color1
            }]
        }
    });

}

function drawChart3(item, index) {

    var Newdata = [];
    var color1 = [];
    var color2 = [];
    var startPoint = 0;

    if (radioQ) {

        for (var i = 0; i < parseInt(document.getElementById("radioQNum").value); i++) {

            startPoint = startPoint + parseInt(document.getElementById("radioQOpNum" + i).value);

        }

    }

    if (checkboxQ) {

        for (var i = 0; i < parseInt(document.getElementById("checkboxQNum").value); i++) {

            startPoint = startPoint + parseInt(document.getElementById("checkboxQOpNum" + i).value);

        }

    }

    if (index == 0) {

        Newdata.push(resultData[startPoint]);
        var avg = resultData[startPoint] / parseInt(document.getElementById("participantsNum").value);
        Newdata.push(avg);


    } else {

        Newdata.push(resultData[startPoint + index]);
        var avg = resultData[startPoint + index] / parseInt(document.getElementById("participantsNum").value);
        Newdata.push(avg);

    }

    color1.push(colorPool2[5]);
    color1.push(colorPool2[6]);
    color2.push(colorPool1[5]);
    color2.push(colorPool1[6]);

    var ctx = document.getElementById('inputChart' + index);
    var myChart3 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sum', 'Average'],
            datasets: [{
                label: 'Fill In the Blank Question ' + (index + 1),
                data: Newdata,
                backgroundColor: color1,
                borderColor: color2,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) { if (value % 1 === 0) { return value; } }
                    }
                }]
            }
        }
    });

}

// Check delete and reopen
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