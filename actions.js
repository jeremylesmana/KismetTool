var actName = "";
var actParts = [];
var actTagCounter = 1;

var actToggle = false;
var actLocCounter = 0;

var actParamArray = [];
var actParamCounter = 0;

var actConditionArray = [];
var actConditionCounter = 0;

var indent = "   ";
function byId(id) { return document.getElementById(id); }

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
  actionName = byId("actionName").value;
  actionName = actionName.replace(" ", "-");
  actionLocation = byId("actionLocation").value;

  combinedActionTag = "";
  for (let i=1; i<= actTagCounter; i++){
    actionTagCurID = "actionTag" + i;
    actionTagCurrent = byId(actionTagCurID).value;
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
  locationSelect = byId("actLocDropdown");
  locationSelect.innerHTML = '';

      for (var i = 0; i < locations.length; i++) {
        optionElement = document.createElement("option");
        optionElement.value = locations[i];
        locationSelect.appendChild(optionElement);
      }
}
function updatePartList() {
  //Populate location select with location array elements
  participantSelect = byId("actPartDropdown");
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
  disableElement = byId(disabledID);
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
  byId("locationBoxes").appendChild(locationBox);
}

function remActLoc() {
  boxID = "actLocBox" + actLocCounter;
  locationBox = byId(boxID);
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
  let paramDropdown = byId("actParamDrop");

  let partName = byId("actParamAddPartName");
  let partSign = byId("actParamAddPartType");
  let partRole = byId("actParamAddPartRole");
  let locName = byId("actParamAddLoc");
  let eventName = byId("actParamAddEvent");

  if(paramDropdown.value == "1") {
    if(partName.value == "") 
      alert("You didn't enter anything for the participant name");
     else {
       newParameter = {
          "id": actParamCounter,
          "type": "part",
          "name": partName.value,
          "sign": partSign.value,
          "role": partRole.value
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
        "id": actParamCounter,
        "type": "location",
        "name": locName.value
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
        "id": actParamCounter,
        "type": "event",
        "name": eventName.value
      }
      actParamArray.push(newParameter);
      updateParameterList();
      eventName.value = "";
      actParamCounter++;
    } 
  }
}

function updateParameterList() {
  let paramListDiv = byId("actParameterList");
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
    sectionDiv = byId("actionTagDiv");
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
  sectionDiv = byId(tempSecDiv);
  sectionDiv.remove();

  actTagCounter--;
}

function actConditionBoxChange(input) {
	hideConditionBoxes();	//Hide all the boxes
	
	boxID = "actConditionBox" + input;
	currentBox = byId(boxID);
	$(currentBox).show();
}

function hideConditionBoxes() {
	for(var i = 0; i <= 8; i++){
		boxID = "actConditionBox" + i;
		currentBox = byId(boxID);
		$(currentBox).hide();
	}
}

