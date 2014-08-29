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
  activeTooltip.style.top = "-500px";
  activeTooltip.style.left = null;
  
  activeTooltip = null;
  activeTooltipScene = 0;
  document.onmousemove = null;
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