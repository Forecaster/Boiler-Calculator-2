<?php
  require_once "krumo/class.krumo.php";
  require_once "inc_connect.php";

  $query = "SELECT DISTINCT `version` FROM `fuel` ORDER BY `version` DESC";

  $result = mysqli_query($con, $query);
  $num = mysqli_num_rows($result);

  if (!$result)
    die("SQL Error: " . mysqli_error($con));

  $i = 0;
  while ($row = mysqli_fetch_assoc($result))
  {
    $versions[$i] = $row["version"];
    $i++;
  }
?>

<link rel="stylesheet" type="text/css" href="css_styles.css" />
<link rel="stylesheet" type="text/css" href="css_scene.css" />
<link rel="stylesheet" type="text/css" href="css_gui.css" />
<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
<script language="javascript" src="scripts.js"></script>
<script language="javascript" src="control_track.js"></script>

<script language="javascript" src="class.Boiler.js"></script>
<script language="javascript" src="class.Gui.js"></script>
<script language="JavaScript" src="class.Options.js"></script>
<script language="javascript" src="class.Valve.js"></script>
<script language="javascript" src="class.WoodTank.js"></script>
<script language="javascript" src="class.SteelTank.js"></script>
<script language="javascript" src="class.Scene.js"></script>
<script language="javascript" src="class.Fuel.js"></script>
<script language="javascript" src="class.FuelLog.js"></script>

<body style="overflow-y: scroll;">
<div id="globalTime">
  <div id="global_pause" class="time_control_pause pnt" onClick="globalPause();"></div>
  <div id="global_run" class="time_control_run pnt" onClick="globalRun();"></div>
  <!--<div id="global_step" class="time_control_half pnt" onClick="globalStep();"></div>-->
</div>
<div onClick="fuelQuery(); notify('Queried for fuel');" class=pnt>Get fuel</div>

<div id=debug style="position: absolute; bottom: 5px; right: 5px;">
</div>

<div id=tps_display style="position: fixed; bottom: 5px; left: 5px; z-index: 1000; background-color: lightgray;" onMouseOver="this.style.visibility = 'collapse'; setTimeout(setVisible, 5000, this);">
</div>

<div id=nutter class="notifier" style="opacity: 0; transition-duration: 2s;" onClick="this.style.transitionDuration = '2s'; this.style.opacity = 0;">
  This is some notification!
</div>

<div id=options_menu class=options_menu style="visibility: collapse;">
  <div style="margin-bottom: 10px;">Options</div>
  <div>
    <div style="display: inline;"><label for="version">Railcraft version:</label></div>
    <div style="display: inline; float: right;">
      <select name=version>
        <?php
          $selected = "selected";
          foreach ($versions as $version)
          {
            echo "<option value=\"$version\" $selected > $version </option>";
            $selected = "";
          }
        ?>
      </select>
    </div>
    <div style="margin-top: 10px; font-size: 11pt;">This will determine which set of fuel values will be used. If the fuel value is wrong the fuel use will be off.</div>
  </div>
  <div class="pnt close_button" onClick="closeOptionsMenu();">Close</div>
</div>

<div id="new_scene_menu" class="options_menu" style="visibility: collapse;">
  <div style="margin-bottom: 4px;">New Scene</div>
  <div style="position: absolute; left: 15px; top: 40px;">
    <div style="float: left;">Boiler Size:</div>
    <div style="float: right; margin-bottom: 5px;">
      <select id="form_boiler_size" name="boiler_size">
        <option value="1">1x1x1 (1)</option>
        <option value="8">2x2x2 (8)</option>
        <option value="12">2x2x3 (12)</option>
        <option value="18">3x3x2 (18)</option>
        <option value="27">3x3x3 (27)</option>
        <option value="36">3x3x4 (36)</option>
      </select>
    </div>
  </div>
  <div style="position: absolute; left: 15px; top: 80px;">
    <div style="float: left;">Boiler Type:</div>
    <div style="float: right;">
      <select id="form_boiler_type" name="boiler_type">
        <option value="LP">Low Pressure</option>
        <option value="HP">High Pressure</option>
      </select>
    </div>
  </div>
  <div class="pnt" style="position: absolute; bottom: 5px; left: 25%; margin-left: -67px;" onClick="createNewScene();">Create Scene</div>
  <div class="pnt" style="position: absolute; bottom: 5px; right: 25%; margin-right: -33px;" onClick="this.parentNode.style.visibility = 'collapse';">Cancel</div>
</div>

<div id="tt_steel_tank" class="tooltip" style="top: -500px; z-index: 10000;">
  <div>Steel Tank</div>
  <div id="tt_steel_tank_contents"></div>
</div>
<div id="tt_wood_tank" class="tooltip" style="top: -500px; z-index: 10000;">
  <div>Water Tank</div>
  <div id="tt_wood_tank_contents"></div>
