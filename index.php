<?php
  require_once("inc_connect.php");

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
<script language="javascript" src="scripts.js" ></script>
<script language="javascript" src="control_track.js" ></script>

<script language="javascript" src="class.Boiler.js" ></script>
<script language="javascript" src="class.Gui.js" ></script>
<script language="javascript" src="class.Valve.js" ></script>
<script language="javascript" src="class.WoodTank.js" ></script>
<script language="javascript" src="class.SteelTank.js" ></script>
<script language="javascript" src="class.Scene.js" ></script>
<script language="javascript" src="class.Fuel.js" ></script>
<script language="javascript" src="class.FuelLog.js" ></script>

<body style="overflow-y: scroll;">
<div onClick="" class=pnt>Get fuel</div>
<div onClick="mainGui.updateLog(mainLog);" class=pnt>Update log</div>

<div id=debug style="position: absolute; bottom: 5px; right: 5px;">
</div>

<div id=nutter class="notifier pnt" style="opacity: 0; transition-duration: 2s;" onClick="this.style.transitionDuration = '2s'; this.style.opacity = 0;">
  This is some notification!
</div>

<div id=options_menu class=options_menu style="visibility: collapse;">
  <div style="margin-bottom: 10px;">Options</div>
  <div>
    <div style="display: inline;">Railcraft version:</div>
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

<div id=tt_steel_tank class=tooltip style="top: -500px;">0/0</div>
<div id=tt_wood_tank class=tooltip style="top: -500px;">0/0</div>

<div id=gui_container style="position: fixed; right: 15px; top: 15px; width: 420px;">
  <div style="display: inline-block; position: absolute; width: 352px; top: 20px;">
    <div id=gui_name class=gui_name>Boiler #0</div>
    <div id=gui_pin class=pin style="background-image: url('images/buttons/arrow_left.png');" title="Toggle GUI position." onClick="toggleGuiPos();"></div>
    <div class=boiler_gui>
      <div id=steam_readout class=steamReadout>0/16000</div>
      <div id=water_readout class=waterReadout>0/4000</div>
      
      <div id=steam_tank class=steamTank style="background-size: 32px 0px;"><div class="steamGague"></div></div>
      <div id=temp_gague class=tempGague style="height: 86px;" onClick="mainGui.boiler.temp = 500;"></div>
      <div id=flame class=flame></div>
      <div id=boiler_fuel_slot class=boiler_fuel_slot style="background-image: none;" title="Middle click to clear."></div>
      <div id=water_tank class=waterTank style="background-size: 32px 0px;"><div class="waterGague"></div></div>
      <div id=fuel_menu class=fuel_menu>
        <div id=fuel_arrow_left class="fuel_arrow pnt" style="visibility: collapse;" onClick="fuelMenuSteps -= 1; mainGui.updateFuelMenu();"></div>
        <div style="position: relative; left: 14px;">
          <div id=fuel_slot_0 class=fuel_slot><div id=fuel_item_0 class=fuel_item style="top: 0px; left: 0px; background-image: none;"></div></div>
          <div id=fuel_slot_1 class=fuel_slot><div id=fuel_item_1 class=fuel_item style="top: 0px; left: 0px; background-image: none;"></div></div>
          <div id=fuel_slot_2 class=fuel_slot><div id=fuel_item_2 class=fuel_item style="top: 0px; left: 0px; background-image: none;"></div></div>
          <div id=fuel_slot_3 class=fuel_slot><div id=fuel_item_3 class=fuel_item style="top: 0px; left: 0px; background-image: none;"></div></div>
          <div id=fuel_slot_4 class=fuel_slot><div id=fuel_item_4 class=fuel_item style="top: 0px; left: 0px; background-image: none;"></div></div>
          <div id=fuel_slot_5 class=fuel_slot><div id=fuel_item_5 class=fuel_item style="top: 0px; left: 0px; background-image: none;"></div></div>
          <div id=fuel_slot_6 class=fuel_slot><div id=fuel_item_6 class=fuel_item style="top: 0px; left: 0px; background-image: none;"></div></div>
          <div id=fuel_slot_7 class=fuel_slot><div id=fuel_item_7 class=fuel_item style="top: 0px; left: 0px; background-image: none;"></div></div>
          <div id=fuel_slot_8 class=fuel_slot><div id=fuel_item_8 class=fuel_item style="top: 0px; left: 0px; background-image: none;"></div></div>
        </div>
        <div id=fuel_arrow_right class="fuel_arrow pnt" style="visibility: collapse;" onClick="fuelMenuSteps += 1; mainGui.updateFuelMenu();"></div>
      </div>
    </div>
  </div>
  <div style="display: inline-block; position: relative; float: right;">
    <div style="font-family: Minecraft; text-align: center;">Fuel<br>Log</div>
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
    <!--<div id=scene_0 class=scene>
      <div class=sky>
        <div class=machines>
          <div id=steel_tank_fluid_0 class="steel_tank counterweight" style="background-image: url('images/steam_still_x2.gif'); background-size: 96px 32px;">
            <div id=steel_tank_0 class=steel_tank></div>
          </div>
          <div style="display: inline-block;" class=counterweight>
            <div id=steam_valve_0 class=valve style="background-position: 0px 0px;">
              <div id=steam_valve_open_0 class=valve_control onClick="steamValve.open();" title="Open valve"></div>
              <div id=steam_valve_close_0 class=valve_control onClick="steamValve.close();" title="Close Valve" ></div>
            </div>
            <div id=steam_valve_0_readout style="font-size: 10pt;">0%</div>
          </div>
          <div id=boiler_0 class="boiler counterweight">
            <div id=boiler_tanks_0 class=boiler_tanks></div>
            <div id=boiler_firebox_0 class=boiler_firebox></div>
          </div>
          <div style="display: inline-block;" class=counterweight>
            <div id=water_valve_0 class=valve style="background-position: 0px 0px;">
              <div id=water_valve_open_0 class=valve_control onClick="waterValve.open();" title="Open valve"></div>
              <div id=water_valve_close_0 class=valve_control onClick="waterValve.close();" title="Close Valve" ></div>
            </div>
            <div id=water_valve_0_readout style="font-size: 10pt;">0%</div>
          </div>
          <div id=wood_tank_0 class="woodTank counterweight">
          </div>
        </div>
      </div>
      <div class=ground>
      </div>
    </div>-->
  </div>
  <div style="width: 440px; font-family: Minecraft;" class=pnt onClick="scenes.push(new Scene(scenes.length)); mainGui.setBoiler(scenes[(scenes.length - 1)]);">Add Scene</div>
