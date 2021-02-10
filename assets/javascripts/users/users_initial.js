// Materialize side navBar style
$(document).ready(function () {
  $('.sidenav').sidenav();
});

// Materialize Character Counter
$(document).ready(function () {
  $('input#votingTitle, input[name = "password"], input#votingToken, input#userNotice, textarea#cancelReason, textarea#description').characterCounter();
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