// Required libraries/interfaces/classes
var util = require('util');
var Stream = require('stream');
var ZigbeeDevice = require(__dirname+'/ZigbeeDevice');

// Extend ZigbeeClient class with Stream
util.inherits(ZigbeeClient,Stream);

// Export the ZigbeeClient class
module.exports = ZigbeeClient;

//SRPC header bit positions
const SRPC_CMD_ID_POS = 0;
const SRPC_CMD_LEN_POS = 1;

//SRPC CMD ID's
//define the outgoing (from server) RPSC command ID's
const RPCS_NEW_ZLL_DEVICE     = 0x0001;
const RPCS_DEV_ANNCE          = 0x0002;
const RPCS_SIMPLE_DESC        = 0x0003;
const RPCS_TEMP_READING       = 0x0004;
const RPCS_POWER_READING      = 0x0005;
const RPCS_PING               = 0x0006;
const RPCS_GET_DEV_STATE_RSP  = 0x0007;
const RPCS_GET_DEV_LEVEL_RSP  = 0x0008;
const RPCS_GET_DEV_HUE_RSP    = 0x0009;
const RPCS_GET_DEV_SAT_RSP    = 0x000a;
const RPCS_ADD_GROUP_RSP      = 0x000b;
const RPCS_GET_GROUP_RSP      = 0x000c;
const RPCS_ADD_SCENE_RSP      = 0x000d;
const RPCS_GET_SCENE_RSP      = 0x000e;


//define incoming (to server) RPCS command ID's
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

/**
 * Creates a new Zigbee Client
 *
 * @class Represents a Zigbee Client
 */
function ZigbeeClient(logger) {
  this.writable = true;
  this.readable = true;
  this.log = logger;
  this._devices = {};
};

/**
 * Handles the interation over the data received
 * from the SRPC connection.
 *
 * @param  {String} data Data received from the SRPC
 */
