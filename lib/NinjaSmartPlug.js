var util = require('util'),
    stream = require('stream'),
    helpers = require('./helpers');

module.exports = NinjaSmartPlug
util.inherits(NinjaSmartPlug,stream);

var power = 1;

function NinjaSmartPlug(logger,device) {

  // Features of this device
  this.readable = true;
  this.writeable = true;
  this.log = logger;

  // Ninja config
  this.V = 0;
  this.D = 243; //power
  this.G = device.nwkAddr.toString();+device.endPoint.toString();

  this.zigbee = device;

  device.ninja = this;
  var self = this;


  clearInterval(this._iv);
  this._iv = setInterval(function(){
    self.pollForPowerReading();
  },2000);

};

NinjaSmartPlug.prototype.pollForPowerReading = function() {

  var numBytes = 17;
  var msg = new Buffer(numBytes);

  // Mutate msg here

  this.zigbee.socket.write(msg);
};


NinjaSmartPlug.prototype.write = function(data) {
  var dataObject = JSON.parse(data);

  this.log.debug('Actuating '+this._device.type);

  //set on/off state of plug

  this.emit('data',data);

  return true;
};


NinjaSmartPlug.prototype.updateState = function(power) {
  console.log('emitting',power)
  this.emit('data',power.toString())
}

NinjaSmartPlug.prototype.end = function() {};
NinjaSmartPlug.prototype.close = function() {};