function addCondition() {
  var condValue = byId("actCondSelect").value;

  switch(condValue) {
    case '0':
      alert("You didn't select a condition");
      break;

    case '1':
      actConditionCounter++;
      actConditionArray.push({
        "id": actConditionCounter,
        "type": 1,
        "part": byId("conditionBox1Part").value,
        "status": byId("conditionBox1Status").value,
        "comparator": byId("conditionBox1Comparator").value,
        "number": byId("conditionBox1Number").value
      });
      byId("conditionBox1Part").value = "";
      byId("conditionBox1Status").value = "";
      byId("conditionBox1Comparator").value = "=";
      byId("conditionBox1Number").value = "";
      break;

      case '2':
      actConditionCounter++;
      actConditionArray.push({
        "id": actConditionCounter,
        "type": 2,
        "part1": byId("conditionBox2Part1").value,
        "status1": byId("conditionBox2Status1").value,
        "comparator": byId("conditionBox2Comparator").value,
        "part2": byId("conditionBox2Part2").value,
        "status2": byId("conditionBox2Status2").value,
      });
      byId("conditionBox2Part1").value = "";
      byId("conditionBox2Status1").value = "";
      byId("conditionBox2Comparator").value = "";
      byId("conditionBox2Part2").value = "";
      byId("conditionBox2Status2").value = "";
      break;

      case '3':
      actConditionCounter++;
      actConditionArray.push({
        "id": actConditionCounter,
        "type": 3,
        "part": byId("conditionBox3Part").value,
        "knows": byId("conditionBox3Knows").value,
        "event": byId("conditionBox3Event").value,
      });
      byId("conditionBox3Part").value = "";
      byId("conditionBox3Knows").value = "knows";
      byId("conditionBox3Event").value = "";
      break;

      case '4':
      actConditionCounter++;
      actConditionArray.push({
        "id": actConditionCounter,
        "type": 4,
        "part": byId("conditionBox4Part").value,
        "isisnt": byId("conditionBox4IsIsnt").value,
        "status": byId("conditionBox4Status").value,
      });
      byId("conditionBox4Part").value = "";
      byId("conditionBox4IsIsnt").value = "is";
      byId("conditionBox4Status").value = "";
      break;

      case '5':
      actConditionCounter++;
      actConditionArray.push({
        "id": actConditionCounter,
        "type": 5,
        "part1": byId("conditionBox5Part1").value,
        "part2": byId("conditionBox5Part2").value,
        "dodont": byId("conditionBox5DoDont").value,
        "status": byId("conditionBox5Status").value,
      });
      byId("conditionBox5Part1").value = "";
      byId("conditionBox5Part2").value = "";
      byId("conditionBox5Status").value = "";
      byId("conditionBox5DoDont").value = "do";
      break;

      case '6':
      actConditionCounter++;
      actConditionArray.push({
        "id": actConditionCounter,
        "type": 6,
        "part1": byId("conditionBox6Part1").value,
        "isisnt": byId("conditionBox6IsIsnt").value,
        "status": byId("conditionBox6Status").value,
        "part2": byId("conditionBox6Part2").value,
      });
      byId("conditionBox6Part1").value = "";
      byId("conditionBox6IsIsnt").value = "is";
      byId("conditionBox6Status").value = "";
      byId("conditionBox6Part2").value = "";
      break;
      
      case '7':
      actConditionCounter++;
      actConditionArray.push({
        "id": actConditionCounter,
        "type": 7,
        "part1": byId("conditionBox7Part1").value,
        "status": byId("conditionBox7Status").value,
        "part2": byId("conditionBox7Part2").value,
        "comparator": byId("conditionBox7Comparator").value,
        "number": byId("conditionBox7Number").value,
      });
      byId("conditionBox7Part1").value = "";
      byId("conditionBox7Status").value = "";
      byId("conditionBox7Part2").value = "";
      byId("conditionBox7Comparator").value = "=";
      byId("conditionBox7Number").value = "";
      break;

      case '8':
      actConditionCounter++;
      actConditionArray.push({
        "id": actConditionCounter,
        "type": 8,
        "pattern": byId("conditionBox8Pattern").value,
        "parteventlocation": byId("conditionBox8PartEventLocation").value,
      });
      byId("conditionBox8Pattern").value = "";
      byId("conditionBox8PartEventLocation").value = "";
      break;

  }
  updateConditionList();
  
}

function updateConditionList() {
  let condListDiv = byId("actConditionList");
  condListDiv.innerHTML = "";
  for(var i = 0; i < actConditionArray.length; i++) {

    var condType = actConditionArray[i].type; //Setting condType to whatever that element's type is

    let newDiv = document.createElement("div"); //Make new element here to be implemented later
    newDiv.classList.add("ui", "raised","segment","left","aligned");
    tempHTML = "<button class='ui red icon button mini' onclick='removeCondition("+actConditionArray[i].id+")'>\
    <i class='minus icon'></i>\
  </button>";

    switch (condType) {
      case 1:
        tempHTML = tempHTML + "<span style='font-size:16px;'>\
        " +actConditionArray[i].part + "'s " + actConditionArray[i].status + " is " + actConditionArray[i].comparator + " " + actConditionArray[i].number + "</span>";
        break;
      case 2:
        tempHTML = tempHTML + "<span style='font-size:16px;'>\
        " +actConditionArray[i].part1 + "'s " + actConditionArray[i].status1 + " is " + actConditionArray[i].comparator + " " + actConditionArray[i].part2 + "'s " + actConditionArray[i].status2 + "</span>";
        break;
    }

    newDiv.innerHTML = tempHTML;
    condListDiv.appendChild(newDiv);
  }
}

function removeCondition(removeID) {
  for (var i = 0; i < actConditionArray.length; i++) {
    if (actConditionArray[i].id == removeID) {
      actConditionArray.splice(i, 1);
      updateConditionList();
    }
  }
}