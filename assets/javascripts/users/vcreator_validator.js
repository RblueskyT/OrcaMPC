document.getElementById("votingTitle").addEventListener("keyup", checkTitle);
document.getElementById("description").addEventListener("keyup", checkDes);
document.getElementById("partyCount").addEventListener("keyup", checkCount);
document.getElementById("opNum").addEventListener("keyup", checkNum);

// Status flags
var s1 = false;
var s2 = false;
var s3 = false;
var s4 = false;


// Check the voting title
function checkTitle() {
    var val = document.getElementById("votingTitle").value;

    if (!val || !val.length) {
        return;
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (val.length < 1 || val.length > 200) {
        document.getElementById("votingTitle").classList.remove("valid");
        document.getElementById("votingTitle").classList.add("invalid");
        s1 = false;
    } else {
        if (regex.test(val)) {
            document.getElementById("votingTitle").classList.remove("invalid");
            document.getElementById("votingTitle").classList.add("valid");
            s1 = true;
        } else {
            document.getElementById("votingTitle").classList.remove("valid");
            document.getElementById("votingTitle").classList.add("invalid");
            s1 = false;
        }
    }

    checkForm();
}

// Check the voting description
function checkDes() {
    var val = document.getElementById("description").value;

    if (!val || !val.length) {
        return;
    }

    if (val.length < 50) {
        document.getElementById("description").classList.remove("valid");
        document.getElementById("description").classList.add("invalid");
        s2 = false;
    } else {
        document.getElementById("description").classList.remove("invalid");
        document.getElementById("description").classList.add("valid");
        s2 = true;
    }

    checkForm();
}

// Check the number of parties
function checkCount() {
    var val = document.getElementById("partyCount").value;

    if (!val || !val.length) {
        return;
    }

    var regex = /^[5][0]$|^[1-4][0-9]$|^[2-9]$/;
    if (regex.test(val)) {
        document.getElementById("partyCount").classList.remove("invalid");
        document.getElementById("partyCount").classList.add("valid");
        s3 = true;
    } else {
        document.getElementById("partyCount").classList.remove("valid");
        document.getElementById("partyCount").classList.add("invalid");
        s3 = false;
    }

    checkForm();
}

// Check the number of options
function checkNum() {
    var val = document.getElementById("opNum").value;
    var btn = document.getElementById("addOps");

    if (!val || !val.length) {
        return;
    }

    var regex = /^[1][0]$|^[2-9]$/;
    if (regex.test(val)) {
        document.getElementById("opNum").classList.remove("invalid");
        document.getElementById("opNum").classList.add("valid");
        btn.className = "btn waves-effect waves-light blue lighten-1";
        s4 = true;
    } else {
        document.getElementById("opNum").classList.remove("valid");
        document.getElementById("opNum").classList.add("invalid");
        btn.className = "btn waves-effect waves-light blue lighten-1 disabled";
        s4 = false;
    }
    checkForm();

}

// Make sure that the "CREATE" button only active if some fields validated
function checkForm() {

    if (s1 && s2 && s3 && s4) {
        $("#submit").attr("disabled", false);
    } else {
        $("#submit").attr("disabled", true);
    }

}