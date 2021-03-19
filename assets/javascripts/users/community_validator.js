// Validate opreations related to groups
var ginput1 = document.getElementById("groupName");
var ginput2 = document.getElementById("gdescription");
var ginput3 = document.getElementById("groupToken");

if (ginput1 && ginput2 && ginput3) {

    document.getElementById("groupName").addEventListener("keyup", checkGname);
    document.getElementById("gdescription").addEventListener("keyup", checkGDes);
    document.getElementById("groupToken").addEventListener("keyup", checkGToken);

}

// Status flags - group creator
var a1 = false;
var a2 = false;
var a3 = false;
var a4 = true;
var a5 = true;
var a6 = true;

// Check the group name
function checkGname() {
    var val = document.getElementById("groupName").value;

    if (!val || !val.length) {
        a1 = false;
        $("#gcreate-button").attr("disabled", true);
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 1 || val.length > 200) {
        document.getElementById("groupName").classList.remove("valid");
        document.getElementById("groupName").classList.add("invalid");
        a1 = false;
        a4 = false;
    } else {
        if (regex.test(val)) {
            document.getElementById("groupName").classList.remove("invalid");
            document.getElementById("groupName").classList.add("valid");
            a1 = true;
            a4 = true;
        } else {
            document.getElementById("groupName").classList.remove("valid");
            document.getElementById("groupName").classList.add("invalid");
            a1 = false;
            a4 = false;
        }
    }

    checkGForm();
}

// Check the group description
function checkGDes() {
    var val = document.getElementById("gdescription").value;

    if (!val || !val.length) {
        a2 = false;
        a5 = false;
        $("#gcreate-button").attr("disabled", true);
    }

    if (val.length < 50) {
        document.getElementById("gdescription").classList.remove("valid");
        document.getElementById("gdescription").classList.add("invalid");
        a2 = false;
        a5 = false;
    } else {
        document.getElementById("gdescription").classList.remove("invalid");
        document.getElementById("gdescription").classList.add("valid");
        a2 = true;
        a5 = true;
    }

    checkGForm();
}

// Check the group token
function checkGToken() {
    var val = document.getElementById("groupToken").value;

    if (!val || !val.length) {
        a3 = false;
        $("#gcreate-button").attr("disabled", true);
    }

    if (val.length > 30) {
        document.getElementById("groupToken").classList.remove("valid");
        document.getElementById("groupToken").classList.add("invalid");
        a3 = false;
        a6 = false;
    } else {
        document.getElementById("groupToken").classList.remove("invalid");
        document.getElementById("groupToken").classList.add("valid");
        a3 = true;
        a6 = true;
    }

    checkGForm();
}

// Make sure that the button only active if some fields validated
function checkGForm() {

    if (a1 && a2 && a3) {
        $("#gcreate-button").attr("disabled", false);
    } else {
        $("#gcreate-button").attr("disabled", true);
    }

    if (a4 && a5 && a6) {
        $("#gupdate-button").attr("disabled", false);
    } else {
        $("#gupdate-button").attr("disabled", true);
    }

}

// Group Management
var member1 = document.getElementById("member-serialNum1");

if (member1) {
    member1.setAttribute("style", "margin-right: 1px;");
}

var memberNum = document.getElementById("gmemberNum");

if (memberNum) {

    for (var i = 2; i <= memberNum.value; i++) {
        $("#member-remove-button" + i).attr("disabled", false);
        document.getElementById("gpassword_check3" + i).addEventListener("keyup", checkGPwd);
    }
}

var passwordcheck = document.getElementById("gpassword_checkdisband");

if (passwordcheck) {
    document.getElementById("gpassword_checkdisband").addEventListener("keyup", checkGPwd);
}

