// Required libraries/interfaces/classes
var util = require('util');
var Stream = require('stream');
var ZigbeeDevice = require(__dirname+'/ZigbeeDevice');

// Extend ZigBeeClient class with Stream
util.inherits(ZigBeeClient,Stream);

// Export the ZigBeeClient class
module.exports = ZigBeeClient;

//SRPC header bit positions
var SRPC_CMD_ID_POS = 0;
var SRPC_CMD_LEN_POS = 1;

//SRPC CMD ID's
//define the outgoing RPSC command ID's
var RPCS_NEW_ZLL_DEVICE     = 0x01;
var RPCS_DEV_ANNCE		      = 0x02;
var RPCS_SIMPLE_DESC	      = 0x03;
var RPCS_TEMP_READING       = 0x04;
var RPCS_POWER_READING      = 0x05;
var RPCS_PING               = 0x06;
var RPCS_GET_DEV_STATE_RSP  = 0x07;
var RPCS_GET_DEV_LEVEL_RSP  = 0x08;
var RPCS_GET_DEV_HUE_RSP    = 0x09;
var RPCS_GET_DEV_SAT_RSP    = 0x0a;
var RPCS_ADD_GROUP_RSP      = 0x0b;
var RPCS_GET_GROUP_RSP      = 0x0c;
var RPCS_ADD_SCENE_RSP      = 0x0d;
var RPCS_GET_SCENE_RSP      = 0x0e;

var RPCS_GET_DEVICES        = 0x81;

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
  this.writable = true;
  this.readable = true;
  this.log = logger;
};

/**
 * Handles the interation over the data received
 * from the SRPC connection.
 *
 * @param  {String} data Data received from the SRPC
 */
ZigBeeClient.prototype.write = function(data) {
  var bytesRead = data.length;
  var bytesProcessed = 0;

  while (bytesRead > bytesProcessed) {
    bytesProcessed += this.processData(data, bytesProcessed);
  }
};

/**
 * Processes the data received from the SRPC connection.
 *
 * @param  {String} msg    Data received
 * @param  {Number} msgPtr Number of bytes processed
 * @fires ZigbeeClient#device instance of ZigbeeDevice on new device found.
 */
ZigBeeClient.prototype.processData = function(msg, msgPtr) {
  debugger;
  var msgLen=0;

  this.log.debug('ZigBeeClient.prototype.processData: '+msg[msgPtr + SRPC_CMD_ID_POS]);
  switch (msg[msgPtr + SRPC_CMD_ID_POS]) {

    case RPCS_NEW_ZLL_DEVICE:
      var profileId=0, deviceId=0, nwkAddr=0;
      var endPoint;
      msgLen = msg[msgPtr + SRPC_CMD_LEN_POS] + 2;
      //index passed len, cmd ID and status
      msgPtr+=2;

      //Get the NwkAddr
      for (var i=0; i < 2; i++, msgPtr++) {
        //javascript does not support unsigned so use a bigger container
        //to avoid conversion issues
        var nwkAddrTemp = (msg[msgPtr] & 0xff);
        nwkAddr += (nwkAddrTemp << (8 * i));
      }
      this.log.debug('ZigBeeClient.prototype.processData: nwkAddr ' +nwkAddr);

      //Get the EndPoint
      endPoint = msg[msgPtr++];
      this.log.debug('ZigBeeClient.prototype.processData: endPoint ' +endPoint);

      //Get the ProfileId
      for (var i=0; i < 2; i++, msgPtr++) {
        //javascript does not support unsigned so use a bigger container
        //to avoid conversion issues
        var profileIdTemp = (msg[msgPtr] & 0xff);
        profileId += (profileIdTemp << (8 * i));
      }
      this.log.debug('ZigBeeClient.prototype.processData: profileId ' +profileId);

      //Get the DeviceId
      for (var i=0; i < 2; i++, msgPtr++) {
        //javascript does not support unsigned so use a bigger container
        //to avoid conversion issues
        var deviceIdTemp = (msg[msgPtr] & 0xff);
        deviceId += (deviceIdTemp << (8 * i));
      }
      this.log.debug('ZigBeeClient.prototype.processData: deviceId ' +deviceId);


      // A new device has been found
      var device = new ZigbeeDevice(this.log, profileId, deviceId, nwkAddr, endPoint);
      this.emit('device', device);

      //TODO: get/set device name on gateway???
      //TODO: use status

      break;

    //TODO: deal with these and update the color shown on color picker
    case RPCS_GET_DEV_COLOR_RSP:
    case RPCS_GET_DEV_STATE_RSP:
    case RPCS_GET_DEV_LEVEL_RSP:

    default:
      msgLen = 0;
      break;
  };
  return msgLen;
};

/**
 * Advises the SRPC server to discover devices
 *
 * @fires ZigbeeClient#data data to be written to the SRPC connection
 */
ZigBeeClient.prototype.discoverDevices = function() {
  var msg = new Buffer(4);
  var msgIdx;
  msg[SRPC_CMD_ID_POS] = RPCS_GET_DEVICES;
  msg[SRPC_CMD_LEN_POS] = 2;

  this.log.debug('discoverDevices');

  this.emit('data',msg);
};

ZigBeeClient.prototype.end = function() {};
ZigBeeClient.prototype.destroy = function() {};