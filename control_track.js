var startX = 0;
var startY = 0;
var offsetX = 0;
var offsetY = 0;
var dragElement = null;
var oldZIndex = 0;

var shift = 0;

document.onmousedown = onMouseDown;
document.onmouseup = onMouseUp;

document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;

function extractNumber(value)
{
  var n = parseInt(value);
  
  if (n == null || isNaN(n))
    return 0;
  else
    return n;
}

function getPosition(element)
{
  var xPosition = 0;
  var yPosition = 0;
  
  while(element)
  {
    if (mainGui.positionLocked)
    {
      xPosition += (element.offsetLeft + element.clientLeft);
      yPosition += (element.offsetTop + element.clientTop);
    }
    else
    {
      xPosition += (element.offsetLeft - element.scrollLeft + window.pageXOffset + element.clientLeft);
      yPosition += (element.offsetTop - element.scrollTop + window.pageYOffset + element.clientTop);
    }
    element = element.offsetParent;
  }
  return { x: xPosition, y: yPosition };
}

function onKeyDown(e)
{
  if (e.key == "Shift")
    shift = 1;
}

function onKeyUp(e)
{
  if (e.key == "Shift")
    shift = 0;
}

function onMouseDown(e)
{
  if (e.target != null)
    var target = e.target;
  else
    var target = e.srcElement;
  
  if (e.button == 0)
  {
    if (target.className == "fuel_item")
    {
      selectedFuelItem = parseInt(target.id.substr(target.id.length -1), 10);
      selectedFuelItem += fuelMenuSteps;
      
      dragElement = target;
      
      if (shift == 0)
      {
        startX = e.clientX;
        startY = e.clientY;
        
        offsetX = extractNumber(target.style.left);
        offsetY = extractNumber(target.style.top);
        
        //document.getElementById("debug").innerHTML = "startX: " + startX + "<br>startY: " + startY + "<br>offsetX: " + offsetX + "<br>offsetY: " + offsetY + "<br>X: " + e.clientX + "<br>Y: " + e.clientY;
        
        document.onmousemove = onMouseMove;
        
        document.body.focus();
        
        return false;
      }
      else if (shift == 1)
      {
        dragElement.style.top = null;
        dragElement.style.left = null;
        
        mainGui.boiler.fuelItem = fuels[selectedFuelItem];
        //scenes[mainGui.currentScene].log.addItem(fuels[selectedFuelItem], 1);
        //mainGui.updateLog();
        
        return false;
      }
    }
  }
}

function onMouseMove(e)
{
  if (e == null)
    var e = window.event;
      
  //document.getElementById("debug").innerHTML = "startX: " + startX + "<br>startY: " + startY + "<br>offsetX: " + offsetX + "<br>offsetY: " + offsetY + "<br>X: " + e.clientX + "<br>Y: " + e.clientY;
  
  if (dragElement != null)
  {
    dragElement.style.left = (offsetX + e.clientX - startX) + "px";
    dragElement.style.top = (offsetY + e.clientY - startY) + "px";
  }
  else if (activeTooltip != null)
  {
    activeTooltip.style.left = (e.clientX + 10) + "px";
    activeTooltip.style.top = (e.clientY) + "px";
  }
}

function onMouseUp(e)
{
  var fuelSlot = document.getElementById("boiler_fuel_slot");
  var pos = getPosition(fuelSlot);
  
  if (e.button == 0)
  {
    if (e.clientX < (pos.x + 32) && e.clientX > pos.x)
      var xOK = true;
    else
      var xOK = false;

    if (e.clientY < (pos.y + 32) && e.clientY > pos.y)
      var yOK = true;
    else
      var yOK = false;
    
    if (dragElement != null && xOK && yOK)
    {
      dragElement.style.top = null;
      dragElement.style.left = null;
      
      mainGui.boiler.fuelItem = fuels[selectedFuelItem];
      dragElement = null;
    }
    else if (dragElement != null)
    {
      dragElement.style.top = null;
      dragElement.style.left = null;
    
      dragElement = null;
    }
    document.onmousemove = null;
  }
  else if (e.button == 1)
  {
    if (e.clientX < (pos.x + 32) && e.clientX > pos.x)
      var xOK = true;
    else
      var xOK = false;
    
    if (e.clientY < (pos.y + 32) && e.clientY > pos.y)
      var yOK = true;
    else
      var yOK = false;
    
    if (mainGui.boiler.fuelItem != null && xOK && yOK)
    {
      mainGui.boiler.fuelItem = null;
    }
  }
}