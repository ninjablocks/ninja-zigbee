var util = require('util'),
    stream = require('stream'),
    helpers = require('./helpers');

module.exports = ZigbeeSmartPlug
util.inherits(ZigbeeSmartPlug,stream);

var power = 1;

function ZigbeeSmartPlug(logger,device) {

  // Features of this device
  this.readable = true;
  this.writeable = true;
  this.log = logger;

  // Ninja config
  this.V = 0;
  this.D = 243; //power
  this.G = device.nwkAddr.toString();+device.endPoint.toString();

  this._device = device;

  device.ninja = this;
  var self = this;

  process.nextTick(function(){
    self.emit('data', power)
  });

};

ZigbeeSmartPlug.prototype.write = function(data) {
  var dataObject = JSON.parse(data);

  this.log.debug('Actuating '+this._device.type);

  //set on/off state of plug

  this.emit('data',data);

  return true;
};


ZigbeeSmartPlug.prototype.updateState = function(power) {
  console.log('emitting',power)
  this.emit('data',power.toString())
}

ZigbeeSmartPlug.prototype.end = function() {};
ZigbeeSmartPlug.prototype.close = function() {};