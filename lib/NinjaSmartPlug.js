var util = require('util'),
    stream = require('stream'),
    helpers = require('./helpers');

module.exports = NinjaSmartPlug
util.inherits(NinjaSmartPlug,stream);

function NinjaSmartPlug(logger,device) {

  // Features of this device
  this.readable = true;
  this.writeable = true;
  this.log = logger;

  // Ninja config
  this.V = 0;
  this.D = 1002;
  this.G = device.nwkAddr+device.endPoint.toString();

  this._device = device;
  var self = this;

  device.on('state',function(state) {

    this.log.info('Emitting',state,'for device',this);
    self.emit('data', JSON.stringify(state)) // To the Cloud!
  })

  device.getPowerReading()

};

NinjaSmartPlug.prototype.write = function(data) {


  console.log(data);
  this._device.getPowerReading();

  return true;
};
NinjaSmartPlug.prototype.end = function() {};
NinjaSmartPlug.prototype.close = function() {};