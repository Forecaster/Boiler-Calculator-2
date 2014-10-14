function SteelTank(scene, fluid_id, size)
{
  this.scene = scene;
  
  if (size == null)
    this.size = 1152000;
  else
    this.size = size;
  
  this.contains = "";
  this.amount = 0;
  
  this.fluid_id = fluid_id;
  
  this.gague_height = 64;
  this.heightPerUnit = this.gague_height / this.size;
}

SteelTank.prototype.addFluid = function(fluid, amount)
{
  if (fluid == undefined || amount == undefined)
  {
    return 0;
  }
  else if (this.amount == this.size)
  {
    return 0;
  }
  else if (this.contains == "" && this.amount == 0)
  {
    this.contains = fluid;
    this.amount = amount;
    
    return amount;
  }
  else if (this.contains == fluid)
  {
    var newAmount = this.amount + amount;
    
    if (newAmount <= this.size)
    {
      this.amount = newAmount;
      return amount;
    }
    else
    {
      var dif = newAmount - this.size;
      
      this.amount = this.size;
      
      return (amount - dif);
    }
  }
}

SteelTank.prototype.removeFluid = function(amount)
{
  return null;
}

SteelTank.prototype.update = function()
{
  var newHeight = this.amount * this.heightPerUnit;
  
  newHeight = Math.min(this.size, newHeight);
  
  var str = "96px " + (32 + newHeight) + "px";
  
  var target = document.getElementById(this.fluid_id);
  
  if (target.style.backgroundSize != str)
    target.style.backgroundSize = str;
    
  if (activeTooltip != null && activeTooltipScene == this.scene && activeTooltip.id == "tt_steel_tank")
    document.getElementById(activeTooltip.id + "_contents").innerHTML = this.amount + "/" + this.size + " mb";
}