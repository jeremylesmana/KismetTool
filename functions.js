$(document).ready(function() {
    $("#locationDiv").hide();
    $("#actionDiv").hide();
});

//Reset functions
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

//Location functions
function locTypeFunc() {
  locType = document.getElementById("locType").value;
  console.log(locType);
  currentKismet = "location " + locType + ":";
  updateKismet();
}

function updateKismet() {
  document.getElementById("kismetCode").innerHTML = currentKismet;
}
