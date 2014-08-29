function Gui(boiler)
{
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
  this.tempGagueMaxHeight = 86;
  
  this.waterHeightPerUnit = this.tankMaxHeight / this.boiler.waterTank;
  this.steamHeightPerUnit = this.tankMaxHeight / this.boiler.steamTank;
  
  this.tempHeightPerUnit = this.tempGagueMaxHeight / this.boiler.maxTemp;
}

Gui.prototype.setBoiler = function(scene)
{
  if (typeof scene != 'undefined')
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
}

Gui.prototype.updateWater = function()
{
  var newHeight = (this.boiler.waterLevel * this.waterHeightPerUnit);
  
  newHeight = Math.min(this.tankMaxHeight, newHeight);
  
  var str = "32px " + newHeight + "px";
  
  if (this.waterTank.style.backgroundSize != str)
  {
    this.waterTank.style.backgroundSize = str;
    
    this.waterReadout.innerHTML = this.boiler.waterLevel + "/" + this.boiler.waterTank;
  }
}

Gui.prototype.updateSteam = function()
{
  var newHeight = (this.boiler.steamLevel * this.steamHeightPerUnit);
  
  newHeight = Math.min(this.tankMaxHeight, newHeight);
  
  var str = "32px " + newHeight + "px";
  
  if (this.steamTank.style.backgroundSize != str)
  {
    this.steamTank.style.backgroundSize = str;
    
    this.steamReadout.innerHTML = this.boiler.steamLevel + "/" + this.boiler.steamTank;
  }
}

Gui.prototype.updateTemp = function()
{
  var newHeight = (this.boiler.temp * this.tempHeightPerUnit);
  
  var str = newHeight + "px";
  
  if (this.tempGague.style.height != str)
    this.tempGague.style.height = str;
}

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
}

Gui.prototype.updateFuelMenu = function()
{
  if (fuels.length > 0)
  {
    for (var index = 0; index < 9; index++)
    {
      var fuelSlotElem = document.getElementById("fuel_item_" + index);
      this.fuelItem = index + fuelMenuSteps;
      
      fuelMenuItems["fuel_item_" + index] = this.fuelItem;
      
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
}

Gui.prototype.updateLog = function()
{
  var log = scenes[this.currentScene].log;
  
  if (log.items.length > 0)
  {
    var items = log.items;
    for (this.count = 0; this.count < items.length && this.count < 9; this.count++)
    {
      document.getElementById("fuel_log_slot_" + this.count).style.backgroundImage = "url('images/fuel/" + items[this.count].item.icon + ".png";
      document.getElementById("fuel_log_slot_" + this.count).title = items[this.count].item.name;
      
      document.getElementById("fuel_log_num_" + this.count).innerHTML = items[this.count].amount;
      document.getElementById("fuel_log_slot_" + this.count).title = items[this.count].item.name;
    }
  }
}

Gui.prototype.update = function()
{
  this.updateWater();
  this.updateSteam();
  this.updateTemp();
  this.updateFuel();
}