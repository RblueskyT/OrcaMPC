document.getElementById("firstName").addEventListener("keyup", checkFirst);
document.getElementById("lastName").addEventListener("keyup", checkLast);
document.getElementById("career").addEventListener("keyup", checkCareer);
document.getElementById("email").addEventListener("keyup", checkEmail);
document.getElementById("password").addEventListener("keyup", checkPassword);
document.getElementById("password_check").addEventListener("keyup", checkRepeat);

var s1 = false;
var s2 = false;
var s3 = true;
var s4 = false;
var s5 = false;
var s6 = false;

function checkFirst() {
    var val = document.getElementById("firstName").value;

    if (!val || !val.length) {
        return;
    }

    var regex = /^[0-9a-zA-Z]+$/;
    if (regex.test(val)) {
        document.getElementById("firstName").classList.remove("invalid");
        document.getElementById("firstName").classList.add("valid");
        s1 = true;
    } else {
        document.getElementById("firstName").classList.remove("valid");
        document.getElementById("firstName").classList.add("invalid");
        s1 = false;
    }
    checkForm();
}


function checkLast() {
    var val = document.getElementById("lastName").value;

    if (!val || !val.length) {
        return;
    }

    var regex = /^[0-9a-zA-Z]+$/;
    if (regex.test(val)) {
        document.getElementById("lastName").classList.remove("invalid");
        document.getElementById("lastName").classList.add("valid");
        s2 = true;
    } else {
        document.getElementById("lastName").classList.remove("valid");
        document.getElementById("lastName").classList.add("invalid");
        s2 = false;
    }
    checkForm();
}

function checkCareer() {
    var val = document.getElementById("career").value;

    if (!val || !val.length) {
        return;
    }

    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (regex.test(val)) {
        document.getElementById("career").classList.remove("invalid");
        document.getElementById("career").classList.add("valid");
        s3 = true;
    } else {
        document.getElementById("career").classList.remove("valid");
        document.getElementById("career").classList.add("invalid");
        s3 = false;
    }
    checkForm();
}

function checkEmail() {
    var val = document.getElementById("email").value;

    if (!val || !val.length) {
        return;
    }

    var regex = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/;
    if (regex.test(val)) {
        document.getElementById("email").classList.remove("invalid");
        document.getElementById("email").classList.add("valid");
        s4 = true;
    } else {
        document.getElementById("email").classList.remove("valid");
        document.getElementById("email").classList.add("invalid");
        s4 = false;
    }
    checkForm();
}

function checkPassword() {
    var val = document.getElementById("password").value;

    if (!val || !val.length) {
        return;
    }

    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/;
    if (regex.test(val)) {
        document.getElementById("password").classList.remove("invalid");
        document.getElementById("password").classList.add("valid");
        s5 = true;
    } else {
        document.getElementById("password").classList.remove("valid");
        document.getElementById("password").classList.add("invalid");
        s5 = false;
    }
    checkForm();
}

function checkRepeat() {
    var val1 = document.getElementById("password").value;
    var val2 = document.getElementById("password_check").value;

    if (!val2 || !val2.length) {
        return;
    }
    if (val2 === val1) {
        document.getElementById("password_check").classList.remove("invalid");
        document.getElementById("password_check").classList.add("valid");
        s6 = true;
    } else {
        document.getElementById("password_check").classList.remove("valid");
        document.getElementById("password_check").classList.add("invalid");
        s6 = false;
    }
    checkForm();
}

function checkForm() {
    var val1 = document.getElementById("firstName").value;
    var val2 = document.getElementById("lastName").value;
    var val3 = document.getElementById("career").value;
    var val4 = document.getElementById("email").value;
    var val5 = document.getElementById("password").value;
    var val6 = document.getElementById("password_check").value;

    if (!s1 || !s2 || !s3 || !s4 || !s5 || !s6) {
        $("#submit").attr("disabled", true);
    } else {
        $("#submit").attr("disabled", false);
    }
}