var actName = "";
var actParts = new Array();
var actPartCounter = 1;
var actTagCounter = 1;
var actCondCounter = 1;

var actToggle = false;
var actLocCounter = 0;
// + actLocCounter +

var actParamArray = new Array();
var actParamCounter = 0;

$(document).ready(function(){

	//All the stuff that happens where when the document loads
	updateLocList();
	updatePartList();
	$("#actParamAddPartBox").hide();
	$("#actParamAddLocBox").hide();
	$("#actParamAddEventBox").hide();
	hideConditionBoxes();
	
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
  locationSelect.innerHTML = '';

      for (var i = 0; i < locations.length; i++) {
        optionElement = document.createElement("option");
        optionElement.value = locations[i];
        locationSelect.appendChild(optionElement);
      }
}
function updatePartList() {
  //Populate location select with location array elements
  participantSelect = document.getElementById("actPartDropdown");
  participantSelect.innerHTML = '';

      for (var i = 0; i < participants.length; i++) {
        optionElement = document.createElement("option");
        optionElement.value = participants[i];
        participantSelect.appendChild(optionElement);
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
  disabledID = "actLocType" + x;
  disableElement = document.getElementById(disabledID);
  if(!disableElement.disabled) {
    disableElement.disabled = true;
    disableElement.value = "";
    disableElement.placeholder = "Location disabled";
  } else {
    disableElement.disabled = false;
    disableElement.placeholder = "Location...";
  }
}

function addActLoc () {
  actLocCounter++;
  locationBox = document.createElement("div");
  locationBox.classList.add("ui", "raised", "segment", "left", "aligned");
  boxID = "actLocBox" + actLocCounter;
  locationBox.id = boxID;

  locationBox.innerHTML = "Location type:\
  <div class='ui input focus'>\
    <input type='text' placeholder='Location...'' id='actLocType" + actLocCounter + "' list='actLocDropdown' onfocusout='locTypeField(this.value)'>\
  </div><br><br>\
  <div class='ui toggle checkbox'>\
    <input type='checkbox' name='public' onchange='wildCheck(" + actLocCounter + ")'>\
    <label>Wildcard</label>\
  </div><br><br>\
  Location participant:\
  <div class='ui input focus'>\
    <input type='text' placeholder='Participant...'' id='actLocPart" + actLocCounter + "' list='actPartDropdown' onfocusout='locPartField(this.value)'>\
  </div><br><br>";
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

function actParamChange(x) {
  $("#actParamAddPartBox").hide();
  $("#actParamAddLocBox").hide();
  $("#actParamAddEventBox").hide();
  if(x=="1") {
    $("#actParamAddPartBox").show();
  }
  else if(x=="2") {
    $("#actParamAddLocBox").show();
  }
  else if(x=="3") {
    $("#actParamAddEventBox").show();
  }
  else {
    $("#actParamAddPartBox", "#actParamAddLocBox", "#actParamAddEventBox").hide();
  }
}

function addParam() {
  let paramDropdown = document.getElementById("actParamDrop");

  let partName = document.getElementById("actParamAddPartName");
  let partSign = document.getElementById("actParamAddPartType");
  let partRole = document.getElementById("actParamAddPartRole");
  let locName = document.getElementById("actParamAddLoc");
  let eventName = document.getElementById("actParamAddEvent");

  if(paramDropdown.value == "1") {
    if(partName.value == "") 
      alert("You didn't enter anything for the participant name");
     else {
       newParameter = {
          id: actParamCounter,
          type: "part",
          name: partName.value,
          sign: partSign.value,
          role: partRole.value
      }
       
       actParamArray.push(newParameter);
       updateParameterList();
       partName.value = "";
       partSign.value = "0";
       partRole.value = "";
       actParamCounter++;
     }
  }

  else if(paramDropdown.value == "2") {
    if(locName.value == "") {
      alert("You didn't enter anything for the location name");
    }
    else {
      newParameter = {
        id: actParamCounter,
        type: "location",
        name: locName.value
      }
      actParamArray.push(newParameter);
      updateParameterList();
      locName.value = "";
      actParamCounter++;
    } 
  }
  else if(paramDropdown.value == "3") {
    if(eventName.value == "")
      alert("You didn't enter anything for the event name");

    else {
      newParameter = {
        id: actParamCounter,
        type: "event",
        name: eventName.value
      }
      actParamArray.push(newParameter);
      updateParameterList();
      eventName.value = "";
      actParamCounter++;
    } 
  }
}

function updateParameterList() {
  let paramListDiv = document.getElementById("actParameterList");
  paramListDiv.innerHTML = "";
  //Clear existing list of tables already.

  for (var i = 0; i < actParamArray.length; i++) {

    if (actParamArray[i].type == "part") {
      let newDiv = document.createElement("div");
      newDiv.classList.add("ui", "raised","segment","left","aligned");
      newDiv.innerHTML = 
      "<button class='ui red icon button mini' onclick='removeParameter("+actParamArray[i].id+")'>\
        <i class='minus icon'></i>\
      </button>\
      <span style='font-size:20px'>\
      <b>Participant: &nbsp;&nbsp;&nbsp;Name:</b> " + actParamArray[i].name + 
      " <b>&nbsp;&nbsp;&nbsp;Sign:</b> " + actParamArray[i].sign + 
      " <b>&nbsp;&nbsp;&nbsp;Role:</b> " + actParamArray[i].role + 
      "</span>";
      paramListDiv.appendChild(newDiv);
    }
    else if (actParamArray[i].type == "location") {
      let newDiv = document.createElement("div");
      newDiv.classList.add("ui", "raised","segment","left","aligned");
      newDiv.innerHTML = 
      "<button class='ui red icon button mini' onclick='removeParameter("+actParamArray[i].id+")'>\
        <i class='minus icon'></i>\
      </button>\
      <span style='font-size:20px'>\
      <b>Location: &nbsp;&nbsp;&nbsp;Name:</b> " + actParamArray[i].name + 
      "</span>";
      paramListDiv.appendChild(newDiv);
    }
    else if (actParamArray[i].type == "event") {
      let newDiv = document.createElement("div");
      newDiv.classList.add("ui", "raised","segment","left","aligned");
      newDiv.innerHTML = 
      "<button class='ui red icon button mini' onclick='removeParameter("+actParamArray[i].id+")'>\
        <i class='minus icon'></i>\
      </button>\
      <span style='font-size:20px'>\
      <b>Event: &nbsp;&nbsp;&nbsp;Name:</b> " + actParamArray[i].name + 
      "</span>";
      paramListDiv.appendChild(newDiv);
    }
  }
}

function removeParameter(removeID) {
  for (var i = 0; i < actParamArray.length; i++) {
    if (actParamArray[i].id == removeID) {
      actParamArray.splice(i, 1);
      updateParameterList();
    }
  }
}

function addActTag() {
  var sectionDiv;
  if(actTagCounter >= 0) {
    actTagCounter = actTagCounter + 1;
    sectionDiv = document.getElementById("actionTagDiv");
  }
  partForm = document.createElement("div");
  partForm.classList.add('ui', 'input','focus');
  partForm.id = "actionTag" + actTagCounter + "Form";
  partForm.innerHTML = '<input type="text" id="actionTag' + actTagCounter + '" placeholder="Tag ' + actTagCounter + '">';
  sectionDiv.append(partForm);
}

function removeActTag() {
  var sectionDiv;
  var tempSecDiv;
  if (actTagCounter >= 0)
        tempSecDiv = "actionTag" + actTagCounter + "Form";
  sectionDiv = document.getElementById(tempSecDiv);
  sectionDiv.remove();

  actTagCounter--;
}

function actConditionBoxChange(input) {
	hideConditionBoxes();	//Hide all the boxes
	
	boxID = "actConditionBox" + input;
	currentBox = document.getElementById(boxID);
	$(currentBox).show();
}

function hideConditionBoxes() {
	for(var i = 0; i <= 8; i++){
		boxID = "actConditionBox" + i;
		currentBox = document.getElementById(boxID);
		$(currentBox).hide();
	}
}