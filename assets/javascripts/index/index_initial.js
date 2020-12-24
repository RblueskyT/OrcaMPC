// Materialize Select
$(document).ready(function () {
    $('select').formSelect();
});

// Materialize Character Counter
$(document).ready(function () {
    $('input#password, input#password_check').characterCounter();
});

// Materialize Datepicker
var currYear = (new Date()).getFullYear();
$(document).ready(function () {
    $('.datepicker').datepicker({
        defaultDate: new Date(currYear - 10, 1, 31),
        maxDate: new Date(currYear - 10, 12, 31),
        yearRange: [1950, currYear - 10],
        format: "yyyy/mm/dd"
    });
});

// Materialize side navBar and index style
(function ($) {
    $(function () {

        $('.sidenav').sidenav();
        $('.parallax').parallax();

    });
})(jQuery);

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

for (j = 0; j < close2.length; i++) {
    close2[i].onclick = function () {
        var div = this.parentElement;
        div.style.opacity = "0";
        setTimeout(function () { div.style.display = "none"; }, 600);
    }
}