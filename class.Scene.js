function Scene(id, numTanks, boilerType)
{
  if (id == undefined)
  {
    console.error("Scene could not be created. No id was provided.");
    return;
  }
  if (numTanks == undefined)
    var numTanks = 1;
  if (boilerType == undefined)
    var boilerType = "LP";

  this.sceneTemplate = "" +
  "<div id=scene_" + id + " class=scene>" +
    "<div id=time_controls_" + id + " class=time_control_container>" +
      "<div id=time_control_pause_" + id + " class=\"time_control_pause pnt\" onClick=\"scenes[" + id + "].setTickRate(0);\"></div>" +
      "<div id=time_control_half_" + id + " class=\"time_control_half pnt\" onClick=\"scenes[" + id + "].setTickRate(4);\"></div>" +
      "<div id=time_control_run_" + id + " class=\"time_control_run pnt\" onClick=\"scenes[" + id + "].setTickRate(2);\"></div>" +
      "<div id=time_control_double_" + id + " class=\"time_control_double pnt\" onClick=\"scenes[" + id + "].setTickRate(1);\"></div>" +
    "</div>" +
    "<div class=\"scene_name\"><div id=\"scene_name_" + id + "\" style=\"display: inline-block;\" class=\"pnt\" onClick=\"mainGui.switchGuiTarget(" + id + ");\">Scene #" + id + "</div></div>" +
    "<div class=sky>" +
      "<div class=machines>" +
        "<div id=steel_tank_fluid_" + id + " class=steel_tank style=\"background-image: url('images/steam_still_x2.gif'); background-size: 96px 32px;\">" +
          "<div id=steel_tank_" + id + " class=steel_tank onMouseOver=\"setTooltip('tt_steel_tank', " + id + ");\" onMouseOut=\"clearTooltip();\"></div>" +
        "</div>" +
        "<div style=\"display: inline-block;\">" +
          "<div id=steam_valve_" + id + "_readout style=\"font-size: 10pt;\">0%</div>" +
          "<div id=steam_valve_" + id + " class=valve style=\"background-position: 0px 0px;\">" +
            "<div id=steam_valve_open_" + id + " class=valve_control onClick=\"scenes[" + id + "].steamValve.open();\" title=\"Open valve\"></div>" +
            "<div id=steam_valve_close_" + id + " class=valve_control onClick=\"scenes[" + id + "].steamValve.close();\" title=\"Close Valve\" ></div>" +
          "</div>" +
        "</div>" +
        "<div id=boiler_" + id + " class=\"boiler pnt\" onClick=\"mainGui.switchGuiTarget(" + id + ");\">" +
          "<div id=\"boiler_tank_number_" + id + "\" class=boiler_tank_number>" + numTanks + " " + boilerType + "</div>" +
          "<div id=boiler_tanks_" + id + " class=boiler_tanks></div>" +
          "<div id=boiler_firebox_" + id + " class=boiler_firebox style=\"background-position: 0px 0px;\"></div>" +
        "</div>" +
        "<div style=\"display: inline-block;\">" +
          "<div id=water_valve_" + id + "_readout style=\"font-size: 10pt;\">0%</div>" +
          "<div id=water_valve_" + id + " class=valve style=\"background-position: 0px 0px;\">" +
            "<div id=water_valve_open_" + id + " class=valve_control onClick=\"scenes[" + id + "].waterValve.open();\" title=\"Open valve\"></div>" +
            "<div id=water_valve_close_" + id + " class=valve_control onClick=\"scenes[" + id + "].waterValve.close();\" title=\"Close Valve\" ></div>" +
          "</div>" +
        "</div>" +
        "<div id=wood_tank_" + id + " class=woodTank onMouseOver=\"setTooltip('tt_wood_tank', " + id + ");\" onMouseOut=\"clearTooltip();\"></div>" +
      "</div>" +
    "</div>" +
    "<div class=ground>" +
      "<div id=\"scene_tps_display_" + id + "\" class=\"scene_info_display\" style=\"bottom: 2px; left: 2px;\"></div>" +
      "<div id=\"scene_time_display_" + id + "\" class=\"scene_info_display\" style=\"bottom: 2px; right: 2px;\" onClick=\"scenes[" + id + "].explode()\"></div>" +
    "</div>" +
  "</div>";

  var container = document.getElementById("scene_container");

  container.innerHTML = container.innerHTML + this.sceneTemplate;

  this.id = id;
  this.exploded = false;

  this.tickRate = 2;

  this.firstTick = 0;
  this.lastTick = 0;
  this.thisTick = 0;
  this.tickCounter = 0;
  this.activeTickCounter = 0;
  this.displayTickCounter = 0;
  this.lastAvrg = 20;

  this.log = new FuelLog();

  var maxTemp = 500;
  if (boilerType == "HP")
    maxTemp = 1000;

  this.boiler = new Boiler(id, numTanks, maxTemp);

  this.waterValve = new Valve("water_valve_" + id);
  this.steamValve = new Valve("steam_valve_" + id);
  this.woodTank = new WoodTank(id);
  this.steelTank = new SteelTank(id, "steel_tank_fluid_" + id);
}

