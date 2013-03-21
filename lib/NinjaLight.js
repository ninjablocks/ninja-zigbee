var util = require('util'),
    stream = require('stream'),
    helpers = require('./helpers');

module.exports = NinjaLight
util.inherits(NinjaLight,stream);

function NinjaLight(logger,device) {

  // Features of this device
  this.readable = true;
  this.writeable = true;
  this.log = logger;

  // Ninja config
  this.V = 0;
  this.D = 1010;
  this.G = device.nwkAddr+device.endPoint.toString();

  this._device = device;
  var self = this;

  setTimeout(function() {
    var dataObject = new Object();
    dataObject.on = false;
    dataObject.hue = 0
    dataObject.sat = 0
    dataObject.bri = 0;
    data = JSON.stringify(dataObject);
    // On next tick let the system know we exist
    self.emit('data', data) }
  , 1000);
};

NinjaLight.prototype.write = function(data) {
  var dataObject = JSON.parse(data);
  
  var hue = dataObject.hue >> 8
    , sat = dataObject.sat 
    , level = dataObject.bri;
  if (dataObject.on == false) {
    level = 0;
  }

  this.log.debug('Actuating '+this._device.type+' H:'+hue+' S:'+sat+' L:'+level);

  this.log.debug('setDeviceState');
  this._device.setDeviceState(true);
  this.log.debug('setDeviceLevel');
  this._device.setDeviceLevel(level,10);
  this.log.debug('setDeviceColour');
  this._device.setDeviceColour(hue,sat,10);

  // Let Ninja know we have changed colour.
  // TODO: not blindly assume the colour was changed successfully.
  this.emit('data',data);

  return true;
};
NinjaLight.prototype.end = function() {};
NinjaLight.prototype.close = function() {};

