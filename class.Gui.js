function Gui(boiler)
{
  this.positionLocked = true;

  this.count = 0;
  this.boiler = boiler;
  this.lastBoilerFuelItem = null;
  this.currentScene = 0;

  this.steamReadout = document.getElementById("steam_readout");
  this.steamTank = document.getElementById("steam_tank");
  this.tempGague = document.getElementById("temp_gague");
  this.flame = document.getElementById("flame");
  this.waterReadout = document.getElementById("water_readout");
  this.waterTank = document.getElementById("water_tank");

  this.tankMaxHeight = 94;

  this.waterHeightPerUnit = this.tankMaxHeight / this.boiler.waterTank;
  this.steamHeightPerUnit = this.tankMaxHeight / this.boiler.steamTank;
}

Gui.prototype.setBoiler = function(scene)
{
  if (scene != undefined)
  {
    if (typeof scene.boiler != 'undefined')
    {
      this.boiler = scene.boiler;
      document.getElementById("gui_name").innerHTML = "Boiler #" + scene.id;

      notify("Boiler GUI set to #" + scene.id);
    }
    else
      console.log("Failed to change boiler GUI focus. scene.boiler was not defined.");
  }
  else
    console.log("Failed to change boiler GUI focus. scene was not defined.");
};

Gui.prototype.updateWater = function()
{
  var newHeight = (this.boiler.waterLevel * this.waterHeightPerUnit);

  newHeight = Math.min(this.tankMaxHeight, newHeight);

  var str = newHeight + "px";

  if (this.waterTank.style.height != str)
  {
    this.waterTank.style.height = str;

    this.waterReadout.innerHTML = Math.round(this.boiler.waterLevel) + "/" + this.boiler.waterTank;
  }
};

Gui.prototype.updateSteam = function()
{
  var newHeight = (this.boiler.steamLevel * this.steamHeightPerUnit);

  newHeight = Math.min(this.tankMaxHeight, newHeight);

  var str = newHeight + "px";

  if (this.steamTank.style.height != str)
  {
    this.steamTank.style.height = str;

    this.steamReadout.innerHTML = Math.round(this.boiler.steamLevel) + "/" + this.boiler.steamTank;
  }
};

Gui.prototype.updateTemp = function()
{
  var newHeight = ((this.boiler.temp -20) / (this.boiler.maxTemp -20)) * 86;

  var str = newHeight + "px";

  if (this.tempGague.style.height != str)
    this.tempGague.style.height = str;
};

Gui.prototype.updateFlame = function()
{
  if (this.boiler.fuelBufferMax != 0)
  {
    var height = (this.boiler.fuelBuffer / this.boiler.fuelBufferMax) * 28;
    this.flame.style.height = height + "px";
  }
  else
    this.flame.style.height = "0px";
};

Gui.prototype.updateFuel = function()
{
  if (this.boiler.fuelItem != this.lastBoilerFuelItem)
  {
    if (this.boiler.fuelItem != null)
    {
      notify("Fuel set to " + this.boiler.fuelItem.name);
      document.getElementById("boiler_fuel_slot").style.backgroundImage = "url('images/fuel/" + this.boiler.fuelItem.icon + ".png')";
    }
    else
    {
      notify("Fuel cleared");
      document.getElementById("boiler_fuel_slot").style.backgroundImage = "none";
    }

    this.lastBoilerFuelItem = this.boiler.fuelItem;
  }
};

Gui.prototype.updateFuelMenu = function()
{
  if (fuels.length > 0)
  {
    for (var index = 0; index < 9; index++)
    {
      var fuelSlotElem = document.getElementById("fuel_item_" + index);
      this.fuelItem = index + fuelMenuSteps;

      fuelMenuItems["fuel_item_" + index] = this.fuelItem;

      if (fuels[this.fuelItem].icon != "none")
        fuelSlotElem.style.backgroundImage = "url('images/fuel/" + fuels[this.fuelItem].icon + ".png')";
      fuelSlotElem.title = fuels[this.fuelItem].name + " (" + fuels[this.fuelItem].burnTime + ") [" + fuels[this.fuelItem].source + "]";
    }

    if (fuelMenuSteps > 0)
      document.getElementById("fuel_arrow_left").style.visibility = "	visible";
    else
      document.getElementById("fuel_arrow_left").style.visibility = "collapse";

    if (fuels.length > (fuelMenuSteps + 9))
      document.getElementById("fuel_arrow_right").style.visibility = "visible";
    else
      document.getElementById("fuel_arrow_right").style.visibility = "collapse";

    return true;
  }
  else
    return false;
};

Gui.prototype.updateLog = function()
{
  var log = scenes[this.currentScene].log;

  if (log.items.length > 0)
  {
    var items = log.items;
    for (this.count = 0; this.count < 9; this.count++)
    {
      if (items[this.count] != null && items[this.count] != undefined)
      {
        document.getElementById("fuel_log_slot_" + this.count).style.backgroundImage = "url('images/fuel/" + items[this.count].item.icon + ".png";
        document.getElementById("fuel_log_slot_" + this.count).title = items[this.count].item.name;

        document.getElementById("fuel_log_num_" + this.count).innerHTML = items[this.count].amount;
        document.getElementById("fuel_log_num_" + this.count).title = items[this.count].item.name;
      }
      else
      {
        document.getElementById("fuel_log_slot_" + this.count).style.backgroundImage = "none";
        document.getElementById("fuel_log_slot_" + this.count).title = "";

        document.getElementById("fuel_log_num_" + this.count).innerHTML = "";
        document.getElementById("fuel_log_num_" + this.count).title = "";
      }
    }
  }
  else
  {
    for (var i = 0; i < 9; i++)
    {
      document.getElementById("fuel_log_slot_" + i).style.backgroundImage = "none";
      document.getElementById("fuel_log_slot_" + i).title = "";

      document.getElementById("fuel_log_num_" + i).innerHTML = "";
      document.getElementById("fuel_log_num_" + i).title = "";
    }
  }
};

Gui.prototype.update = function()
{
  this.updateWater();
  this.updateSteam();
  this.updateTemp();
  this.updateFuel();
  this.updateFlame();
  this.updateFuelMenu();

  if (activeTooltip != null && activeTooltip.id == "tt_temp")
  {
    document.getElementById(activeTooltip.id + "_contents").innerHTML = Math.round((this.boiler.temp) * 100) / 100 + "/" + this.boiler.maxTemp;
  }
};

Gui.prototype.switchGuiTarget = function(id)
{
  this.currentScene = id;
  this.updateLog();
  this.setBoiler(scenes[id]);
};