Scene.prototype.explode = function()
{
  this.exploded = true;
  document.getElementById("scene_name_" + this.id).innerHTML = "Scene #" + this.id + " - EXPLODED";
  document.getElementById("scene_name_" + this.id).style.color = "red";
}

Scene.prototype.boilerOn = function()
{
  if (!this.boiler.textureOn)
    document.getElementById("boiler_firebox_" + this.id).style.backgroundPosition = "0px -32px";
}

Scene.prototype.boilerOff = function()
{
  if (this.boiler.textureOn)
    document.getElementById("boiler_firebox_" + this.id).style.backgroundPosition = "0px 0px";
}

Scene.prototype.setTickRate = function(newTickRate)
{
  if (newTickRate == 0)
    document.getElementById("time_control_pause_" + this.id).style.backgroundPosition = "0px 16px";
  else
    document.getElementById("time_control_pause_" + this.id).style.backgroundPosition = "0px 0px";

  if (newTickRate == 4)
    document.getElementById("time_control_half_" + this.id).style.backgroundPosition = "0px 16px";
  else
    document.getElementById("time_control_half_" + this.id).style.backgroundPosition = "0px 0px";

  if (newTickRate == 2)
    document.getElementById("time_control_run_" + this.id).style.backgroundPosition = "0px 16px";
  else
    document.getElementById("time_control_run_" + this.id).style.backgroundPosition = "0px 0px";

  if (newTickRate == 1)
    document.getElementById("time_control_double_" + this.id).style.backgroundPosition = "0px 16px";
  else
    document.getElementById("time_control_double_" + this.id).style.backgroundPosition = "0px 0px";

  this.tickRate = newTickRate;

  this.firstTick = 0;
  this.activeTickCounter = 0;

  document.getElementById("scene_tps_display_" + this.id).innerHTML = this.lastAvrg + " tps";
}

Scene.prototype.tick = function()
{
  this.tickCounter++;
  if ((this.tickCounter % this.tickRate) == 0 && !this.exploded)
  {
    this.activeTickCounter++;
    this.displayTickCounter++;

    if (this.firstTick == 0)
      this.firstTick = new Date().getTime();

    if (this.boiler.fuelBuffer < this.boiler.getFuelPerCycle())
      this.boiler.addFuel();

    this.boiler.isBurning = this.boiler.fuelBuffer >= this.boiler.getFuelPerCycle();

    if (this.boiler.isBurning)
    {
      this.boiler.fuelBuffer -= this.boiler.getFuelPerCycle();
      this.boiler.increaseTemp();
      this.boilerOn();
    }
    else
    {
      this.boiler.decreaseTemp();
      this.boilerOff();
    }

    if (this.tickCounter % (this.tickRate * 8) == 0)
      this.woodTank.addWater(1);

    this.boiler.addWater(this.woodTank.removeWater(100 * this.waterValve.percent_open));

    this.boiler.convertSteam();

    this.steelTank.addFluid("steam", this.boiler.removeSteam(100 * this.steamValve.percent_open));
    this.steelTank.update();
    this.woodTank.update();

    //Tick per second counter code
    this.thisTick = new Date().getTime();

    this.secondsSinceStart = ((this.thisTick - this.firstTick) / 1000);

    this.lastAvrg = Math.round((this.activeTickCounter / this.secondsSinceStart) * 100) / 100;

    //document.getElementById("debug").innerHTML = "Seconds since start: " + secondsSinceStart + " Average ticks per second: " + lastAvrg;
    //document.getElementById("scene_tps_display_" + this.id).innerHTML = this.lastAvrg;

    this.lastTick = new Date().getTime();
  }
  document.getElementById("scene_tps_display_" + this.id).innerHTML = this.lastAvrg + " tps";
  document.getElementById("scene_time_display_" + this.id).innerHTML = ticksToTime(this.displayTickCounter);
}