var actName = "";
var actParts = [];
var actTagCounter = 1;

var actToggle = false;
var actLocCounter = 0;

var actParamArray = [];
var actParamCounter = 0;

var actConditionArray = [];
var actConditionCounter = 0;

var actResultArray = [];
var actResultCounter = 0;

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
	hideResultBoxes();
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

      for (let i = 0; i < locations.length; i++) {
        optionElement = document.createElement("option");
        optionElement.value = locations[i];
        locationSelect.appendChild(optionElement);
      }
}
function updatePartList() {
  //Populate location select with location array elements
  participantSelect = byId("actPartDropdown");
  participantSelect.innerHTML = '';

      for (let i = 0; i < participants.length; i++) {
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

function addActLoc() {
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

  for (let i = 0; i < actParamArray.length; i++) {

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
  for (let i = 0; i < actParamArray.length; i++) {
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
	for(let i = 0; i <= 8; i++){
		boxID = "actConditionBox" + i;
		currentBox = byId(boxID);
		$(currentBox).hide();
	}
}

function addCondition() {
  var conditionValue = byId("actConditionSelect").value;

  switch(conditionValue) {
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
        "parteventlocation": [""],
      });
      byId("conditionBox8Pattern").value = "";
      break;

  }
  updateConditionList();
  
}

function updateConditionList() {
  let conditionListDiv = byId("actConditionList");
  conditionListDiv.innerHTML = "";
  for(let i = 0; i < actConditionArray.length; i++) {

    var conditionType = actConditionArray[i].type; //Setting condType to whatever that element's type is
    var conditionID = actConditionArray[i].id;
    let newDiv = document.createElement("div"); //Make new element here to be implemented later
    newDiv.classList.add("ui", "raised","segment","left","aligned");
    newDiv.style.backgroundColor = "#bdbdbd";
    switch (conditionType) {
      case 1:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Part', this.value)\" value=\"" + actConditionArray[i].part + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Status', this.value)\" value=\"" + actConditionArray[i].status + "\" size=\"8\" list=\"actStatusDropdown\">" + 
        "</div>" + 
        "<select onfocusout=\"conditionFocusOut(" + conditionID + ", 'Comparator', this.value)\" class=\"ui dropdown\" id=\"updateConditionSelect"+ conditionID +"\">" + 
        "  <option value=\"=\">=</option>" + 
        "  <option value=\"!=\">!=</option>" + 
        "  <option value=\">\">></option>" + 
        "  <option value=\"<\"><</option>" + 
        "  <option value=\">=\">>=</option>" + 
        "  <option value=\"<=\"><=</option>" + 
        "</select>" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"number\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Number', this.value)\" value=\"" + actConditionArray[i].number + "\" style=\"width: 100px;\">" + 
        "</div>" + 
        "<button class=\"ui red icon button mini\" onclick=\"removeCondition("+ conditionID +")\"><i class=\"minus icon\"></i></button>";
        updateConditionSelectID = "updateConditionSelect" + conditionID;
        conditionListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateConditionSelectID).value = actConditionArray[i].comparator;
        break;

      case 2:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "                  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Part1', this.value)\" value=\"" + actConditionArray[i].part1 + "\" size=\"10\" list=\"actPartDropdown\">" + 
        "                </div>" + 
        "                <div class=\"ui input focus\">" + 
        "                  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Status', this.value)\" value=\"" + actConditionArray[i].status1 + "\" size=\"5\" list=\"actStatusDropdown\">" + 
        "                </div>" + 
        "                <select onfocusout=\"conditionFocusOut(" + conditionID + ", 'Comparator', this.value)\" class=\"ui dropdown\" id=\"updateConditionSelect"+ conditionID +"\">" + 
        "                  <option value=\"=\">=</option>" + 
        "                  <option value=\"!=\">!=</option>" + 
        "                  <option value=\">\">></option>" + 
        "                  <option value=\"<\"><</option>" + 
        "                  <option value=\">=\">>=</option>" + 
        "                  <option value=\"<=\"><=</option>" + 
        "                </select>" + 
        "                <div class=\"ui input focus\">" + 
        "                  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Part2', this.value)\" value=\"" + actConditionArray[i].part2 + "\" size=\"10\" list=\"actPartDropdown\">" + 
        "                </div>" + 
        "                <div class=\"ui input focus\">" + 
        "                  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Status2', this.value)\" value=\"" + actConditionArray[i].status2 + "\" size=\"5\" list=\"actStatusDropdown\">" + 
        "                </div>" +
        "                <button class=\"ui red icon button mini\" onclick=\"removeCondition("+ conditionID +")\"><i class=\"minus icon\"></i></button>";
        updateConditionSelectID = "updateConditionSelect" + conditionID;
        conditionListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateConditionSelectID).value = actConditionArray[i].comparator;
        break;

        case 3:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Part', this.value)\" value=\"" + actConditionArray[i].part + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "<select onfocusout=\"conditionFocusOut(" + conditionID + ", 'Knows', this.value)\" class=\"ui dropdown\" id=\"updateConditionSelect"+ conditionID +"\">" + 
        "  <option value=\"knows\">knows</option>" + 
        "  <option value=\"did\">did</option>" + 
        "  <option value=\"received\">received</option>" + 
        "  <option value=\"heard\">heard</option>" + 
        "  <option value=\"saw\">saw</option>" + 
        "</select>" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Event', this.value)\" value=\"" + actConditionArray[i].event + "\" size=\"13\" list=\"actEventDropdown\">" + 
        "</div>" + 
        "<button class=\"ui red icon button mini\" onclick=\"removeCondition("+ conditionID +")\"><i class=\"minus icon\"></i></button>";
        updateConditionSelectID = "updateConditionSelect" + conditionID;
        conditionListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateConditionSelectID).value = actConditionArray[i].knows;
        break;

        case 4:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Part', this.value)\" value=\"" + actConditionArray[i].part + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "<select onfocusout=\"conditionFocusOut(" + conditionID + ", 'IsIsnt', this.value)\" class=\"ui dropdown\" id=\"updateConditionSelect"+ conditionID +"\">" + 
        "  <option value=\"is\">is</option>" + 
        "  <option value=\"isnt\">isn't</option>" + 
        "</select>" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Status', this.value)\" value=\"" + actConditionArray[i].status + "\" size=\"10\" list=\"actStatusDropdown\">" + 
        "</div>" + 
        "<button class=\"ui red icon button mini\" onclick=\"removeCondition("+ conditionID +")\"><i class=\"minus icon\"></i></button>";
        updateConditionSelectID = "updateConditionSelect" + conditionID;
        conditionListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateConditionSelectID).value = actConditionArray[i].isisnt;
        break;
        
        case 5:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Part1', this.value)\" value=\"" + actConditionArray[i].part1 + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "&nbsp;&nbsp;and	&nbsp;&nbsp;" + 
        "    	<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Part2', this.value)\" value=\"" + actConditionArray[i].part2 + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div><br><br>" + 
        "<select onfocusout=\"conditionFocusOut(" + conditionID + ", 'DoDont', this.value)\" class=\"ui dropdown\" id=\"updateConditionSelect"+ conditionID +"\">" + 
        "  <option value=\"do\">do</option>" + 
        "  <option value=\"dont\">don't</option>" + 
        "</select>" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Status', this.value)\" value=\"" + actConditionArray[i].status + "\" size=\"10\" list=\"actStatusDropdown\">" + 
        "</div> each other." + 
        "<button class=\"ui red icon button mini\" onclick=\"removeCondition("+ conditionID +")\"><i class=\"minus icon\"></i></button>";
        updateConditionSelectID = "updateConditionSelect" + conditionID;
        conditionListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateConditionSelectID).value = actConditionArray[i].dodont;
        break;

        case 6:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Part1', this.value)\" value=\"" + actConditionArray[i].part1 + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "<select onfocusout=\"conditionFocusOut(" + conditionID + ", 'IsIsnt', this.value)\" class=\"ui dropdown\" id=\"updateConditionSelect"+ conditionID +"\">" + 
        "  <option value=\"is\">is</option>" + 
        "  <option value=\"isnt\">isn't</option>" + 
        "</select>" + 
        "        <div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Status', this.value)\" value=\"" + actConditionArray[i].status + "\" size=\"10\" list=\"actStatusDropdown\">" + 
        "</div>" + 
        "with" + 
        "        <div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Part2', this.value)\" value=\"" + actConditionArray[i].part2 + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "<button class=\"ui red icon button mini\" onclick=\"removeCondition("+ conditionID +")\"><i class=\"minus icon\"></i></button>";
        updateConditionSelectID = "updateConditionSelect" + conditionID;
        conditionListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateConditionSelectID).value = actConditionArray[i].isisnt;
        break;

        case 7:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Part1', this.value)\" value=\"" + actConditionArray[i].part1 + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Status', this.value)\" value=\"" + actConditionArray[i].status + "\" size=\"10\" list=\"actStatusDropdown\">" + 
        "</div><br> with " + 
        "" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Part2', this.value)\" value=\"" + actConditionArray[i].part2 + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "" + 
        "<select onfocusout=\"conditionFocusOut(" + conditionID + ", 'Comparator', this.value)\" class=\"ui dropdown\" id=\"updateConditionSelect"+ conditionID +"\">" + 
        "  <option value=\"=\">=</option>" + 
        "  <option value=\"!=\">!=</option>" + 
        "  <option value=\">\">></option>" + 
        "  <option value=\"<\"><</option>" + 
        "  <option value=\">=\">>=</option>" + 
        "  <option value=\"<=\"><=</option>" + 
        "</select>" + 
        "" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"number\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Number', this.value)\" value=\"" + actConditionArray[i].number + "\" style=\"width: 100px;\">" + 
        "</div>" + 
        "<button class=\"ui red icon button mini\" onclick=\"removeCondition("+ conditionID +")\"><i class=\"minus icon\"></i></button>";
        updateConditionSelectID = "updateConditionSelect" + conditionID;
        conditionListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateConditionSelectID).value = actConditionArray[i].comparator;
        break;

        case 8:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"conditionFocusOut(" + conditionID + ", 'Pattern', this.value)\" value=\"" + actConditionArray[i].pattern + "\" size=\"13\" list=\"actPatternDropdown\">" + 
        "</div>";

        for(let j = 0; j < actConditionArray[i].parteventlocation.length; j++) {
          newDiv.innerHTML = newDiv.innerHTML + "<div class=\"ui input focus\">" + 
          "  <input type=\"text\"  onfocusout=\"conditionPartEventLocationFocusOut(" + conditionID + "," + j + ", this.value)\" value=\"" + actConditionArray[i].parteventlocation[j] + "\" placeholder=\"Part Event Location\" size=\"15\" list=\"actStatusDropdown\">" + 
          "</div>";
        }
        newDiv.innerHTML = newDiv.innerHTML + "<button class=\"ui green icon button mini\" onclick=\"addConditionPartEventLocation("+ conditionID +")\"><i class=\"plus icon\"></i></button>" + 
        "<button class=\"ui red icon button mini\" onclick=\"removeConditionPartEventLocation("+ conditionID +")\"><i class=\"minus icon\"></i></button>" + 
        "<br><button class=\"ui red icon button mini\" onclick=\"removeCondition("+ conditionID +")\"><i class=\"minus icon\"></i>Remove Condition</button>";
        conditionListDiv.appendChild(newDiv);//div goes live on site here
        break;
    }
    
  }
}

