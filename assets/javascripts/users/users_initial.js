// Materialize side navBar style
$(document).ready(function(){
    $('.sidenav').sidenav();
  });

// Materialize Character Counter
$(document).ready(function () {
  $('input#votingTitle, textarea#description').characterCounter();
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
$(document).ready(function(){
  $('.timepicker').timepicker();
});

// Options handler for the voting creator
function addOps(){
  var opNum = document.getElementById("opNum").value;
  var container = document.getElementById("container");

  while (container.hasChildNodes()){
      container.removeChild(container.lastChild);
  }

  for(i = 0; i< opNum; i++){
      var input = document.createElement("input");
      var newlabel = document.createElement("label");
      var newspan = document.createElement("span");

      input.placeholder = "Enter your option here ...";
      input.type = "text";
      input.id = ("option " + (i+1));
      input.name = "options";
      input.onblur = "checkOps()";
      input.onfocus = "checkOps()";
      input.onchange = "checkOps()";
      input.className = "validate";
      input.required = true;

      newlabel.setAttribute("for", "options");
      newlabel.innerHTML = ("Option " + (i+1));

      newspan.className = "helper-text";
      newspan.setAttribute("data-error", "Please fill in this field");
      newspan.setAttribute("data-success", "Input completed");

      container.appendChild(newlabel);
      container.appendChild(input);
      container.appendChild(newspan);
      container.appendChild(document.createElement("br"));
  }

};

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