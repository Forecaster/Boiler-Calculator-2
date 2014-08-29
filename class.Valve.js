function Valve(element_id)
{
  this.element_id = element_id;
  this.valve_element = document.getElementById(element_id);
  
  this.percent_open = 0;
  
  this.frame = ["0px 0px", "-32px 0px", "-64px 0px", "-96px 0px"];
  
  this.current_frame = 0;
}

Valve.prototype.updateReadout = function()
{
  var readout = document.getElementById(this.element_id + "_readout");
  
  readout.innerHTML = Math.round(this.percent_open * 100) + "%";
}

Valve.prototype.incrementFrame = function()
{
  if (this.current_frame != 3)
    this.current_frame++;
  else
    this.current_frame = 0;
}

Valve.prototype.decrementFrame = function()
{
  if (this.current_frame != 0)
    this.current_frame--;
  else
    this.current_frame = 3;
}

Valve.prototype.open = function()
{
  if (this.percent_open < 1)
  {
    var valve_element = document.getElementById(this.element_id);
    
    this.decrementFrame();
    valve_element.style.backgroundPosition = this.frame[this.current_frame];
    this.decrementFrame();
    setTimeout(function(valve_element, frame, current_frame) {valve_element.style.backgroundPosition = frame[current_frame];}, 100, valve_element, this.frame, this.current_frame);
    this.percent_open = Math.round((this.percent_open + 0.1)*10)/10;
    this.updateReadout();
  }
}

Valve.prototype.close = function()
{
  if (this.percent_open > 0)
  {
    var valve_element = document.getElementById(this.element_id);
    
    this.incrementFrame();
    valve_element.style.backgroundPosition = this.frame[this.current_frame];
    this.incrementFrame();
    setTimeout(function(valve_element, frame, current_frame) {valve_element.style.backgroundPosition = frame[current_frame];}, 100, valve_element, this.frame, this.current_frame);
    this.percent_open = Math.round((this.percent_open - 0.1)*10)/10;
    this.updateReadout();
  }
}