function addConditionPartEventLocation(x) {
  for (let i = 0; i < actConditionArray.length; i++) {
    if (actConditionArray[i].id == x) {
      actConditionArray[i].parteventlocation.push("");
    }
  }
  updateConditionList();
  
}

function removeConditionPartEventLocation(x){
  for (let i = 0; i < actConditionArray.length; i++) {
    if (actConditionArray[i].id == x) {
      actConditionArray[i].parteventlocation.splice(-1);
    }
  }
  updateConditionList()
}

function removeCondition(removeID) {
  for (let i = 0; i < actConditionArray.length; i++) {
    if (actConditionArray[i].id == removeID) {
      actConditionArray.splice(i, 1);
    }
  }
  updateConditionList();
}

function conditionFocusOut(idNum, cond, val) {
  switch(cond) {
    case 'Part':
      actConditionArray[idNum].part = val;
      break;
    case 'Status':
      actConditionArray[idNum].status = val;
      break;
    case 'Comparator':
      actConditionArray[idNum].comparator = val;
      break;
    case 'Number':
      actConditionArray[idNum].comparator = val;
      break;
    case 'Part1':
      actConditionArray[idNum].part1 = val;
      break;
    case 'Part2':
      actConditionArray[idNum].part2 = val;
      break;
    case 'Status1':
      actConditionArray[idNum].status1 = val;
      break;
    case 'Status2':
      actConditionArray[idNum].status2 = val;
      break;
    case 'Knows':
      actConditionArray[idNum].knows = val;
      break;
    case 'Event':
      actConditionArray[idNum].event = val;
      break;
    case 'DoDont':
      actConditionArray[idNum].dodont = val;
      break;
    case 'IsIsnt':
      actConditionArray[idNum].isisnt = val;
      break;
    case 'Pattern':
      actConditionArray[idNum].pattern = val;
      break;
  }
  updateConditionList();
}

