function Scene(id)
{
  this.sceneTemplate = "<div id=scene_" + id + " class=scene><div class=\"pnt scene_name\" onClick=\"mainGui.setBoiler(scenes[" + id + "]); mainGui.currentScene = " + id + "\">Scene #" + id + "</div><div class=sky><div class=machines><div id=steel_tank_fluid_" + id + " class=steel_tank style=\"background-image: url('images/steam_still_x2.gif'); background-size: 96px 32px;\"><div id=steel_tank_" + id + " class=steel_tank onMouseOver=\"setTooltip('tt_steel_tank', " + id + ");\" onMouseOut=\"clearTooltip();\"></div></div><div style=\"display: inline-block;\"><div id=steam_valve_" + id + "_readout style=\"font-size: 10pt;\">0%</div><div id=steam_valve_" + id + " class=valve style=\"background-position: 0px 0px;\"><div id=steam_valve_open_" + id + " class=valve_control onClick=\"scenes[" + id + "].steamValve.open();\" title=\"Open valve\"></div><div id=steam_valve_close_" + id + " class=valve_control onClick=\"scenes[" + id + "].steamValve.close();\" title=\"Close Valve\" ></div></div></div><div id=boiler_" + id + " class=\"boiler pnt\" onClick=\"mainGui.setBoiler(scenes[" + id + "]);\"><div id=boiler_tanks_" + id + " class=boiler_tanks></div><div id=boiler_firebox_" + id + " class=boiler_firebox style=\"background-position: 0px 0px;\"></div></div><div style=\"display: inline-block;\"><div id=water_valve_" + id + "_readout style=\"font-size: 10pt;\">0%</div><div id=water_valve_" + id + " class=valve style=\"background-position: 0px 0px;\"><div id=water_valve_open_" + id + " class=valve_control onClick=\"scenes[" + id + "].waterValve.open();\" title=\"Open valve\"></div><div id=water_valve_close_" + id + " class=valve_control onClick=\"scenes[" + id + "].waterValve.close();\" title=\"Close Valve\" ></div></div></div><div id=wood_tank_" + id + " class=woodTank onMouseOver=\"setTooltip('tt_wood_tank', " + id + ");\" onMouseOut=\"clearTooltip();\"></div></div></div><div class=ground></div></div>";
  
  var container = document.getElementById("scene_container");
  
  container.innerHTML = container.innerHTML + this.sceneTemplate;
  
  this.id = id;
  
  this.paused = false;
  
  this.log = new FuelLog();
  this.boiler = new Boiler(id, 1, 500);
  
  this.waterValve = new Valve("water_valve_" + id);
  this.steamValve = new Valve("steam_valve_" + id);
  this.woodTank = new WoodTank(id);
  this.steelTank = new SteelTank(id, "steel_tank_fluid_" + id);
}

Scene.prototype.getId = function()
{
  return this.id;
}

Scene.prototype.getBoiler = function()
{
  return this.boiler;
}

Scene.prototype.boilerOn = function()
{
  document.getElementById("boiler_firebox_" + this.id).style.backgroundPosition = "0px -32px";
}

Scene.prototype.boilerOff = function()
{
  document.getElementById("boiler_firebox_" + this.id).style.backgroundPosition = "0px 0px";
}

Scene.prototype.tick = function()
{
  if (this.boiler.fuelItem != null)
    this.boiler.increaseTemp(1);
  else
    this.boiler.decreaseTemp(2);
  
  if (tickCounter % 8 == 0)
    this.woodTank.addWater(1);
  
  this.boiler.addWater(this.woodTank.removeWater(100 * this.waterValve.percent_open));
  this.boiler.addSteam(this.boiler.removeWater(10)*2*(this.boiler.temp / 1000));
  this.steelTank.addFluid("steam", this.boiler.removeSteam(100 * this.steamValve.percent_open));
  this.steelTank.update();
  this.woodTank.update();
}