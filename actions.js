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
