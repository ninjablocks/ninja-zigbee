// Required libraries/interfaces/classes
var util = require('util');
var Stream = require('stream');
var ZigbeeDevice = require(__dirname+'/ZigbeeDevice');
var binary = require('binary');
var log4js = require('log4js');

var ZigbeeProfileStore = require(__dirname+'/ZigbeeProfileStore');

// Extend ZigBeeClient class with Stream
util.inherits(ZigBeeClient,Stream);

// Export the ZigBeeClient class
module.exports = ZigBeeClient;


var ZllDeviceIdx = 1;
var ZigBeeDeviceIdx = 1;

//SRPC header bit positions
var SRPC_CMD_ID_POS = 0;
var SRPC_CMD_LEN_POS = 1;

//SRPC CMD ID's
//define the outgoing (from server) RPSC command ID's
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
var RPCS_HUMID_READING      = 0x000f;
var RPCS_ZONESTATE_CHANGE   = 0x0010;

//define incoming (to server) RPCS command ID's
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

/**
 * Creates a new Zigbee Client
 *
 * @class Represents a Zigbee Client
 */
function ZigBeeClient(logger) {

  var self = this;

  this.writable = true;
  this.readable = true;
  this.log = log4js.getLogger('ZB - ZigbeeClient');

  this._profileStore = new ZigbeeProfileStore(logger, 'ha');

  this._profileStore.on('ready', function() {
    self.emit('ready');
  });

  //*
  setTimeout(function() {
    var relay = [1,33,161,194,1,4,1,9,0,0,0,1,173,0,0,0,0,96,80,131,0,0,0,96,0,0,0,0,0,0,0,96,2,0,0];
    var onOffSwitch = [1,33,151,186,2,4,1,3,1,0,0,1,235,0,0,0,0,144,80,131,109,112,108,101,68,101,115,99,82,115,112,58,32,32,149];

    self.write(new Buffer(onOffSwitch));
     self.write(new Buffer(relay));
  }, 1000);
  //*/
}

/**
 * Handles the interation over the data received
 * from the SRPC connection.
 *
 * @param  {String} data Data received from the SRPC
 */
ZigBeeClient.prototype.write = function(data) {
  // XXX: TODO: Can multiple messages arrive at once?
  this.log.debug('Processing msg');
  this.processData(data);
};

/**
 * Processes the data received from the SRPC connection.
 *
 * @param  {String} msg    Data received
 * @fires device Zigbee device/cluster description description
 *           message Parly parsed zigbee message
 *
 * TODO: Fix the comments.
 */
ZigBeeClient.prototype.processData = function(msg) {

  this.log.trace('Incoming ZigBee message', JSON.stringify(msg));

  // E.g .
  // [1,33,161,194,1,4,1,9,0,0,0,1,173,0,0,0,0,96,80,131,0,0,0,96,0,0,0,0,0,0,0,96,2,0,0]

  var reader = binary.parse(msg)
    .word8('command')
    .word8('unknown') // What is this?
    .word16lu('networkAddress')
    .word8('endPoint')
    .word16lu('profileId')
    .word16lu('deviceId');

  delete(reader.vars.unknown);

  var address = reader.vars.networkAddress + ':' + reader.vars.endPoint;

  this.log.debug('Parsed message header : ', JSON.stringify(reader.vars));

  var deviceDescription = this._profileStore.getDevice(reader.vars.profileId, reader.vars.deviceId);

  if (reader.vars.command == RPCS_NEW_ZLL_DEVICE) {
    this.emit('device', address, reader.vars, deviceDescription);
  }

  this.emit('message', address, reader);
};

/**
 * Advises the SRPC server to discover devices
 *
 * @fires ZigbeeClient#data data to be written to the SRPC connection
 */
ZigBeeClient.prototype.discoverDevices = function() {
  this.log.debug('Discovering Devices');

  this.emit('data',new Buffer([RPCS_GET_DEVICES, 2, 0, 0]));
};

ZigBeeClient.prototype.end = function() {};
ZigBeeClient.prototype.destroy = function() {};
