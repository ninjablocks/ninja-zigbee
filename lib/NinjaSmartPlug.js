var util = require('util'),
    stream = require('stream'),
    helpers = require('./helpers');

module.exports = ZigbeeSmartPlug
util.inherits(ZigbeeSmartPlug,stream);

var power = 1;
var POLL_INTERVAL = 1000;

function ZigbeeSmartPlug(logger,device) {

  // Attach the logger & zigbee device to
  // this object so it can be used elsehwere.
  this.log = logger;
  this.device = device;

  // Features of this device
  this.readable = true;
  this.writeable = false;

  // Ninja config
  this.V = 0;
  this.D = 243; //power
  this.G = device.nwkAddr+device.endPoint.toString();

  var self = this;

  this._iv = setInterval(function(){

    self.log.debug('ZigbeeSmartPlug sending power');
    self.emit('data', power);

  }, POLL_INTERVAL);
};

ZigbeeSmartPlug.prototype.write = function(data) {

  var dataObject = JSON.parse(data);

  this.log.debug('Actuating '+this._device.type);

  //set on/off state of plug
  this.emit('data',data);

  return true;
};

ZigbeeSmartPlug.prototype.end = function() {};
ZigbeeSmartPlug.prototype.close = function() {};

