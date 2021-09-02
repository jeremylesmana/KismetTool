var currentKismet ="";

//location variables

var locName = "";
var locSupport = "";
var locType = "";
var locInit = "";
var locEachTurn = "";
var locToggle = false;

$(document).ready(function() {
    $("#location").hide();
});

function showLocation() {
  if (!locToggle) {
    $("#location").show();
    locToggle = 1;

  }
  else {
    $("#location").hide();
    locToggle = 0;
  }
}

function locTypeFunc() {
  locType = document.getElementById("locType").value;
  console.log(locType);
  currentKismet = "location " + locType + ":";
  updateKismet();
}

function updateKismet() {
  document.getElementById("kismetCode").innerHTML = currentKismet;
}
