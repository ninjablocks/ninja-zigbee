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
  this.G = device.nwkAddr+device.endPoint.toString();

  this._device = device;
  var self = this;

  setTimeout(function() {
    var dataObject = new Object();
    dataObject.power = power;
    data = JSON.stringify(dataObject);
    // On next tick let the system know we exist
    self.emit('data', data) }
  , 1000);

  setTimeout(readPower, 1000);    
  function readPower() {
    //Send read    
    //Send read    
    //this.log.debug('ZigbeeSmartPlug sending power');
    
    var dataObject = new Object();
    dataObject.temp = power++;
    data = JSON.stringify(dataObject);
    // On next tick let the system know we exist
    self.emit('data', data)
             
    setTimeout(readPower, 1000);    
  }
    

    
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

