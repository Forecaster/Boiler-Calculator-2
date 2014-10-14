function notify(message)
{
  var notify = document.getElementById("nutter");
  
  notify.innerHTML = message;
  
  notify.style.transitionDuration = "0s";
  notify.style.opacity = 1;
  
  setTimeout(function(notify)
  {
    if (notify.style.opacity != 0)
    {
      notify.style.transitionDuration = "2s";
      notify.style.opacity = 0;
    }
  }, 5000, notify);
}

function toggleGuiPos()
{
  var gui_container = document.getElementById("gui_container");
  var pin = document.getElementById("gui_pin");
  
  if (gui_container.style.position == "fixed")
  {
    gui_container.style.position = "static";
    pin.style.backgroundImage = "url('images/buttons/arrow_right.png')";
  }
  else
  {
    gui_container.style.position = "fixed";
    pin.style.backgroundImage = "url('images/buttons/arrow_left.png')";
  }
}

function setTooltip(id, scene)
{
  activeTooltip = document.getElementById(id);
  activeTooltipScene = scene;
  document.onmousemove = onMouseMove;
}

function clearTooltip()
{
  if (activeTooltip != null)
  {
    activeTooltip.style.top = "-500px";
    activeTooltip.style.left = null;

    activeTooltip = null;
    activeTooltipScene = 0;
    document.onmousemove = null;
  }
}

function closeOptionsMenu()
{
  document.getElementById("options_menu").style.visibility = "collapse";
}

function versionQuerySuccess(data)
{
  if (request_end != 0)
  {
    document.getElementById("debug").innerHTML = returnData[0];
    clearInterval(current_request_id);
    request_counter = 0;
    request_end = 0;
  }
  else
  {
    document.getElementById("debug").innerHTML = "Standing by for data (" + request_counter + ") ID: " + current_request_id;
    request_counter++;
  }
}

function versionQuery()
{
  request_start = new Date().getTime();
  
  current_request_id = setInterval("versionQuerySuccess()", 100);
  
  $.post('script_version_query.php', function(data) {returnData = data; request_end = new Date().getTime();}, "json");
}

function fuelQuerySuccess()
{
  if (request_end != 0)
  {
    for(var index in returnData)
    {
      var currentFuel = returnData[index];
      if (currentFuel.hasOwnProperty("name"))
        fuels.push(new Fuel(index, currentFuel.name, currentFuel.burn_time, currentFuel.state, currentFuel.stacksize, currentFuel.source, currentFuel.icon));
    }
    
    clearInterval(current_request_id);
    request_counter = 0;
    request_end = 0;
    current_request_id = 0;
  }
}

function fuelQuery()
{
  request_start = new Date().getTime();
  
  current_request_id = setInterval("fuelQuerySuccess()", 100);
  
  $.post('script_fuel_query.php', { version: rcversion }, function(data) {returnData = data; request_end = new Date().getTime();}, "json");
}

function ticksToTime(ticks)
{
  var returnStr;

  if (ticks != null && ticks != undefined)
  {
    var seconds = Math.floor(ticks / 20);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    if (days >= 1)
      hours -= (days * 24);
    if (hours >= 1)
      minutes -= (hours * 60);
    if (minutes >= 1)
      seconds -= (minutes * 60);

    if (days > 0)
      returnStr = days + "d, " + hours + "h, " + minutes + "m, " + seconds + "s.";
    else if (hours > 0)
      returnStr =  hours + "h, " + minutes + "m, " + seconds + "s.";
    else if (minutes > 0)
      returnStr =  minutes + "m, " + seconds + "s.";
    else if (seconds > 0)
      returnStr =  seconds + "s.";
  }
  else
    returnStr =  "0s.";

  if (returnStr != null && returnStr.length > 0)
    return returnStr;
  else
    return "0s.";
}

function cycleFuelMenuLeft(interval)
{
  if (mouseDown && (fuelMenuSteps != 0) && interval != null && interval != undefined)
  {
    fuelMenuSteps -= 1;
    mainGui.updateFuelMenu();

    if (interval > 150)
      var newInterval = interval - 100;

    setTimeout(cycleFuelMenuLeft, interval, [newInterval]);
  }
}

function cycleFuelMenuRight(interval)
{
  var newInterval;
  if (mouseDown && fuels.length > (fuelMenuSteps + 9) && interval != null && interval != undefined)
  {
    fuelMenuSteps += 1;
    mainGui.updateFuelMenu();

    if (interval > 150)
      newInterval = interval - 100;
    else
      newInterval = interval;

    setTimeout(cycleFuelMenuRight, interval, [newInterval]);
  }
}