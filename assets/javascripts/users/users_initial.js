// Materialize side navBar style
$(document).ready(function () {
  $('.sidenav').sidenav();
});

// Materialize Character Counter
$(document).ready(function () {
  $('input#votingTitle, input#surveyTitle, input[name = "questionName"], input[name = "password"], input#votingToken, input#surveyToken,  input#groupToken, input#userNotice, input#sessiontoken, textarea#cancelReason, textarea#deleteReason, textarea[name = "description"]').characterCounter();
});


// Materialize Select
$(document).ready(function () {
  $('select').formSelect();
});

// Materialize Datepicker
$(document).ready(function () {
  $('.datepicker').datepicker({
    minDate: new Date(),
    maxDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    format: "yyyy/mm/dd"
  });
});

// Materialize Datepicker 2
var currYear = (new Date()).getFullYear();
$(document).ready(function () {
  $('.birthday').datepicker({
    defaultDate: new Date(currYear - 10, 1, 31),
    maxDate: new Date(currYear - 10, 12, 31),
    yearRange: [1950, currYear - 10],
    format: "yyyy/mm/dd"
  });
});

// Materialize Timepicker
$(document).ready(function () {
  $('.timepicker').timepicker();
});

// Materialize Modals
$(document).ready(function () {
  $('.modal').modal({
    outDuration: 0,
    preventScrolling: false,
    dismissible: false
  });
});

// Materialize Tabs
$(document).ready(function () {
  $('.tabs').tabs({
    swipeable: true
  });
});

// Materialize Collapsible
$(document).ready(function () {
  $('.collapsible').collapsible();
});

// Materialize active sidenav link
$(document).ready(function () {
  var pagePath = window.location.href;
  $('#slide-out .user_sidenav .collapsible li a').each(function () {
    if (this.href === pagePath) {
      $(this).parent().addClass('active');
      $(this).parents('#level1').addClass('active');
      $(this).parents('#level2').addClass('active');
    }
  });
  $('.collapsible').collapsible();
});

// Materialze floating button
$(document).ready(function(){
  $('.fixed-action-btn').floatingActionButton();
});

// Materialize tooltips
$(document).ready(function(){
  $('.tooltipped').tooltip();
});

// Flash Message style
var close1 = document.getElementsByClassName("closebtn-s");
var close2 = document.getElementsByClassName("closebtn-e");

var i;
var j;

for (i = 0; i < close1.length; i++) {
  close1[i].onclick = function () {
    var div = this.parentElement;
    div.style.opacity = "0";
    setTimeout(function () { div.style.display = "none"; }, 600);
  }
}

for (j = 0; j < close2.length; j++) {
  close2[j].onclick = function () {
    var div = this.parentElement;
    div.style.opacity = "0";
    setTimeout(function () { div.style.display = "none"; }, 600);
  }
};

// Validate user profile
var career = document.getElementById("career");
var sintro = document.getElementById("Sdescription");
var k1 = true;
var k2 = true;

if (career && sintro) {
  document.getElementById("career").addEventListener("keyup", checkCareer);
  document.getElementById("Sdescription").addEventListener("keyup", checkSDes);
}

// Check the career
function checkCareer() {
  var val = document.getElementById("career").value;

  if (!val || !val.length) {
    k1 = false;
    document.getElementById("career").classList.remove("valid");
    document.getElementById("career").classList.add("invalid");
    $("#profile-update-button").attr("disabled", true);
  } else {
    var regex = /^[a-zA-Z0-9]+( [a-zA-Z0-9]+)*$/;
    if (regex.test(val)) {
      document.getElementById("career").classList.remove("invalid");
      document.getElementById("career").classList.add("valid");
      k1 = true;
    } else {
      document.getElementById("career").classList.remove("valid");
      document.getElementById("career").classList.add("invalid");
      k1 = false;
    }
  }

  checkProfile();
}

// Check the self-introduction
function checkSDes() {
  var val = document.getElementById("Sdescription").value;

  if (!val || !val.length) {
    k2 = false;
    $("#profile-update-button").attr("disabled", true);
  }

  if (val.length < 20) {
    document.getElementById("Sdescription").classList.remove("valid");
    document.getElementById("Sdescription").classList.add("invalid");
    k2 = false;
  } else {
    document.getElementById("Sdescription").classList.remove("invalid");
    document.getElementById("Sdescription").classList.add("valid");
    k2 = true;
  }

  checkProfile();
}

// Make sure that the button only active if some fields validated
function checkProfile() {

  if (k1 && k2) {
    $("#profile-update-button").attr("disabled", false);
  } else {
    $("#profile-update-button").attr("disabled", true);
  }

}

// Check file that user upload
function checkImage() {
  var val = document.getElementById("avatarpath").value;

  if (!val || !val.length) {
    $("#upload-submit-button").attr("disabled", true);
  } else {
    $("#upload-submit-button").attr("disabled", false);
  }

}




