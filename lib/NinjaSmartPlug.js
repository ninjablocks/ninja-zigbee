var util = require('util'),
    stream = require('stream'),
    helpers = require('./helpers');

module.exports = NinjaSmartPlug
util.inherits(NinjaSmartPlug,stream);

//SRPC header bit positions
const SRPC_CMD_ID_POS = 0;
const SRPC_CMD_LEN_POS = 1;

//define incoming RPCS command ID's
const RPCS_CLOSE              = 0x80;
const RPCS_GET_DEVICES        = 0x81;
const RPCS_SET_DEV_STATE      = 0x82;
const RPCS_SET_DEV_LEVEL      = 0x83;
const RPCS_SET_DEV_COLOR      = 0x84;
const RPCS_GET_DEV_STATE      = 0x85;
const RPCS_GET_DEV_LEVEL      = 0x86;
const RPCS_GET_DEV_HUE        = 0x87;
const RPCS_GET_DEV_SAT        = 0x88;
const RPCS_BIND_DEVICES       = 0x89;
const RPCS_GET_THERM_READING  = 0x8a;
const RPCS_GET_POWER_READING  = 0x8b;
const RPCS_DISCOVER_DEVICES   = 0x8c;
const RPCS_SEND_ZCL           = 0x8d;
const RPCS_GET_GROUPS         = 0x8e;
const RPCS_ADD_GROUP          = 0x8f;
const RPCS_GET_SCENES         = 0x90;
const RPCS_STORE_SCENE        = 0x91;
const RPCS_RECALL_SCENE       = 0x92;
const RPCS_IDENTIFY_DEVICE    = 0x93;
const RPCS_CHANGE_DEVICE_NAME = 0x94;
const RPCS_REMOVE_DEVICE      = 0x95;

//SRPC AfAddr Addr modes ID's
const AddrNotPresent = 0;
const AddrGroup = 1;
const Addr16Bit = 2;
const Addr64Bit = 3;
const AddrBroadcast = 1;

const power = 1;
const state = 0;

function NinjaSmartPlug(logger,device) {

  // Features of this device
  this.readable = true;
  this.writeable = false;
  this.log = logger;

  // Ninja config
  this.V = 0;
  this.D = 243; //power
  this.G = device.fetchLookupKey();

  this.zigbee = device;
  device.ninjaPower = this;

  var self = this;

  clearInterval(this._iv);
  this._iv = setInterval(function(){
    self.pollForPowerReading();
  },2000);

};

NinjaSmartPlug.prototype.pollForPowerReading = function() {

  var msg = new Buffer(14);
  var msgIdx;

  this.log.info('zigbee.prototype.pollForPowerReading: nwk:' +this.zigbee.nwkAddr +' ep:' +this.zigbee.endPoint);

  //set SRPC len and CMD ID
  msg[SRPC_CMD_ID_POS] = RPCS_GET_POWER_READING;
  msg[SRPC_CMD_LEN_POS] = 12;

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

  this.zigbee.socket.write(msg);
};

/**
 * Change the state of the device (on/off).
 *
 * @param {Boolean} state true if on, false if off
 * @fires zigbee#data       `data` written to SRPC client
 */
NinjaSmartPlug.prototype.setDeviceState = function(state) {
  var msg = new Buffer(15);
  var msgIdx;

  this.log.info('NinjaSmartPlug.prototype.setDeviceState++: nwk:' +this.zigbee.nwkAddr +' ep:' +this.zigbee.endPoint);

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

  this.log.info('NinjaSmartPlug.prototype.setDeviceState: ' +state);

  //set State
  if(state){
      msg[msgIdx++] = 0xFF;
  } else {
      msg[msgIdx++] = 0;
  }
  this.zigbee.socket.write(msg);
};

NinjaSmartPlug.prototype.write = function(data) {
  return false;
};

NinjaSmartPlug.prototype.end = function() {};
NinjaSmartPlug.prototype.close = function() {};