ZigbeeClient.prototype.write = function(data) {
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
ZigbeeClient.prototype.processData = function(msg, msgPtr) {
  debugger;
  var msgLen=0;

  this.log.debug('ZigbeeClient.prototype.processData: '+msg[msgPtr + SRPC_CMD_ID_POS]);
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
      this.log.debug('ZigbeeClient.prototype.processData: nwkAddr ' +nwkAddr);

      //Get the EndPoint
      endPoint = msg[msgPtr++];
      this.log.debug('ZigbeeClient.prototype.processData: endPoint ' +endPoint);

      //Get the ProfileId
      for (var i=0; i < 2; i++, msgPtr++) {
        //javascript does not support unsigned so use a bigger container
        //to avoid conversion issues
        var profileIdTemp = (msg[msgPtr] & 0xff);
        profileId += (profileIdTemp << (8 * i));
      }
      this.log.debug('ZigbeeClient.prototype.processData: profileId ' +profileId);

      //Get the DeviceId
      for (var i=0; i < 2; i++, msgPtr++) {
        //javascript does not support unsigned so use a bigger container
        //to avoid conversion issues
        var deviceIdTemp = (msg[msgPtr] & 0xff);
        deviceId += (deviceIdTemp << (8 * i));
      }
      this.log.debug('ZigbeeClient.prototype.processData: deviceId ' +deviceId);

      // A new device has been found
      var device = new ZigbeeDevice(this.log, profileId, deviceId, nwkAddr, endPoint);

      this.addDevice(device);
      this.emit('device', device);

      //TODO: get/set device name on gateway???
      //TODO: use status

      break;

    //TODO: deal with these and update the color shown on color picker
    case RPCS_GET_DEV_LEVEL_RSP:

      var nwkAddr=0;
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

      //Get the EndPoint
      endPoint = msg[msgPtr++];

      var lvl = msg[msgPtr++];

      var key = [nwkAddr,endPoint].join('')
      var thisZigbeeDevice = this.fetchDevice(key);

      if(thisZigbeeDevice) {
        thisZigbeeDevice.ninja.emit('data',JSON.stringify({bri:lvl}))
      };

      break;
    //TODO: deal with these and update the color shown on color picker
    case RPCS_POWER_READING:

      var nwkAddr=0;
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
      this.log.debug('ZigbeeClient.prototype.processData[RPCS_GET_POWER_READING]: nwkAddr ' +nwkAddr);

      //Get the EndPoint
      endPoint = msg[msgPtr++];
      this.log.debug('ZigbeeClient.prototype.processData[RPCS_GET_POWER_READING]: endPoint ' +endPoint);

      //Get the power
      var power=0;

      for (var i=0; i < 4; i++, msgPtr++) {
        //javascript does not support unsigned so use a bigger container
        //to avoid conversion issues
        var powerTemp = (msg[msgPtr] & 0xff);
        power += (powerTemp << (8 * i));
        this.log.info('ZigbeeClient.prototype.processData[RPCS_GET_POWER_READING]: power: ' +power +' powerTemp:' +powerTemp);
      }
      power = power/100;

      var key = [nwkAddr,endPoint].join('')
      var thisZigbeeDevice = this.fetchDevice(key)

      if(thisZigbeeDevice) {
        this.log.info('emitting power data for ZigbeeDevice: ' +thisZigbeeDevice.nwkAddr +':' +thisZigbeeDevice.endPoint +':' +power );
        thisZigbeeDevice.ninjaPower.emit('data',power.toString())
      }
      else
      {
        this.log.info('ZigbeeClient.prototype.processData[RPCS_GET_POWER_READING]: ZigbeeDevice not defined.');
      };
      break;

   case RPCS_TEMP_READING:

      var nwkAddr=0;
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
      this.log.debug('ZigbeeClient.prototype.processData[RPCS_TEMP_READING]: nwkAddr ' +nwkAddr);

      //Get the EndPoint
      endPoint = msg[msgPtr++];
      this.log.debug('ZigbeeClient.prototype.processData[RPCS_TEMP_READING]: endPoint ' +endPoint);

      //Get the temp
      var tempDegC=0;
      for (var i=0; i < 2; i++, msgPtr++) {
        //javascript does not support unsigned so use a bigger container
        //to avoid conversion issues
        var tempDegCTemp = (msg[msgPtr] & 0xff);
        tempDegC += (tempDegCTemp << (8 * i));
      }

      //ZigBee temp reading is in DegC * 100
      //(Where -273.15°C <= temperature <= 327.67 ºC, corresponding to a
      //MeasuredValue in the range 0x954d to 0x7fff. The maximum resolution this
      //format allows is 0.01 ºC.)
      tempDegC = tempDegC/100;

      var key = [nwkAddr,endPoint].join('')
      var thisZigbeeDevice = this.fetchDevice(key)

      if(thisZigbeeDevice) {
        this.log.info('emitting temp data for ZigbeeDevice: ' +thisZigbeeDevice.nwkAddr +':' +thisZigbeeDevice.endPoint +' tempDegC:' +tempDegC);
        thisZigbeeDevice.ninja.emit('data',tempDegC.toString())
      }
      else
      {
        this.log.info('ZigbeeClient.prototype.processData[RPCS_TEMP_READING]: ZigbeeDevice not defined.');
      };
      break;

    default:
      msgLen = 0;
      break;
  };
  return msgLen;
};

/**
 * Adds a device to the registry for later lookup
 * @param {String} key    Unique key for this device
 * @param {Object} device Instance of ZigbeeDevice
 */

ZigbeeClient.prototype.addDevice = function(device) {
  this._devices[device.fetchLookupKey()] = device;
}

/**
 * Fetches a device based on its key
 * @param   {String} key    Unique key for this device
 * @return {Object} Instance of ZigbeeDevice
 */

ZigbeeClient.prototype.fetchDevice = function(key) {
  return this._devices[key] || null;
}

/**
 * Advises the SRPC server to discover devices
 *
 * @fires ZigbeeClient#data data to be written to the SRPC connection
 */
ZigbeeClient.prototype.discoverDevices = function() {
  var msg = new Buffer(4);
  var msgIdx;
  msg[SRPC_CMD_ID_POS] = RPCS_GET_DEVICES;
  msg[SRPC_CMD_LEN_POS] = 2;

  this.log.debug('discoverDevices');

  this.emit('data',msg);
};

ZigbeeClient.prototype.end = function() {};
ZigbeeClient.prototype.destroy = function() {};