//Result stuff starts here

function actResultBoxChange(input) {
	hideResultBoxes();	//Hide all the boxes
	
	boxID = "actResultBox" + input;
	currentBox = byId(boxID);
	$(currentBox).show();
}

function hideResultBoxes() {
	for(let i = 0; i <= 8; i++){
		boxID = "actResultBox" + i;
		currentBox = byId(boxID);
		$(currentBox).hide();
	}
}

function addResult() {
  var resultValue = byId("actResultSelect").value;

  switch(resultValue) {
    case '0':
      alert("You didn't select a result");
      break;

    case '1':
      actResultCounter++;
      actResultArray.push({
        "id": actResultCounter,
        "type": 1,
        "part": byId("resultBox1Part").value,
        "status": byId("resultBox1Status").value,
        "comparator": byId("resultBox1Comparator").value,
        "number": byId("resultBox1Number").value
      });
      byId("resultBox1Part").value = "";
      byId("resultBox1Status").value = "";
      byId("resultBox1Comparator").value = "=";
      byId("resultBox1Number").value = "";
      break;

      case '2':
      actResultCounter++;
      actResultArray.push({
        "id": actResultCounter,
        "type": 2,
        "part1": byId("resultBox2Part1").value,
        "status1": byId("resultBox2Status1").value,
        "comparator": byId("resultBox2Comparator").value,
        "part2": byId("resultBox2Part2").value,
        "status2": byId("resultBox2Status2").value,
      });
      byId("resultBox2Part1").value = "";
      byId("resultBox2Status1").value = "";
      byId("resultBox2Comparator").value = "";
      byId("resultBox2Part2").value = "";
      byId("resultBox2Status2").value = "";
      break;

      case '3':
      actResultCounter++;
      actResultArray.push({
        "id": actResultCounter,
        "type": 3,
        "part": byId("resultBox3Part").value,
        "knows": byId("resultBox3Knows").value,
        "event": byId("resultBox3Event").value,
      });
      byId("resultBox3Part").value = "";
      byId("resultBox3Knows").value = "knows";
      byId("resultBox3Event").value = "";
      break;

      case '4':
      actResultCounter++;
      actResultArray.push({
        "id": actResultCounter,
        "type": 4,
        "part": byId("resultBox4Part").value,
        "isisnt": byId("resultBox4IsIsnt").value,
        "status": byId("resultBox4Status").value,
      });
      byId("resultBox4Part").value = "";
      byId("resultBox4IsIsnt").value = "is";
      byId("resultBox4Status").value = "";
      break;

      case '5':
      actResultCounter++;
      actResultArray.push({
        "id": actResultCounter,
        "type": 5,
        "part1": byId("resultBox5Part1").value,
        "part2": byId("resultBox5Part2").value,
        "dodont": byId("resultBox5DoDont").value,
        "status": byId("resultBox5Status").value,
      });
      byId("resultBox5Part1").value = "";
      byId("resultBox5Part2").value = "";
      byId("resultBox5Status").value = "";
      byId("resultBox5DoDont").value = "do";
      break;

      case '6':
      actResultCounter++;
      actResultArray.push({
        "id": actResultCounter,
        "type": 6,
        "part1": byId("resultBox6Part1").value,
        "isisnt": byId("resultBox6IsIsnt").value,
        "status": byId("resultBox6Status").value,
        "part2": byId("resultBox6Part2").value,
      });
      byId("resultBox6Part1").value = "";
      byId("resultBox6IsIsnt").value = "is";
      byId("resultBox6Status").value = "";
      byId("resultBox6Part2").value = "";
      break;
      
      case '7':
      actResultCounter++;
      actResultArray.push({
        "id": actResultCounter,
        "type": 7,
        "part1": byId("resultBox7Part1").value,
        "status": byId("resultBox7Status").value,
        "part2": byId("resultBox7Part2").value,
        "comparator": byId("resultBox7Comparator").value,
        "number": byId("resultBox7Number").value,
      });
      byId("resultBox7Part1").value = "";
      byId("resultBox7Status").value = "";
      byId("resultBox7Part2").value = "";
      byId("resultBox7Comparator").value = "=";
      byId("resultBox7Number").value = "";
      break;

      case '8':
      actResultCounter++;
      actResultArray.push({
        "id": actResultCounter,
        "type": 8,
        "pattern": byId("resultBox8Pattern").value,
        "parteventlocation": [""],
      });
      byId("resultBox8Pattern").value = "";
      break;

  }
  updateResultList();
  
}

