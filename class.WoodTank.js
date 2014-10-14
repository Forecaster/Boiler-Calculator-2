function WoodTank(scene)
{
  this.scene = scene;
  
  this.size = 400000;
  this.waterLevel = this.size;
  
  this.refill_rate = 10;
  this.refill_rate_min = 1;
  this.penalty_inside = 0.5;
  this.penalty_snow = 0.5;
  this.boost_rain = 3;
  
  this.active_refill_rate = this.refill_rate;
}

WoodTank.prototype.addWater = function(water)
{
  if (this.waterLevel < this.size)
  {
    var newWaterLevel = this.waterLevel + water;
    
    if (newWaterLevel <= this.size)
    {
      this.waterLevel = newWaterLevel;
      return water;
    }
    else
    {
      var dif = newWaterLevel - this.size;
      
      this.waterLevel = this.size;
      
      return (water - dif);
    }
  }
  else
    return 0;
  
  return "Unknown Error";
}

WoodTank.prototype.removeWater = function(water)
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

WoodTank.prototype.calculateRefillRate = function(biome)
{
  
}

WoodTank.prototype.update = function()
{
  if (activeTooltip != null && activeTooltipScene == this.scene && activeTooltip.id == "tt_wood_tank")
    document.getElementById(activeTooltip.id + "_contents").innerHTML = this.waterLevel + "/" + this.size + " mb";
}