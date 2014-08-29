function Boiler(scene, numTanks, maxTemp)
{
  this.scene = scene;
  
  this.numTanks = numTanks;
  this.maxTemp = maxTemp;
  
  this.steamTank = (this.numTanks * 16000);
  this.waterTank = (this.numTanks * 4000);
  
  this.steamLevel = 0;
  this.waterLevel = 0;
  this.temp = 0;
  
  this.fuelBuffer = 0;
  this.fuelItem = null;
}

Boiler.prototype.increaseTemp = function(temp)
{
  var newTemp = this.temp + temp;
  
  if (newTemp > this.maxTemp)
    this.temp = this.maxTemp;
  else
    this.temp = newTemp;
  
}

Boiler.prototype.decreaseTemp = function(temp)
{
  var newTemp = this.temp - temp;
  
  if (newTemp < 0)
    this.temp = 0;
  else
    this.temp = newTemp;
  
}

Boiler.prototype.getSteam = function()
{
  return this.steam;
}

Boiler.prototype.addSteam = function(steam)
{
  if (this.steamLevel < this.steamTank)
  {
    var newSteamLevel = this.steamLevel + steam;
    
    if (newSteamLevel <= this.steamTank)
    {
      this.steamLevel = newSteamLevel;
      return steam;
    }
    else
    {
      var dif = newSteamLevel - this.steamTank;
      
      this.steamLevel = this.steamTank;
      
      return (steam - dif);
    }
  }
  else
    return 0;
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
  if (this.waterLevel < this.waterTank)
  {
    var newWaterLevel = this.waterLevel + water;
    
    if (newWaterLevel <= this.waterTank)
    {
      this.waterLevel = newWaterLevel;
      return water;
    }
    else
    {
      var dif = newWaterLevel - this.waterTank;
      
      this.waterLevel = this.waterTank;
      
      return (water - dif);
    }
  }
  else
    return 0;
  
  return "Unknown Error";
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