function updateResultList() {
  let resultListDiv = byId("actResultList");
  resultListDiv.innerHTML = "";
  for(let i = 0; i < actResultArray.length; i++) {

    var resultType = actResultArray[i].type; //Setting resultType to whatever that element's type is
    var resultID = actResultArray[i].id;
    let newDiv = document.createElement("div"); //Make new element here to be implemented later
    newDiv.classList.add("ui", "raised","segment","left","aligned");
    newDiv.style.backgroundColor = "#bdbdbd";
    switch (resultType) {
      case 1:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Part', this.value)\" value=\"" + actResultArray[i].part + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Status', this.value)\" value=\"" + actResultArray[i].status + "\" size=\"8\" list=\"actStatusDropdown\">" + 
        "</div>" + 
        "<select onfocusout=\"resultFocusOut(" + resultID + ", 'Comparator', this.value)\" class=\"ui dropdown\" id=\"updateResultSelect"+ resultID +"\">" + 
        "  <option value=\"=\">=</option>" + 
        "  <option value=\"+=\">+=</option>" + 
        "  <option value=\"-=\">-=</option>" + 
        "</select>" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"number\" onfocusout=\"resultFocusOut(" + resultID + ", 'Number', this.value)\" value=\"" + actResultArray[i].number + "\" style=\"width: 100px;\">" + 
        "</div>" + 
        "<button class=\"ui red icon button mini\" onclick=\"removeResult("+ resultID +")\"><i class=\"minus icon\"></i></button>";
        updateResultSelectID = "updateResultSelect" + resultID;
        resultListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateResultSelectID).value = actResultArray[i].comparator;
        break;

      case 2:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "                  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Part1', this.value)\" value=\"" + actResultArray[i].part1 + "\" size=\"10\" list=\"actPartDropdown\">" + 
        "                </div>" + 
        "                <div class=\"ui input focus\">" + 
        "                  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Status', this.value)\" value=\"" + actResultArray[i].status1 + "\" size=\"5\" list=\"actStatusDropdown\">" + 
        "                </div>" + 
        "                <select onfocusout=\"resultFocusOut(" + resultID + ", 'Comparator', this.value)\" class=\"ui dropdown\" id=\"updateResultSelect"+ resultID +"\">" + 
        "                  <option value=\"=\">=</option>" + 
        "                  <option value=\"+=\">+=</option>" + 
        "                  <option value=\"-=\">-=</option>" + 
        "                </select>" + 
        "                <div class=\"ui input focus\">" + 
        "                  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Part2', this.value)\" value=\"" + actResultArray[i].part2 + "\" size=\"10\" list=\"actPartDropdown\">" + 
        "                </div>" + 
        "                <div class=\"ui input focus\">" + 
        "                  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Status2', this.value)\" value=\"" + actResultArray[i].status2 + "\" size=\"5\" list=\"actStatusDropdown\">" + 
        "                </div>" +
        "                <button class=\"ui red icon button mini\" onclick=\"removeResult("+ resultID +")\"><i class=\"minus icon\"></i></button>";
        updateResultSelectID = "updateResultSelect" + resultID;
        resultListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateResultSelectID).value = actResultArray[i].comparator;
        break;

        case 3:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Part', this.value)\" value=\"" + actResultArray[i].part + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "<select onfocusout=\"resultFocusOut(" + resultID + ", 'Knows', this.value)\" class=\"ui dropdown\" id=\"updateResultSelect"+ resultID +"\">" + 
        "  <option value=\"knows\">knows</option>" + 
        "  <option value=\"heard\">heard</option>" + 
        "</select>" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Event', this.value)\" value=\"" + actResultArray[i].event + "\" size=\"13\" list=\"actEventDropdown\">" + 
        "</div>" + 
        "<button class=\"ui red icon button mini\" onclick=\"removeResult("+ resultID +")\"><i class=\"minus icon\"></i></button>";
        updateResultSelectID = "updateResultSelect" + resultID;
        resultListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateResultSelectID).value = actResultArray[i].knows;
        break;

        case 4:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Part', this.value)\" value=\"" + actResultArray[i].part + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "<select onfocusout=\"resultFocusOut(" + resultID + ", 'IsIsnt', this.value)\" class=\"ui dropdown\" id=\"updateResultSelect"+ resultID +"\">" + 
        "  <option value=\"is\">is</option>" + 
        "  <option value=\"isnt\">isn't</option>" + 
        "</select>" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Status', this.value)\" value=\"" + actResultArray[i].status + "\" size=\"10\" list=\"actStatusDropdown\">" + 
        "</div>" + 
        "<button class=\"ui red icon button mini\" onclick=\"removeResult("+ resultID +")\"><i class=\"minus icon\"></i></button>";
        updateResultSelectID = "updateResultSelect" + resultID;
        resultListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateResultSelectID).value = actResultArray[i].isisnt;
        break;
        
        case 5:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Part1', this.value)\" value=\"" + actResultArray[i].part1 + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "&nbsp;&nbsp;and	&nbsp;&nbsp;" + 
        "    	<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Part2', this.value)\" value=\"" + actResultArray[i].part2 + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div><br><br>" + 
        "<select onfocusout=\"resultFocusOut(" + resultID + ", 'DoDont', this.value)\" class=\"ui dropdown\" id=\"updateResultSelect"+ resultID +"\">" + 
        "  <option value=\"do\">do</option>" + 
        "  <option value=\"dont\">don't</option>" + 
        "</select>" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Status', this.value)\" value=\"" + actResultArray[i].status + "\" size=\"10\" list=\"actStatusDropdown\">" + 
        "</div> each other." + 
        "<button class=\"ui red icon button mini\" onclick=\"removeResult("+ resultID +")\"><i class=\"minus icon\"></i></button>";
        updateResultSelectID = "updateResultSelect" + resultID;
        resultListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateResultSelectID).value = actResultArray[i].dodont;
        break;

        case 6:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Part1', this.value)\" value=\"" + actResultArray[i].part1 + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "<select onfocusout=\"resultFocusOut(" + resultID + ", 'IsIsnt', this.value)\" class=\"ui dropdown\" id=\"updateResultSelect"+ resultID +"\">" + 
        "  <option value=\"is\">is</option>" + 
        "  <option value=\"isnt\">isn't</option>" + 
        "</select>" + 
        "        <div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Status', this.value)\" value=\"" + actResultArray[i].status + "\" size=\"10\" list=\"actStatusDropdown\">" + 
        "</div>" + 
        "with" + 
        "        <div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Part2', this.value)\" value=\"" + actResultArray[i].part2 + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "<button class=\"ui red icon button mini\" onclick=\"removeResult("+ resultID +")\"><i class=\"minus icon\"></i></button>";
        updateResultSelectID = "updateResultSelect" + resultID;
        resultListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateResultSelectID).value = actResultArray[i].isisnt;
        break;

        case 7:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Part1', this.value)\" value=\"" + actResultArray[i].part1 + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Status', this.value)\" value=\"" + actResultArray[i].status + "\" size=\"10\" list=\"actStatusDropdown\">" + 
        "</div><br> with " + 
        "" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Part2', this.value)\" value=\"" + actResultArray[i].part2 + "\" size=\"13\" list=\"actPartDropdown\">" + 
        "</div>" + 
        "" + 
        "<select onfocusout=\"resultFocusOut(" + resultID + ", 'Comparator', this.value)\" class=\"ui dropdown\" id=\"updateResultSelect"+ resultID +"\">" + 
        "  <option value=\"=\">=</option>" + 
        "  <option value=\"+=\">+=</option>" + 
        "  <option value=\"-=\">-=</option>" + 
        "</select>" + 
        "" + 
        "<div class=\"ui input focus\">" + 
        "  <input type=\"number\" onfocusout=\"resultFocusOut(" + resultID + ", 'Number', this.value)\" value=\"" + actResultArray[i].number + "\" style=\"width: 100px;\">" + 
        "</div>" + 
        "<button class=\"ui red icon button mini\" onclick=\"removeResult("+ resultID +")\"><i class=\"minus icon\"></i></button>";
        updateResultSelectID = "updateResultSelect" + resultID;
        resultListDiv.appendChild(newDiv);//div goes live on site here
        byId(updateResultSelectID).value = actResultArray[i].comparator;
        break;

        case 8:
        newDiv.innerHTML = "<div class=\"ui input focus\">" + 
        "  <input type=\"text\" onfocusout=\"resultFocusOut(" + resultID + ", 'Pattern', this.value)\" value=\"" + actResultArray[i].pattern + "\" size=\"13\" list=\"actPatternDropdown\">" + 
        "</div>";

        for(let j = 0; j < actResultArray[i].parteventlocation.length; j++) {
          newDiv.innerHTML = newDiv.innerHTML + "<div class=\"ui input focus\">" + 
          "  <input type=\"text\"  onfocusout=\"resultPartEventLocationFocusOut(" + resultID + "," + j + ", this.value)\" value=\"" + actResultArray[i].parteventlocation[j] + "\" placeholder=\"Part Event Location\" size=\"15\" list=\"actStatusDropdown\">" + 
          "</div>";
        }
        newDiv.innerHTML = newDiv.innerHTML + "<button class=\"ui green icon button mini\" onclick=\"addResultPartEventLocation("+ resultID +")\"><i class=\"plus icon\"></i></button>" + 
        "<button class=\"ui red icon button mini\" onclick=\"removeResultPartEventLocation("+ resultID +")\"><i class=\"minus icon\"></i></button>" + 
        "<br><button class=\"ui red icon button mini\" onclick=\"removeResult("+ resultID +")\"><i class=\"minus icon\"></i>Remove Result</button>";
        resultListDiv.appendChild(newDiv);//div goes live on site here
        break;
    }
    
  }
}