</div>
<div id="tt_temp" class="tooltip" style="top: -500px; z-index: 10000;">
  <div>Temperature</div>
  <div id="tt_temp_contents"></div>
</div>

<div id=gui_container style="position: fixed; right: 15px; top: 15px; width: 420px;">
  <div style="display: inline-block; position: absolute; width: 352px; top: 20px;">
    <div id=gui_name class=gui_name>Boiler #0</div>
    <div id=gui_pin class=pin style="background-image: url('images/buttons/arrow_left.png');" title="Toggle GUI position." onClick="toggleGuiPos();"></div>
    <div class=boiler_gui>
      <div id=steam_readout class=steamReadout>0/16000</div>
      <div id=water_readout class=waterReadout>0/4000</div>
      
      <div id="steam_tank" class="steamTank" style=""></div>
      <div class="steamGague"></div>
      <div id="temp_gague" class="tempGague" style=""></div>
      <div id="temp_gague_overlay" class="tempGague" style="background: none;" onclick="mainGui.boiler.temp = mainGui.boiler.maxTemp;" onmouseover="setTooltip('tt_temp', 1);" onmouseout="clearTooltip();"></div>
      <div id=flame class=flame style=""></div>
      <div id=boiler_fuel_slot class=boiler_fuel_slot style="background-image: none;" title="Middle click to clear."></div>
      <div id=water_tank class=waterTank style=""></div>
      <div class="waterGague"></div>
      <div id=fuel_menu class=fuel_menu>
        <div id=fuel_arrow_left class="fuel_arrow pnt" style="visibility: collapse;" onMouseDown="mouseDown = true; cycleFuelMenuLeft(500);" onMouseUp="mouseDown = false;" onClick="//fuelMenuSteps -= 1; mainGui.updateFuelMenu();"></div>
        <div style="position: relative; left: 14px;">
          <div id=fuel_slot_0 class=fuel_slot><div id=fuel_item_0 class=fuel_item style="top: 0; left: 0; background-image: none;"></div></div>
          <div id=fuel_slot_1 class=fuel_slot><div id=fuel_item_1 class=fuel_item style="top: 0; left: 0; background-image: none;"></div></div>
          <div id=fuel_slot_2 class=fuel_slot><div id=fuel_item_2 class=fuel_item style="top: 0; left: 0; background-image: none;"></div></div>
          <div id=fuel_slot_3 class=fuel_slot><div id=fuel_item_3 class=fuel_item style="top: 0; left: 0; background-image: none;"></div></div>
          <div id=fuel_slot_4 class=fuel_slot><div id=fuel_item_4 class=fuel_item style="top: 0; left: 0; background-image: none;"></div></div>
          <div id=fuel_slot_5 class=fuel_slot><div id=fuel_item_5 class=fuel_item style="top: 0; left: 0; background-image: none;"></div></div>
          <div id=fuel_slot_6 class=fuel_slot><div id=fuel_item_6 class=fuel_item style="top: 0; left: 0; background-image: none;"></div></div>
          <div id=fuel_slot_7 class=fuel_slot><div id=fuel_item_7 class=fuel_item style="top: 0; left: 0; background-image: none;"></div></div>
          <div id=fuel_slot_8 class=fuel_slot><div id=fuel_item_8 class=fuel_item style="top: 0; left: 0; background-image: none;"></div></div>
        </div>
        <div id=fuel_arrow_right class="fuel_arrow pnt" style="visibility: collapse;" onMouseDown="mouseDown = true; cycleFuelMenuRight(500);" onMouseUp="mouseDown = false;" onClick="//fuelMenuSteps += 1; mainGui.updateFuelMenu();"></div>
      </div>
    </div>
  </div>
  <div style="display: inline-block; position: relative; float: right;">
    <div style="font-family: Minecraft,fantasy; text-align: center;">Fuel<br>Log</div>
    <div id=fuel_log style="background-image: url('images/gui/log_bar_x2.png'); width: 64px; height: 352px;">
      <div style="position: absolute; left: 16px; top: 56px;">
        <div id=fuel_log_slot_0 class=fuel_log_slot style=""></div>
        <div id=fuel_log_slot_1 class=fuel_log_slot style=""></div>
        <div id=fuel_log_slot_2 class=fuel_log_slot style=""></div>
        <div id=fuel_log_slot_3 class=fuel_log_slot style=""></div>
        <div id=fuel_log_slot_4 class=fuel_log_slot style=""></div>
        <div id=fuel_log_slot_5 class=fuel_log_slot style=""></div>
        <div id=fuel_log_slot_6 class=fuel_log_slot style=""></div>
        <div id=fuel_log_slot_7 class=fuel_log_slot style=""></div>
        <div id=fuel_log_slot_8 class=fuel_log_slot style=""></div>
      </div>
      <div style="position: absolute; left: 11px; top: 68px;">
        <div id=fuel_log_num_0 class=fuel_log_number></div>
        <div id=fuel_log_num_1 class=fuel_log_number></div>
        <div id=fuel_log_num_2 class=fuel_log_number></div>
        <div id=fuel_log_num_3 class=fuel_log_number></div>
        <div id=fuel_log_num_4 class=fuel_log_number></div>
        <div id=fuel_log_num_5 class=fuel_log_number></div>
        <div id=fuel_log_num_6 class=fuel_log_number></div>
        <div id=fuel_log_num_7 class=fuel_log_number></div>
        <div id=fuel_log_num_8 class=fuel_log_number></div>
      </div>
    </div>
  </div>
