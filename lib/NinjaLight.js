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
  device.ninja = this;

  var self = this;

  setTimeout(function() {
    var dataObject = new Object();
    dataObject.on = false;
    dataObject.hue = 0
    dataObject.sat = 0
    dataObject.bri = 0;
    data = JSON.stringify(dataObject);
    // On next tick let the system know we exist
    self.emit('data', data) }
  , 1000);
};

NinjaLight.prototype.write = function(data) {
  var dataObject = JSON.parse(data);

  var hue = dataObject.hue >> 8
    , sat = dataObject.sat
    , level = dataObject.bri;
  if (dataObject.on == false) {
    level = 0;
  }

  this.log.info('Actuating '+this.zigbee.type+' H:'+hue+' S:'+sat+' L:'+level);

  this.log.info('setDeviceState');
  this.setDeviceState(true);
  this.log.info('setDeviceLevel');
  this.setDeviceLevel(level,10);
  this.log.info('setDeviceColour');
  this.setDeviceColour(hue,sat,10);

  // Let Ninja know we have changed colour.
  // TODO: not blindly assume the colour was changed successfully.
  this.emit('data',data);

  return true;
};

NinjaLight.prototype.updateState = function(state) {

  this.emit('data',JSON.stringify(state));
}

NinjaLight.prototype.end = function() {};
NinjaLight.prototype.close = function() {};


/**
 * Alter the hue and saturation of this device over a given period of time.
 *
 * @param {Number} hue            uint8 representation of the hue
 * @param {Number} saturation     uint8 representation of the saturation
 * @param {Number} transitionTime uint16 amount of time to take in transition
 * @fires zigbee#data       `data` written to SRPC client
 */

NinjaLight.prototype.setDeviceColour = function(hue, saturation, transitionTime) {
  var msg = new Buffer(18);
  var msgIdx;

  this.log.debug('zigbee.prototype.setDeviceColour++');

  //set SRPC len and CMD ID
  msg[SRPC_CMD_ID_POS] = RPCS_SET_DEV_COLOR;
  msg[SRPC_CMD_LEN_POS] = 16;
  //set ptr to point to data
  msgIdx=2;

  //dstAddr.addrMode = Addr16Bit
  msg[msgIdx++] = Addr16Bit;
  //set afAddrMode_t nwk address
  msg[msgIdx++] = (this.nwkAddr & 0xFF);
  msg[msgIdx++] = ((this.nwkAddr & 0xFF00)>>8);
  //pad for an ieee addr size;
  msgIdx += 6;
  //set Ep
  msg[msgIdx++] = this.endPoint;
  //pad out pan ID
  msgIdx+=2;

  //set level
  msg[msgIdx++] = hue;

  //set saturation
  msg[msgIdx++] = saturation;

  //set transitionTime
  msg[msgIdx++] = (transitionTime & 0xFF);
  msg[msgIdx++] = ((transitionTime & 0xFF00)>>8);

  this.log.debug('zigbee.prototype.setDeviceColour: ' + hue + '-' + saturation);

  this.zigbee.socket.write(msg);
}


/**
 * Change the level of the device.
 *
 * @param {Number} level          uint8 the level (brightness)
 * @param {Number} transitionTime uint16 amount of time to take in transition
 * @fires zigbee#data       `data` written to SRPC client
 */
NinjaLight.prototype.setDeviceLevel = function(level, transitionTime) {
    var msg = new Buffer(17);
    var msgIdx;

    this.log.debug('zigbee.setDeviceLevel.setDeviceColour++');

    //set SRPC len and CMD ID
    msg[SRPC_CMD_ID_POS] = RPCS_SET_DEV_LEVEL;
    msg[SRPC_CMD_LEN_POS] = 15;

    //set ptr to point to data
    msgIdx=2;

    //dstAddr.addrMode = Addr16Bit
    msg[msgIdx++] = Addr16Bit;
    //set afAddrMode_t nwk address
    msg[msgIdx++] = (this.nwkAddr & 0xFF);
    msg[msgIdx++] = ((this.nwkAddr & 0xFF00)>>8);
    //pad for an ieee addr size;
    msgIdx += 6;
    //set Ep
    msg[msgIdx++] = this.endPoint;
    //pad out pan ID
    msgIdx+=2;

    //set level
    msg[msgIdx++] = level;

    //set transitionTime
    msg[msgIdx++] = (transitionTime & 0xFF);
    msg[msgIdx++] = ((transitionTime & 0xFF00)>>8);

    this.log.debug('zigbee.prototype.setDeviceLevel: ' +level);

    this.zigbee.socket.write(msg);
};

/**
 * Change the state of the device (on/off).
 *
 * @param {Boolean} state true if on, false if off
 * @fires zigbee#data       `data` written to SRPC client
 */
NinjaLight.prototype.setDeviceState = function(state) {
  var msg = new Buffer(15);
  var msgIdx;

  this.log.info('zigbee.prototype.setDeviceState++');

  //set SRPC len and CMD ID
  msg[SRPC_CMD_ID_POS] = RPCS_SET_DEV_STATE;
  msg[SRPC_CMD_LEN_POS] = 13;

  //set ptr to point to data
  msgIdx=2;

  //dstAddr.addrMode = Addr16Bit
  msg[msgIdx++] = Addr16Bit;
  //set afAddrMode_t nwk address
  msg[msgIdx++] = (this.nwkAddr & 0xFF);
  msg[msgIdx++] = ((this.nwkAddr & 0xFF00)>>8);
  //pad for an ieee addr size;
  msgIdx += 6;
  //set Ep
  msg[msgIdx++] = this.endPoint;
  //pad out pan ID
  msgIdx+=2;

  this.log.info('zigbee.prototype.setDeviceState: ' +state);

  //set State
  if(state){
      msg[msgIdx++] = 0xFF;
  } else {
      msg[msgIdx++] = 0;
  }
  this.zigbee.socket.write(msg);
};