function addResultPartEventLocation(x) {
  for (let i = 0; i < actResultArray.length; i++) {
    if (actResultArray[i].id == x) {
      actResultArray[i].parteventlocation.push("");
    }
  }
  updateResultList();
  
}

function removeResultPartEventLocation(x){
  for (let i = 0; i < actResultArray.length; i++) {
    if (actResultArray[i].id == x) {
      actResultArray[i].parteventlocation.splice(-1);
    }
  }
  updateResultList()
}

function removeResult(removeID) {
  for (let i = 0; i < actResultArray.length; i++) {
    if (actResultArray[i].id == removeID) {
      actResultArray.splice(i, 1);
    }
  }
  updateResultList();
}

function resultFocusOut(idNum, result, val) {
  switch(result) {
    case 'Part':
      actResultArray[idNum].part = val;
      break;
    case 'Status':
      actResultArray[idNum].status = val;
      break;
    case 'Comparator':
      actResultArray[idNum].comparator = val;
      break;
    case 'Number':
      actResultArray[idNum].comparator = val;
      break;
    case 'Part1':
      actResultArray[idNum].part1 = val;
      break;
    case 'Part2':
      actResultArray[idNum].part2 = val;
      break;
    case 'Status1':
      actResultArray[idNum].status1 = val;
      break;
    case 'Status2':
      actResultArray[idNum].status2 = val;
      break;
    case 'Knows':
      actResultArray[idNum].knows = val;
      break;
    case 'Event':
      actResultArray[idNum].event = val;
      break;
    case 'DoDont':
      actResultArray[idNum].dodont = val;
      break;
    case 'IsIsnt':
      actResultArray[idNum].isisnt = val;
      break;
    case 'Pattern':
      actResultArray[idNum].pattern = val;
      break;
  }
  updateResultList();
}

//Have to work on the 

function resultPartEventLocationFocusOut(resultID, index, val) {
}
function conditionPartEventLocationFocusOut(conditionID, index, val) {
}