</div>

<div class=main>
  <div id=scene_container>
  </div>
  <div style="width: 440px; font-family: Minecraft,fantasy;" class=pnt onClick="displayNewSceneMenu();">Create Scene...</div>
  <div style="width: 440px; font-family: Minecraft,fantasy; margin-top: 5px;" class="pnt" onClick="createNewScene()" title="Creates a scene with previous settings.">Quick Scene</div>
</div>

<script language="javascript">
//Global vars
var paused = false;
var mouseDown = false;

var firstTick = 0;
var lastTick = 0;
var thisTick = 0;
var tickCounter = 0;
var lastAvg = 40;

var request_start = 0;
var request_end = 0;
var request_standby = false;
var current_request_id = 0;
var request_counter = 0;
var returnData = null;

var rcVersion = "8.3.0.0";

var selectedFuelItem = null;
var fuelMenuSteps = 0;
var fuelMenuItems = [];

//Railcraft statics
var COLD_TEMP = 20;
var BOILING_POINT = 100;
var SUPER_HEATED = 300;
var MAX_HEAT_LOW = 500;
var MAX_HEAT_HIGH = 1000;
var HEAT_STEP = 0.05;
var FUEL_PER_BOILER_CYCLE = 8;
var FUEL_HEAT_INEFFICIENCY = 0.8;
var FUEL_PRESSURE_INEFFICIENCY = 4;
var STEAM_PER_UNIT_WATER = 160;
var STEAM_PER_MJ = 5;
var BOILERS_EXPLODE = true;

//Railcraft options
var efficiencyModifier = 1;

  function tick(force)
  {
    if (force === undefined)
      force = false;

    if (!paused || force)
    {
      tickCounter++;
      for (var i = 0; i < scenes.length; i++)
      {
        scenes[i].tick();
      }

      thisTick = new Date().getTime();

      var secondsSinceStart = ((thisTick - firstTick) / 1000);

      lastAvg = Math.round((tickCounter / secondsSinceStart) * 100) / 100;

      //document.getElementById("debug").innerHTML = "Seconds since start: " + secondsSinceStart + " Average ticks per second: " + lastAvg;
      document.getElementById("tps_display").innerHTML = "Global TPS: " + lastAvg;

      lastTick = new Date().getTime();

      mainGui.update();
    }
    //document.getElementById("debug").innerHTML = (Math.round(mainGui.boiler.fuelBuffer * 100) / 100) + " / " + mainGui.boiler.fuelBufferMax + " (" + mainGui.boiler.getFuelPerCycle() + ")";
    //document.getElementById("debug").innerHTML = mainGui.boiler.temp;
  }

  function globalPause()
  {
    this.paused = true;
    document.getElementById("global_pause").style.backgroundPosition = "0px 16px";
    document.getElementById("global_run").style.backgroundPosition = "0px 0px";
  }

  function globalRun()
  {
    this.paused = false;
    document.getElementById("global_pause").style.backgroundPosition = "0px 0px";
    document.getElementById("global_run").style.backgroundPosition = "0px 16px";
    this.firstTick = new Date().getTime();
  }

  function globalStep()
  {
    this.paused = true;
    document.getElementById("global_pause").style.backgroundPosition = "0px 16px";
    document.getElementById("global_run").style.backgroundPosition = "0px 0px";
    tick(true);
  }

  function setVisible(element)
  {
    element.style.visibility = "visible";
  }
  
  var activeTooltip = null;
  var activeTooltipScene = 0;
  
  var toggleControl = 0;

  var options = new Options();
  
  var scenes = [new Scene(0)];
  var fuels = [];
  
  var mainGui = new Gui(scenes[0].boiler);
  
  fuelQuery();
  
/*   for (var i = 0; i < mainLog.items.length; i++)
  {
    console.log("Item: " + mainLog.items[i].item.name + " Amount: " + mainLog.items[i].amount);
  } */
  
  mainGui.update();
  
  firstTick = new Date().getTime();
  setInterval(function() {tick();}, 25);
</script>