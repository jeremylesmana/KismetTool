var currentKismet ="";

//location variables

var locName = "";
var locSupport = "";
var locType = "";
var locInit = "";
var locEachTurn = "";

var locToggle = false;

//action variables

var actName = "";
var actPart = new Array();

var actToggle = false;

$(document).ready(function() {
    $("#locationDiv").hide();
    $("#actionDiv").hide();
});

//Reset functions
function resetAll() {
  currentKismet = "";
  locName = "";
  locSupport = "";
  locType = "";
  locInit = "";
  locEachTurn = "";

  actName = "";
  actPart = new Array();
  updateKismet();
}

function hideAll() {
  locToggle = false;
  actToggle = false;
  $("#locationDiv").hide();
  $("#actionDiv").hide();
}

//Toggle functions
function toggleLocation() {
  if (!locToggle) {
    hideAll();
    $("#locationDiv").show();
    locToggle = true;
  }
  else {
    $("#locationDiv").hide();
    locToggle = false;
  }
}

function toggleAction() {
  if (!actToggle) {
    hideAll();
    $("#actionDiv").show();
    actToggle = true;
  }
  else {
    $("#actionDiv").hide();
    actToggle = false;
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