function checkGPwd() {

    if (memberNum) {
        for (var i = 2; i <= memberNum.value; i++) {
            var val = document.getElementById("gpassword_check3" + i).value;
            if (!val || !val.length) {
                $("#mremove-submit-button" + i).attr("disabled", true);
            } else {
                $("#mremove-submit-button" + i).attr("disabled", false);
            }
        }
    }

    if (passwordcheck) {
        var val = document.getElementById("gpassword_checkdisband").value;
        if (!val || !val.length) {
            $("#disband-submit").attr("disabled", true);
            $("#leave-submit").attr("disabled", true);
        } else {
            $("#disband-submit").attr("disabled", false);
            $("#leave-submit").attr("disabled", false);
        }
    }

}

var postcontentv = document.getElementById("postcontentv");
var postcontents = document.getElementById("postcontents");

if (postcontentv) {
    document.getElementById("postcontentv").addEventListener("keyup", checkPost1);
}

if (postcontents) {
    document.getElementById("postcontents").addEventListener("keyup", checkPost2);
}

function checkPost1() {

    if (postcontentv) {
        var val = document.getElementById("postcontentv").value;
        if (!val || !val.length || val.length > 200) {
            document.getElementById("postcontentv").classList.remove("valid");
            document.getElementById("postcontentv").classList.add("invalid");
            $("#postv-submit").attr("disabled", true);
        } else {
            document.getElementById("postcontentv").classList.remove("invalid");
            document.getElementById("postcontentv").classList.add("valid");
            $("#postv-submit").attr("disabled", false);
        }
    }

}

function checkPost2() {

    if (postcontents) {
        var val = document.getElementById("postcontents").value;
        if (!val || !val.length || val.length > 200) {
            document.getElementById("postcontents").classList.remove("valid");
            document.getElementById("postcontents").classList.add("invalid");
            $("#posts-submit").attr("disabled", true);
        } else {
            document.getElementById("postcontents").classList.remove("invalid");
            document.getElementById("postcontents").classList.add("valid");
            $("#posts-submit").attr("disabled", false);
        }
    }

}

// Validate operations related to topics

var tinput1 = document.getElementById("topicName");
var tinput2 = document.getElementById("tdescription");

if (tinput1 && tinput2) {
    document.getElementById("topicName").addEventListener("keyup", checkTname);
    document.getElementById("tdescription").addEventListener("keyup", checkTDes);
} else if (!tinput1 && tinput2) {
    document.getElementById("tdescription").addEventListener("keyup", checkTDes);
}

// Status flags - topic creator
var b1 = false;
var b2 = false;
var b3 = true;

// Check the topic name
function checkTname() {
    var val = document.getElementById("topicName").value;

    if (!val || !val.length) {
        b1 = false;
        $("#tcreate-button").attr("disabled", true);
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 1 || val.length > 200) {
        document.getElementById("topicName").classList.remove("valid");
        document.getElementById("topicName").classList.add("invalid");
        b1 = false;
    } else {
        if (regex.test(val)) {
            document.getElementById("topicName").classList.remove("invalid");
            document.getElementById("topicName").classList.add("valid");
            b1 = true;
        } else {
            document.getElementById("topicName").classList.remove("valid");
            document.getElementById("topicName").classList.add("invalid");
            b1 = false;
        }
    }

    checkTForm();
}

// Check the topic description
function checkTDes() {
    var val = document.getElementById("tdescription").value;

    if (!val || !val.length) {
        b2 = false;
        b3 = false;
        $("#tcreate-button").attr("disabled", true);
    }

    if (val.length < 50) {
        document.getElementById("tdescription").classList.remove("valid");
        document.getElementById("tdescription").classList.add("invalid");
        b2 = false;
        b3 = false;
    } else {
        document.getElementById("tdescription").classList.remove("invalid");
        document.getElementById("tdescription").classList.add("valid");
        b2 = true;
        b3 = true;
    }

    checkTForm();
}

// Make sure that the button only active if some fields validated
function checkTForm() {

    if (b1 && b2) {
        $("#tcreate-button").attr("disabled", false);
    } else {
        $("#tcreate-button").attr("disabled", true);
    }

    if (b3) {
        $("#tupdate-button").attr("disabled", false);
    } else {
        $("#tupdate-button").attr("disabled", true);
    }

}
