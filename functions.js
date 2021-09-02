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
var actParts = new Array();
var actPartCounter = 1;
var actTagCounter = 1;

var actToggle = false;

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

//Action functions
function addActPart() {
  if(actPartCounter >= 0) {
    actPartCounter = actPartCounter + 1;
    actionPartDiv = document.getElementById("actionPartDiv");
    partForm = document.createElement("div");
    partForm.classList.add('ui');
    partForm.classList.add('input');
    partForm.classList.add('focus');
    partForm.id = "actionPart" + actPartCounter + "Form";
    partForm.innerHTML = '<input type="text" id="actionPart' + actPartCounter + '" placeholder="Participant ' + actPartCounter + '">';
    actionPartDiv.append(partForm);
  }
}

function addFields(fieldType) {
  var sectionDiv;
  //Switch for the counter to add to counter
  switch(fieldType) {
    //Adding action part
    case "actPart":
      if(actPartCounter >= 0) {
        actPartCounter = actPartCounter + 1;
        sectionDiv = document.getElementById("actionPartDiv");
      }
      break;

    //Adding
    case "actTag":
      if(actTagCounter >= 0) {
        actTagCounter = actTagCounter + 1;
        sectionDiv = document.getElementById("actionTagDiv");
      }
      break;
  }

  //Starting to make the div for the form / input elements
  partForm = document.createElement("div");
  partForm.classList.add('ui');
  partForm.classList.add('input');
  partForm.classList.add('focus');

  //Switch for adding the forms
  switch(fieldType) {
    case "actPart":
      partForm.id = "actionPart" + actPartCounter + "Form";
      partForm.innerHTML = '<input type="text" id="actionPart' + actPartCounter + '" placeholder="Participant ' + actPartCounter + '">';
      break;

    case "actTag":
      partForm.id = "actionTag" + actTagCounter + "Form";
      partForm.innerHTML = '<input type="text" id="actionTag' + actTagCounter + '" placeholder="Tag ' + actTagCounter + '">';
      break;
  }
  //Finally append it
  sectionDiv.append(partForm);
}

function removeFields(fieldType) {
  var sectionDiv;
  var tempSecDiv;

  switch(fieldType) {
    case "actPart":
      if (actPartCounter >= 0)
        tempSecDiv = "actionPart" + actPartCounter + "Form";
      break;
    case "actTag":
      if (actTagCounter >= 0)
        tempSecDiv = "actionTag" + actTagCounter + "Form";
      break;
  }
  sectionDiv = document.getElementById(tempSecDiv);
  sectionDiv.remove();

  switch(fieldType) {
    case "actPart":
      actPartCounter = actPartCounter - 1;
      break;
    case "actTag":
      actTagCounter = actTagCounter - 1;
      break;
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
