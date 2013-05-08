var util = require('util'),
    stream = require('stream'),
    helpers = require('./helpers');

module.exports = ZigbeeTempSensor
util.inherits(ZigbeeTempSensor,stream);

var temp = 1;
var POLL_INTERVAL = 1000;

function ZigbeeTempSensor(logger,device) {

  // Attach the logger & zigbee device to
  // this object so it can be used elsehwere.
  this.log = logger;
  this.device = device;

  // Features of this device
  this.readable = true;
  this.writeable = false;

  // Ninja config
  this.V = 0;
  this.D = 9; // Temp Sensor
  this.G = device.nwkAddr+device.endPoint.toString();

  var self = this;

  this._iv = setInterval(function(){

    self.log.debug('ZigbeeTempSensor sending temp');
    self.emit('data', temp);

  }, POLL_INTERVAL);
};

ZigbeeTempSensor.prototype.write = function(data) {

  this.log.debug('Can not actuate '+this._device.type);

  // Do not emit state
  // this.emit('data',data);

  return true;
};

ZigbeeTempSensor.prototype.end = function() {};
ZigbeeTempSensor.prototype.close = function() {};