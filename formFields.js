/* Form fields script
  Here is going to be the file where the user can control the form fields,
  such as adding elements, removing elements, and etc.
 */
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

    case "actTag":
      if(actTagCounter >= 0) {
        actTagCounter = actTagCounter + 1;
        sectionDiv = document.getElementById("actionTagDiv");
      }
      break;

    case "actCond":
      if(actCondCounter >= 0) {
        actCondCounter = actCondCounter + 1;
        sectionDiv = document.getElementById("actionCondDiv");
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

    case "actCond":
      partForm.id = "actionCond" + actCondCounter + "Form";
      partForm.innerHTML = '<input type="text" id="actionCond' + actCondCounter + '" placeholder="Condition ' + actCondCounter + '">';
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
    case "actCond":
      if (actCondCounter >= 0)
        tempSecDiv = "actionCond" + actCondCounter + "Form";
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
    case "actCond":
      actCondCounter = actCondCounter - 1;
      break;
  }
}
