var actName = "";
var actParts = new Array();
var actPartCounter = 1;
var actTagCounter = 1;
var actCondCounter = 1;

var actToggle = false;
var actLocCounter = 0;
// + actLocCounter +

$(document).ready(function(){

  updateLocList();
});

function actionSubmit() {
  actionName = document.getElementById("actionName").value;
  actionName = actionName.replace(" ", "-");
  actionLocation = document.getElementById("actionLocation").value;

  combinedActionTag = "";
  for (let i=1; i<= actTagCounter; i++){
    actionTagCurID = "actionTag" + i;
    actionTagCurrent = document.getElementById(actionTagCurID).value;
    combinedActionTag = combinedActionTag + actionTagCurrent + ",";
  }
  combinedActionTag = combinedActionTag.slice(0,-1);

  currentKismet = "action " + actionName + ":<br> \
    &nbsp;&nbsp;&nbsp;location: (" + actionLocation + ");<br> \
    &nbsp;&nbsp;&nbsp;tags: " + combinedActionTag + ";<br> \
    &nbsp;&nbsp;&nbsp;if: ";
  updateKismet();
}

function updateLocList() {
  //Populate location select with location array elements
  locationSelect = document.getElementById("actLocDropdown");
      while (locationSelect.firstChild) {
          locationSelect.removeChild(locationSelect.firstChild);
      }

      for (var i = 0; i < locations.length; i++) {
        optionElement = document.createElement("option");
        optionElement.value = locations[i];
        locationSelect.appendChild(optionElement);
      }
}

function locTypeField(x) {
  if (x != "" && locations.indexOf(x) == -1) {
    r = confirm("Would you want to add new location " + x + " to your list of locations?");
    if (r==true) {
      locations.push(x);
      updateLocList();
    }
  }
}

function tempLocationDel() {
  loc = prompt("Enter location to delete:");
  if (loc == null || loc == "") {
    alert("Please enter a valid location");
  }
  else if (locations.indexOf(loc) == -1) {
    alert("This location doesn't exists");
  }
  else {
    index = locations.indexOf(loc);
    locations.splice(index, 1);
    updateLocList()
  }
}

function wildCheck(x) {

}

function addActLoc () {
  actLocCounter++;
  locationBox = document.createElement("div");
  locationBox.classList.add("ui", "raised", "segment", "left", "aligned");
  boxID = "actLocBox" + actLocCounter;
  locationBox.id = boxID;

  locationBox.innerHTML = "Location type:\
  <div class='ui input focus'>\
    <input type='text' placeholder='Location...'' id='actLocType" + actLocCounter + " list='actLocDropdown' onfocusout='locTypeField(this.value)'>\
  </div><br><br>\
  <div id='result'></div>\
  <div class='ui toggle checkbox'>\
    <input type='checkbox' name='public' onchange='wildCheck(loc" + actLocCounter + ")'>\
    <label>Wildcard</label>\
  </div>";
  document.getElementById("locationBoxes").appendChild(locationBox);
}

function remActLoc() {
  boxID = "actLocBox" + actLocCounter;
  locationBox = document.getElementById(boxID);
  locationBox.remove();

  if(actLocCounter > 0) {
    actLocCounter--;
  }
}