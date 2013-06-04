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

  this.zigbee = device;
  
  this.zigbee.waitingRsp = 0;
  this.zigbee.active = true;
  
  device.ninja = this;
  var self = this;
/*
  //get the state of the device and show it in the cloud
  setTimeout(function() {
    var dataObject = new Object();
    setTimeout(function() {
      self.zigbee.getDeviceState();
    }, 2);
      setTimeout(function() {
      self.zigbee.getDeviceLevel();
    }, 4);
      setTimeout(function() {
      self.zigbee.getDeviceHue();
    }, 6);
      setTimeout(function() {
      self.zigbee.getDeviceSat();
    }, 8);     
  }, 1000);
*/  
  //read and update the light settings periodically
  clearInterval(this._iv);
  this._iv = setInterval(function(){
    
    if(self.zigbee.active)
    {
      self.log.info('getting settings for '+self.zigbee.type);
      setTimeout(function() {
        self.zigbee.getDeviceState();
      }, 2);
        setTimeout(function() {
        self.zigbee.getDeviceLevel();
      }, 4);
        setTimeout(function() {
        self.zigbee.getDeviceHue();
      }, 6);
        setTimeout(function() {
        self.zigbee.getDeviceSat();
      }, 8);
    }
    
    self.zigbee.waitingRsp++;
    self.log.info('waiting for rsp '+self.zigbee.type +' ' +self.zigbee.waitingRsp);
    
    if( self.zigbee.waitingRsp > 5 )
    {
      self.zigbee.active = false;
      
      var dataObject = new Object();
      dataObject.on = false;
            
      data = JSON.stringify(dataObject);             
      
      self.emit('data',data);      
      
    }
    else
    {
      self.zigbee.active = true;
    }
    
  },2000);
 
};

NinjaLight.prototype.write = function(data) {
  var dataObject = JSON.parse(data);
  
  var hue = dataObject.hue >> 8
    , sat = dataObject.sat 
    , level = dataObject.bri
    , state = dataObject.on;

  this.log.debug('Actuating '+this.zigbee.type+' H:'+hue+' S:'+sat+' L:'+level +'Active:' +this.zigbee.active);

  this.log.debug('setDeviceState');
  this.zigbee.setDeviceState(state);
  this.log.debug('setDeviceLevel');
  this.zigbee.setDeviceLevel(level,10);
  this.log.debug('setDeviceColour');
  this.zigbee.setDeviceColour(hue,sat,10);

  // assume it worked then let the periodic update set it correctly
  this.emit('data',data);  

  var self = this;
  //if device is inactive try to get a response
  if(this.zigbee.active == false)
  {
    self.log.info('getting settings for inactive '+self.zigbee.type);
    setTimeout(function() {
      self.zigbee.getDeviceState();
    }, 2);
      setTimeout(function() {
      self.zigbee.getDeviceLevel();
    }, 4);
      setTimeout(function() {
      self.zigbee.getDeviceHue();
    }, 6);
      setTimeout(function() {
      self.zigbee.getDeviceSat();
    }, 8);
  }
  
  return true;
};
NinjaLight.prototype.end = function() {};
NinjaLight.prototype.close = function() {};

