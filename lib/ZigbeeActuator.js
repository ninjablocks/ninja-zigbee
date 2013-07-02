var util = require('util'),
    stream = require('stream'),
    helpers = require('./helpers');

module.exports = ZigbeeActuator
util.inherits(ZigbeeActuator,stream);

function ZigbeeActuator(logger,device) {

  // Features of this device
  this.readable = true;
  this.writeable = true;
  this.log = logger;

  // Ninja config
  this.V = 0;
  this.D = 5; //push button
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

ZigbeeActuator.prototype.write = function(data) {
  var dataObject = JSON.parse(data);
  
  this.log.debug('Can not Actuate this is an Actuator '+this._device.type);

  this.emit('data',data);

  return true;
};
ZigbeeActuator.prototype.end = function() {};
ZigbeeActuator.prototype.close = function() {};

