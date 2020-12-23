// Materialize Select
$(document).ready(function () {
    $('select').formSelect();
});

// Materialize Character Counter
$(document).ready(function() {
    $('input#password, input#password_check').characterCounter();
});

// Materialize Datepicker
var currYear = (new Date()).getFullYear();
$(document).ready(function(){
    $('.datepicker').datepicker({
        defaultDate: new Date(currYear-10,1,31),
        maxDate: new Date(currYear-10,12,31),
        yearRange: [1950, currYear-10],
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