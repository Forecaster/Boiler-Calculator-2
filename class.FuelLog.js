function FuelLog()
{
  this.items = [];
}

FuelLog.prototype.addItem = function(item, amount)
{
  if (this.items.length == 0 || this.items[0].item != item)
  {
    this.items.unshift({item: item, amount: amount});
  }
  else if (this.items[0].item == item)
  {
    this.items[0].amount += amount;
  }
}