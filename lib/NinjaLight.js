var util = require('util'),
    stream = require('stream'),
    helpers = require('./helpers');

module.exports = NinjaLight
util.inherits(NinjaLight,stream);

function NinjaLight(device) {

  // Features of this device
  this.readable = true;
  this.writeable = true;

  // Ninja config
  this.V = 0;
  this.D = 1007;
  this.G = device.nwkAddr+device.endPoint.toString();

  this._device = device;
  var self = this;

  setTimeout(function() {
    // On next tick let the system know we exist
    self.emit('data','000000')
  },1000);
};

NinjaLight.prototype.write = function(data) {

  var RGB = new helpers.string2rgb(data);
  var rgbObj = RGB.getDecimalVals();
  var hsl = helpers.rgb2hsl(rgbObj.red,rgbObj.green,rgbObj.blue);

  var hue = hsl[0]
    , sat = hsl[1]
    , level = hsl[2];

  console.log('Actuating '+this._device.type+' H:'+hue+' S:'+sat+' L:'+level);

  console.log('setDeviceState');
  this._device.setDeviceState(true); 
  console.log('setDeviceLevel');     
  this._device.setDeviceLevel(level,10);
  console.log('setDeviceColour');
  this._device.setDeviceColour(hue,sat,10);
    
  // Let Ninja know we have changed colour.
  // TODO: not blindly assume the colour was changed successfully.
  this.emit('data',data);

  return true;
};
NinjaLight.prototype.end = function() {};
NinjaLight.prototype.close = function() {};