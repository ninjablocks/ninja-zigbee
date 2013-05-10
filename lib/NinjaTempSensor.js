var util = require('util'),
    stream = require('stream'),
    helpers = require('./helpers');

module.exports = ZigbeeTempSensor
util.inherits(ZigbeeTempSensor,stream);

var temp = 1;

function ZigbeeTempSensor(logger,device) {

  // Features of this device
  this.readable = true;
  this.writeable = true;
  this.log = logger;

  // Ninja config
  this.V = 0;
  this.D = 13; //Temp Sensor
  this.G = device.nwkAddr.toString();+device.endPoint.toString();

  this._device = device;

  device.ninja = this;

  var self = this;

  setInterval(function(){
    self.emit('data', power)
  },2000);
};

ZigbeeTempSensor.prototype.write = function(data) {
  var dataObject = JSON.parse(data);

  this.log.debug('Can not actuate '+this._device.type);

  this.emit('data',data);

  return true;
};

ZigbeeTempSensor.prototype.end = function() {};
ZigbeeTempSensor.prototype.close = function() {};