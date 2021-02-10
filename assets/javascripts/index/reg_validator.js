var input1 = document.getElementById("firstName");
var input2 = document.getElementById("lastName");
var input3 = document.getElementById("career");
var input4 = document.getElementById("email");
var input5 = document.getElementById("password");
var input6 = document.getElementById("password_check");

if (input1 && input2 && input3 && input4 && input5 && input6) {
    document.getElementById("firstName").addEventListener("keyup", checkFirst);
    document.getElementById("lastName").addEventListener("keyup", checkLast);
    document.getElementById("career").addEventListener("keyup", checkCareer);
    document.getElementById("email").addEventListener("keyup", checkEmail);
    document.getElementById("password").addEventListener("keyup", checkPassword);
    document.getElementById("password_check").addEventListener("keyup", checkRepeat);
}

// Status flags
var s1 = false;
var s2 = false;
var s3 = true; // The field of career is not required
var s4 = false;
var s5 = false;
var s6 = false;


// Check the first name
function checkFirst() {
    var val = document.getElementById("firstName").value;

    if (!val || !val.length) {
        s1 = false;
        $("#submit").attr("disabled", true);
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

// Check the last name
function checkLast() {
    var val = document.getElementById("lastName").value;

    if (!val || !val.length) {
        s2 = false;
        $("#submit").attr("disabled", true);
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

// Check the career
function checkCareer() {
    var val = document.getElementById("career").value;

    if (!val || !val.length) {
        s3 = true;
    } else {
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
    }

    checkForm();
}

// Check the email
function checkEmail() {
    var val = document.getElementById("email").value;

    if (!val || !val.length) {
        s4 = false;
        $("#submit").attr("disabled", true);
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

// Check the password
function checkPassword() {
    var val = document.getElementById("password").value;

    if (!val || !val.length) {
        s5 = false;
        $("#submit").attr("disabled", true);
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

// Check the repeated password
function checkRepeat() {
    var val1 = document.getElementById("password").value;
    var val2 = document.getElementById("password_check").value;

    if (!val2 || !val2.length) {
        s6 = false;
        $("#submit").attr("disabled", true);
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

// Make sure that the "SIGN UP" button only active if all fields validated
function checkForm() {

    if (s1 && s2 && s3 && s4 && s5 && s6) {
        $("#submit").attr("disabled", false);
    } else {
        $("#submit").attr("disabled", true);
    }

}