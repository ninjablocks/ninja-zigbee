var util = require('util'),
    stream = require('stream'),
    helpers = require('./helpers');



//SRPC header bit positions
var SRPC_CMD_ID_POS = 0;
var SRPC_CMD_LEN_POS = 1;

//SRPC CMD ID's
//define the outgoing RPSC command ID's
var RPCS_NEW_ZLL_DEVICE     = 0x0001;
var RPCS_DEV_ANNCE          = 0x0002;
var RPCS_SIMPLE_DESC        = 0x0003;
var RPCS_TEMP_READING       = 0x0004;
var RPCS_POWER_READING      = 0x0005;
var RPCS_PING               = 0x0006;
var RPCS_GET_DEV_STATE_RSP  = 0x0007;
var RPCS_GET_DEV_LEVEL_RSP  = 0x0008;
var RPCS_GET_DEV_HUE_RSP    = 0x0009;
var RPCS_GET_DEV_SAT_RSP    = 0x000a;
var RPCS_ADD_GROUP_RSP      = 0x000b;
var RPCS_GET_GROUP_RSP      = 0x000c;
var RPCS_ADD_SCENE_RSP      = 0x000d;
var RPCS_GET_SCENE_RSP      = 0x000e;


//define incoming RPCS command ID's
var RPCS_CLOSE              = 0x80;
var RPCS_GET_DEVICES        = 0x81;
var RPCS_SET_DEV_STATE      = 0x82;
var RPCS_SET_DEV_LEVEL      = 0x83;
var RPCS_SET_DEV_COLOR      = 0x84;
var RPCS_GET_DEV_STATE      = 0x85;
var RPCS_GET_DEV_LEVEL      = 0x86;
var RPCS_GET_DEV_HUE        = 0x87;
var RPCS_GET_DEV_SAT        = 0x88;
var RPCS_BIND_DEVICES       = 0x89;
var RPCS_GET_THERM_READING  = 0x8a;
var RPCS_GET_POWER_READING  = 0x8b;
var RPCS_DISCOVER_DEVICES   = 0x8c;
var RPCS_SEND_ZCL           = 0x8d;
var RPCS_GET_GROUPS         = 0x8e;
var RPCS_ADD_GROUP          = 0x8f;
var RPCS_GET_SCENES         = 0x90;
var RPCS_STORE_SCENE        = 0x91;
var RPCS_RECALL_SCENE       = 0x92;
var RPCS_IDENTIFY_DEVICE    = 0x93;
var RPCS_CHANGE_DEVICE_NAME = 0x94;
var RPCS_REMOVE_DEVICE      = 0x95;

//SRPC AfAddr Addr modes ID's
var AddrNotPresent = 0;
var AddrGroup = 1;
var Addr16Bit = 2;
var Addr64Bit = 3;
var AddrBroadcast = 1;

module.exports = NinjaRelay
util.inherits(NinjaRelay,stream);

function NinjaRelay(logger,device) {

  // Features of this device
  this.readable = true;
  this.writeable = true;
  this.log = logger;

  this.log.info('Creating NinjaRelay: ' +device.type +' ' +device.nwkAddr +':' +device.endPoint );
  
  // Ninja config
  this.V = 0;
  this.D = 238;
  this.G = device.nwkAddr.toString()+device.endPoint.toString()+"238";

  this.zigbee = device;
  device.ninja = this;

  var self = this;

  setTimeout(function() {
    var dataObject = new Object();
    dataObject.on = true;
    data = JSON.stringify(dataObject);
    // On next tick let the system know we exist
    self.emit('data', data) }
  , 1000);
};

NinjaRelay.prototype.write = function(data) {
  //var dataObject = JSON.parse(data);

  var state = data;
  
  this.log.info('Actuating '+this.zigbee.type+' on:'+state +' ' +data);

  this.setDeviceState(state);

  // Let Ninja know we have changed state.
  // TODO: not blindly assume the colour was changed successfully.
  this.log.info('NinjaRelay.prototype.write: Emitting ' +data);
  this.emit('data', data);


  return true;
};

NinjaRelay.prototype.updateState = function(state) {

  this.emit('data',JSON.stringify(state));
}

NinjaRelay.prototype.end = function() {};
NinjaRelay.prototype.close = function() {};

/**
 * Change the state of the device (on/off).
 *
 * @param {Boolean} state true if on, false if off
 * @fires zigbee#data       `data` written to SRPC client
 */
NinjaRelay.prototype.setDeviceState = function(state) {
  var msg = new Buffer(15);
  var msgIdx;
  var state;

  this.log.info('zigbee.prototype.setDeviceState++: nwk:' +this.zigbee.nwkAddr +' ep:' +this.zigbee.endPoint +' on:' +state);

  //set SRPC len and CMD ID
  msg[SRPC_CMD_ID_POS] = RPCS_SET_DEV_STATE;
  msg[SRPC_CMD_LEN_POS] = 13;

  //set ptr to point to data
  msgIdx=2;

  //dstAddr.addrMode = Addr16Bit
  msg[msgIdx++] = Addr16Bit;
  //set afAddrMode_t nwk address
  msg[msgIdx++] = (this.zigbee.nwkAddr & 0xFF);
  msg[msgIdx++] = ((this.zigbee.nwkAddr & 0xFF00)>>8);
  //pad for an ieee addr size;
  msgIdx += 6;
  //set Ep
  msg[msgIdx++] = this.zigbee.endPoint;
  //pad out pan ID
  msgIdx+=2;

  //set State
  if(state == true){
      msg[msgIdx++] = 0xFF;
  } else {
      msg[msgIdx++] = 0x0;
  }
  this.zigbee.socket.write(msg);
};