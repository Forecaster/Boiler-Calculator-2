function Boiler(scene, numTanks, maxTemp)
{
  this.scene = scene;
  
  this.numTanks = numTanks;
  this.maxTemp = maxTemp;
  
  this.steamTank = (this.numTanks * 16000);
  this.waterTank = (this.numTanks * 4000);

  this.partialConversions = 0;
  this.steamLevel = 0;
  this.waterLevel = 0;
  this.temp = 0;

  this.fuelBufferMax = 0;
  this.fuelBuffer = 0;
  this.fuelItem = null;

  this.isBurning = false;
  this.textureOn = false;
}

Boiler.prototype.addFuel = function()
{
  if (this.fuelItem != null)
  {
    this.fuelBuffer = parseFloat(this.fuelBuffer) + parseFloat(this.fuelItem.burnTime);
    this.fuelBufferMax = this.fuelItem.burnTime;
    scenes[this.scene].log.addItem(this.fuelItem, 1);
    mainGui.updateLog();
  }
}

Boiler.prototype.getHeatPercentage = function()
{
  return this.temp / this.maxTemp;
}

Boiler.prototype.addHeat = function(temp)
{
  var newTemp = this.temp + temp;
  
  if (newTemp > this.maxTemp)
    this.temp = this.maxTemp;
  else
    this.temp = newTemp;
  
}

Boiler.prototype.removeHeat = function(temp)
{
  var newTemp = this.temp - temp;
  
  if (newTemp < 0)
    this.temp = 0;
  else
    this.temp = newTemp;
  
}

Boiler.prototype.increaseTemp = function()
{
  if (this.temp == this.maxTemp)
    return 0;

  var change = HEAT_STEP + ((this.temp / this.maxTemp) * HEAT_STEP * 3);
  this.temp += change / this.numTanks;
  this.temp = Math.min(this.temp, this.maxTemp);
  return change;
}

Boiler.prototype.decreaseTemp = function()
{
  if (this.temp == COLD_TEMP)
    return 0;

  var change = HEAT_STEP + ((this.temp / this.maxTemp) * HEAT_STEP * 3);
  this.temp -= (change / this.numTanks);
  this.temp = Math.max(this.temp, COLD_TEMP);
}

Boiler.prototype.getFuelPerCycle = function()
{
  var fuel = FUEL_PER_BOILER_CYCLE;
  fuel -= this.numTanks * FUEL_PER_BOILER_CYCLE * 0.0125;
  fuel += (FUEL_HEAT_INEFFICIENCY * this.getHeatPercentage());
  fuel += FUEL_PRESSURE_INEFFICIENCY * (this.maxTemp / MAX_HEAT_HIGH);
  fuel *= this.numTanks;
  fuel *= efficiencyModifier;
  fuel *= options.fuelPerSteamMultiplier;

  return fuel;
}

Boiler.prototype.convertSteam = function()
{
  if (!this.isBurning || this.temp < BOILING_POINT)
    return 0;

  this.partialConversions += this.numTanks * this.getHeatPercentage();
  var waterCost = parseInt(this.partialConversions);
  if (waterCost <= 0)
    return 0;

  this.partialConversions -= waterCost;

  var drainedWater = this.removeWater(waterCost);

  waterCost = Math.min(waterCost, drainedWater);

  var steam = STEAM_PER_UNIT_WATER * waterCost;

  this.addSteam(steam);
  return steam;
}

Boiler.prototype.addSteam = function(steam)
{
  var returnValue;

  if (this.steamLevel < this.steamTank)
  {
    var newSteamLevel = this.steamLevel + steam;
    
    if (newSteamLevel <= this.steamTank)
    {
      this.steamLevel = newSteamLevel;
      returnValue = steam;
    }
    else
    {
      var dif = newSteamLevel - this.steamTank;
      
      this.steamLevel = this.steamTank;
      
      returnValue = (steam - dif);
    }
  }
  else
    returnValue = 0;

  return returnValue;
}

Boiler.prototype.removeSteam = function(steam)
{
  if (this.steamLevel > steam)
  {
    this.steamLevel -= steam;
    
    return steam;
  }
  else
  {
    this.steamLevel -= steam;
    
    if (this.steamLevel < 0)
    {
      var tempSteam = steam + this.steamLevel;
      
      this.steamLevel = 0;
      
      return tempSteam;
    }
  }
}

Boiler.prototype.addWater = function(water)
{
  var returnValue;

  if (this.temp >= SUPER_HEATED && water > 0 && this.waterLevel == 0)
  {
    scenes[this.scene].explode();
    return 0;
  }

  if (this.waterLevel < this.waterTank)
  {
    var newWaterLevel = this.waterLevel + water;
    
    if (newWaterLevel <= this.waterTank)
    {
      this.waterLevel = newWaterLevel;
      returnValue = water;
    }
    else
    {
      var dif = newWaterLevel - this.waterTank;
      
      this.waterLevel = this.waterTank;
      
      returnValue = water - dif;
    }
  }
  else
    returnValue = 0;

  return returnValue;
}

Boiler.prototype.removeWater = function(water)
{
  if (this.waterLevel > 0)
  {
    var newWaterLevel = this.waterLevel - water;
    
    if (newWaterLevel > 0)
    {
      this.waterLevel = newWaterLevel;
      return water;
    }
    else
    {
      this.waterLevel = 0;
      return water - newWaterLevel;
    }
  }
  else
    return 0;
}