// Required libraries/interfaces/classes
var util = require('util');
var Stream = require('stream');
var ZigbeeDevice = require(__dirname+'/ZigbeeDevice');

// Extend ZigBeeClient class with Stream
util.inherits(ZigBeeClient,Stream);

// Export the ZigBeeClient class
module.exports = ZigBeeClient;


var DEVICES = {};
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
  this.writable = true;
  this.readable = true;
  this.log = logger;
  
  var self = this;          
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

      //if device not already registered
      this.log.info('ZigBeeClient.prototype.processData: registering device ' +device +':' +DEVICES[nwkAddr.toString()+endPoint.toString()]);
      if(DEVICES[nwkAddr.toString()+endPoint.toString()] == null)
      {
        // A new device has been found
        var device = new ZigbeeDevice(this.log, profileId, deviceId, nwkAddr, endPoint);
        this.emit('device', device);
        
        DEVICES[nwkAddr.toString()+endPoint.toString()] = device;
      }

      break;


    //TODO: deal with these and update the color shown on color picker        
    case RPCS_GET_DEV_STATE_RSP:
      var nwkAddr=0, endPoint=0, state=0;
      
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
      
      //Get the state
      state = msg[msgPtr++];
      this.log.debug('ZigBeeClient.prototype.processData: state ' +state);   
      
      var dataObject = new Object();
      if(state > 0)
      {
        dataObject.on = true;
      }
      else
      {
        dataObject.on = false;
      }
      
      data = JSON.stringify(dataObject);

      var thisZigbeeDevice = DEVICES[nwkAddr.toString()+endPoint.toString()];      
      if(thisZigbeeDevice) {
        this.log.debug('emitting state data for ZigbeeDevice: ' +thisZigbeeDevice.nwkAddr +':' +thisZigbeeDevice.endPoint +' state:' +state);
        thisZigbeeDevice.ninja.emit('data',data);
        thisZigbeeDevice.waitingRsp = 0;       
      }
      else
      {
        this.log.debug('ZigBeeClient.prototype.processData[RPCS_GET_DEV_STATE_RSP]: ZigbeeDevice ' +nwkAddr.toString()+endPoint.toString() +' not defined.');
      };
         
      break;
          
    case RPCS_GET_DEV_LEVEL_RSP:
      var nwkAddr=0, endPoint=0, level=0;
      
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
      
      //Get the level
      level = msg[msgPtr++];
      this.log.debug('ZigBeeClient.prototype.processData: level ' +level);   
      
      var dataObject = new Object();
      dataObject.bri = level;
      
      data = JSON.stringify(dataObject);

      var thisZigbeeDevice = DEVICES[nwkAddr.toString()+endPoint.toString()];      
      if(thisZigbeeDevice) {
        this.log.debug('emitting level data for ZigbeeDevice: ' +thisZigbeeDevice.nwkAddr +':' +thisZigbeeDevice.endPoint +' level:' +level);
        thisZigbeeDevice.ninja.emit('data',data);
        thisZigbeeDevice.waitingRsp = 0;     
      }
      else
      {
        this.log.debug('ZigBeeClient.prototype.processData[RPCS_GET_DEV_LEVEL_RSP]: ZigbeeDevice ' +nwkAddr.toString()+endPoint.toString() +' not defined.');
      };
               
      break;    
      
    case RPCS_GET_DEV_HUE_RSP:
      var nwkAddr=0, endPoint=0, hue=0;
      
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
      
      //Get the hue
      hue = msg[msgPtr++];
      this.log.debug('ZigBeeClient.prototype.processData: hue ' +hue);   
      
      var dataObject = new Object();
      //cloud expects 16b hue so <<8
      dataObject.hue = hue<<8;
      
      data = JSON.stringify(dataObject);

      var thisZigbeeDevice = DEVICES[nwkAddr.toString()+endPoint.toString()];      
      if(thisZigbeeDevice) {
        this.log.info('emitting level data for ZigbeeDevice: ' +thisZigbeeDevice.nwkAddr +':' +thisZigbeeDevice.endPoint +' hue:' +hue +'thisZigbeeDevice.waitingRsp:' +thisZigbeeDevice.waitingRsp);
        thisZigbeeDevice.ninja.emit('data',data); 
        thisZigbeeDevice.waitingRsp = 0;
      }
      else
      {
        this.log.debug('ZigBeeClient.prototype.processData[RPCS_GET_DEV_LEVEL_RSP]: ZigbeeDevice ' +nwkAddr.toString()+endPoint.toString() +' not defined.');
      };
               
      break;   
          
    case RPCS_GET_DEV_SAT_RSP:
      var nwkAddr=0, endPoint=0, sat=0;
      
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
      
      //Get the hue
      sat = msg[msgPtr++];
      this.log.debug('ZigBeeClient.prototype.processData: sat ' +sat);   
      
      var dataObject = new Object();
      dataObject.sat = sat;
      
      data = JSON.stringify(dataObject);

      var thisZigbeeDevice = DEVICES[nwkAddr.toString()+endPoint.toString()];      
      if(thisZigbeeDevice) {
        this.log.debug('emitting level data for ZigbeeDevice: ' +thisZigbeeDevice.nwkAddr +':' +thisZigbeeDevice.endPoint +' sat:' +sat);
        thisZigbeeDevice.ninja.emit('data',data);
        thisZigbeeDevice.waitingRsp = 0;     
      }
      else
      {
        this.log.debug('ZigBeeClient.prototype.processData[RPCS_GET_DEV_LEVEL_RSP]: ZigbeeDevice ' +nwkAddr.toString()+endPoint.toString() +' not defined.');
      };
               
      break;   
      
    default:
      msgLen = msg[msgPtr + SRPC_CMD_LEN_POS] + 2;
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