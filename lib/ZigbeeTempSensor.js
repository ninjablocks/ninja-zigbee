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
  this.G = device.nwkAddr+device.endPoint.toString();

  this._device = device;
  var self = this;

  setTimeout(function() {
    var dataObject = new Object();
    dataObject.temp = temp;
    data = JSON.stringify(dataObject);
    // On next tick let the system know we exist
    self.emit('data', data) }
  , 1000);

  setTimeout(readTemp, 1000);    
  function readTemp() {
    //Send read    
    this.log.debug('ZigbeeTempSensor sending temp');
    
    var dataObject = new Object();
    dataObject.temp = temp;
    data = JSON.stringify(dataObject);
    // On next tick let the system know we exist
    self.emit('data', data)
        
    setTimeout(readTemp, 1000);    
  }
};

ZigbeeTempSensor.prototype.write = function(data) {
  var dataObject = JSON.parse(data);
  
  this.log.debug('Can not actuate '+this._device.type);
  
  this.emit('data',data);

  return true;
};

ZigbeeTempSensor.prototype.end = function() {};
ZigbeeTempSensor.prototype.close = function() {};