</div>

<script language="javascript">
//Global vars
var firstTick = 0;
var lastTick = 0;
var thisTick = 0;
var tickCounter = 0;
var lastAvrg = 0;

var request_start = 0;
var request_end = 0;
var request_standby = false;
var current_request_id = 0;
var request_counter = 0;
var returnData = null;

var rcversion = "8.3.0.0";

var selectedFuelItem = null;
var fuelMenuSteps = 0;
var fuelMenuItems = [];

  function tick()
  {
    for (var i = 0; i < scenes.length; i++)
    {
      tickCounter++;
      scenes[i].tick();
      
      /* thisTick = new Date().getTime();
      
      var secondsSinceStart = ((thisTick - firstTick) / 1000);
      
      if (tickCounter % 8 == 0)
        lastAvrg = Math.round((tickCounter / secondsSinceStart) * 100) / 100;
      
      document.getElementById("debug").innerHTML = "Seconds since start: " + secondsSinceStart + " Average ticks per second: " + lastAvrg;
      
      lastTick = new Date().getTime(); */
    }
    
    mainGui.update();
  }
  
  var activeTooltip = null;
  var activeTooltipScene = 0;
  
  var toggleControl = 0;
  
  var scenes = [new Scene(0)];
  var fuels = [];
  
  var mainGui = new Gui(scenes[0].boiler);
  
  fuelQuery();
  
  var upd_id = setInterval(function(mainGui) {if (mainGui.updateFuelMenu()) {clearInterval(upd_id);}}, 10, mainGui);
  
/*   for (var i = 0; i < mainLog.items.length; i++)
  {
    console.log("Item: " + mainLog.items[i].item.name + " Amount: " + mainLog.items[i].amount);
  } */
  
  mainGui.update();
  
  firstTick = new Date().getTime();
  setInterval(function() {tick();}, 50);
</script>