// Required libraries/interfaces/classes
var Stream = require('stream');
var util = require('util');

// Inherit Stream 'interface'
util.inherits(ZigbeeDevice,Stream);

// Export the class
module.exports = ZigbeeDevice;

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
var Addr16Bit = 2;

var LightDeviceIdx = 1;

/**
 * Creates a new Zigbee Device
 *
 * @class Represents a Zigbee Device
 * @param {Number} ProfileId   Profile ID
 * @param {Number} DeviceId    Device ID
 * @param {Number} NetworkAddr Network Address
 * @param {Number} EndPoint    End Point
 */
function ZigbeeDevice(logger, ProfileId, DeviceId, NetworkAddr, EndPoint) {

  this.readable = true;

  this.profileId = ProfileId;
  this.deviceId = DeviceId;
  this.nwkAddr = NetworkAddr;
  this.endPoint = EndPoint;
  this.type = "";
  this.name = "";
    
  this.log = logger;

    // Would be better to get the device name from the device!
  if(ProfileId == 0xc05e) //ZLL Profile Lights
  {
    switch (DeviceId) {
  		case (0x0000):
  		{
  			//An On off Light
  			Type = "On/Off Light";
  			//set a default name that can be renamed later and stored in the hub
  			Name= (LightDeviceIdx+1) + ": On/Off Light";
  			break;
  		}
  		case (0x0010):
  		{
  			//An On Off Plug-In unit
  			Type = "On/Off Plug";
  			//set a default name that can be renamed later and stored in the hub
  			Name= (LightDeviceIdx+1) + ": On/Off Plug";
  			break;
  		}
  		case (0x0100):
  		{
  			//A Dimmable Light
  			Type = "Dimmable Light";
  			//set a default name that can be renamed later and stored in the hub
  			Name= (LightDeviceIdx+1) + ": Dimmable Light";
  			break;
  		}
  		case (0x0110):
  		{
  			//A Dimmable Plug-In unit
  			Type = "Dimmable Plug";
  			//set a default name that can be renamed later and stored in the hub
  			Name= (LightDeviceIdx+1) + ": Dimmable Plug";
  			break;
  		}
  		case (0x0200):
  		{
  			//A Color Light
  			Type = "Color Light";
  			//set a default name that can be renamed later and stored in the hub
  			Name= (LightDeviceIdx+1) + ": Color Light";
  			break;
  		}
  		case (0x0210):
  		{
  			//An Extended Color Light
  			Type = "Extended Color Light";
  			//set a default name that can be renamed later and stored in the hub
  			Name = (LightDeviceIdx+1) + ": Extended Color Light";
  			break;
  		}
  		case (0x0220):
  		{
  			//An Color Temp Light
  			Type = "Color Temp Light";
  			//set a default name that can be renamed later and stored in the hub
  			Name= (LightDeviceIdx+1) + ": Color Temp Light";
  			break;
  		}
  		case (0x0800):
  		{
  			//A Color Controller
  			Type = "Color Controller";
  			//set a default name that can be renamed later and stored in the hub
  			Name= (LightDeviceIdx+1) + ": Color Controller";
  			break;
  		}
  		case (0x0810):
  		{
  			//A Color Scene Controller
  			Type = "Color Scene Controller";
  			//set a default name that can be renamed later and stored in the hub
  			Name= (LightDeviceIdx+1) + ": Color Scene Controller";
  			break;
  		}
  		case (0x0820):
  		{
  			//A Dimmable Scene Controller
  			Type = "Dimmable Scene Controller";
  			//set a default name that can be renamed later and stored in the hub
  			Name= (LightDeviceIdx+1) + ": Dimmable Scene Controller";
  			break;
  		}
  		case (0x0830):
  		{
  			//A Dimmable Controller
  			Type = "Dimmable Controller";
  			//set a default name that can be renamed later and stored in the hub
  			Name= (LightDeviceIdx+1) + ": Dimmable Controller";
  			break;
  		}
  		case (0x0840):
  		{
  			//A Control Bridge
  			Type = "Control Bridge";
  			//set a default name that can be renamed later and stored in the hub
  			Name= (LightDeviceIdx+1) + ": Control Bridge";
  			break;
  		}
  		case (0x0850):
  		{
  			//An On/Off Sensor
  			Type = "On/Off Sensor";
  			//set a default name that can be renamed later and stored in the hub
  			Name= (LightDeviceIdx+1) + ": On/Off Sensor";
  			break;
  		}
      default:
      {
        Type = "Unknown Device";
        Name="Unknown";
        break;
      }
    }
  	this.type = Type;
    this.name = Name;    
  }
  else if(ProfileId == 0x0104) //HA Profile Lights
  {
    switch (DeviceId)
    {
   		case (0x0100):
  		{
  			Type = "On/Off Light";
  			//set a default name that can be renamed later and stored in the hub
  			Name = (LightDeviceIdx+1) + ": " + "On/Off Light";
  			break;
  		}
   		case (0x0101):
  		{
  			Type = "Dimmable Light";
  			//set a default name that can be renamed later and stored in the hub
  			Name = (LightDeviceIdx+1) + ": " + "Dimmable Light";
  			break;
  		}
   		case (0x0102):
  		{
  			Type = "Color Dimmable Light";
  			//set a default name that can be renamed later and stored in the hub
  			Name = (LightDeviceIdx+1) + ": " + "Color Dimmable Light";  		  
  			break;
  		}
  		default:
      {
        Type = "Unknown Device";
        Name="Unknown";
        break;
      }
  	}
  	this.type = Type;
    this.name = Name;  	
  }
  
  this.log.debug('ZigbeeDevice: New device ' +this.name);
};

/**
 * Alter the hue and saturation of this device over a given period of time.
 *
 * @param {Number} hue            uint8 representation of the hue
 * @param {Number} saturation     uint8 representation of the saturation
 * @param {Number} transitionTime uint16 amount of time to take in transition
 * @fires ZigbeeDevice#data       `data` written to SRPC client
 */
ZigbeeDevice.prototype.setDeviceColour = function(hue, saturation, transitionTime) {
  var msg = new Buffer(18);
  var msgIdx;

  this.log.debug('ZigbeeDevice.prototype.setDeviceColour++');

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

  this.log.debug('ZigbeeDevice.prototype.setDeviceColour: ' + hue + '-' + saturation);

  this.emit('data',msg);
};

/**
 * Change the level of the device.
 *
 * @param {Number} level          uint8 the level (brightness)
 * @param {Number} transitionTime uint16 amount of time to take in transition
 * @fires ZigbeeDevice#data       `data` written to SRPC client
 */
ZigbeeDevice.prototype.setDeviceLevel = function(level, transitionTime) {
  var msg = new Buffer(17);
  var msgIdx;

  this.log.debug('ZigbeeDevice.setDeviceLevel.setDeviceColour++');

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

  this.log.debug('ZigbeeDevice.prototype.setDeviceLevel: ' +level);

  this.emit('data',msg);
};

/**
 * Change the state of the device (on/off).
 *
 * @param {Boolean} state true if on, false if off
 * @fires ZigbeeDevice#data       `data` written to SRPC client
 */
ZigbeeDevice.prototype.setDeviceState = function(state) {
  var msg = new Buffer(15);
  var msgIdx;

  this.log.debug('ZigbeeDevice.prototype.setDeviceState++');

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

  this.log.debug('ZigbeeDevice.prototype.setDeviceState: ' +state);

  //set State
  if(state){
      msg[msgIdx++] = 0xFF;
  } else {
      msg[msgIdx++] = 0;
  }
  this.emit('data',msg);
};

/**
 * Get the state of the device (on/off).
 *
 * @fires ZigbeeDevice#data       `data` written to SRPC client
 */
ZigbeeDevice.prototype.getDeviceState = function(state) {
  var msg = new Buffer(14);
  var msgIdx;

  this.log.debug('ZigbeeDevice.prototype.getDeviceState++');

  //set SRPC len and CMD ID
  msg[SRPC_CMD_ID_POS] = RPCS_GET_DEV_STATE;
  msg[SRPC_CMD_LEN_POS] = 12;

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

  this.log.debug('ZigbeeDevice.prototype.setDeviceState: ');

  this.emit('data',msg);
};

/**
 * Get the level of the device.
 *
 * @fires ZigbeeDevice#data       `data` written to SRPC client
 */
ZigbeeDevice.prototype.getDeviceLevel = function(state) {
  var msg = new Buffer(14);
  var msgIdx;

  this.log.debug('ZigbeeDevice.prototype.getDeviceLevel++');

  //set SRPC len and CMD ID
  msg[SRPC_CMD_ID_POS] = RPCS_GET_DEV_LEVEL;
  msg[SRPC_CMD_LEN_POS] = 12;

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

  this.log.debug('ZigbeeDevice.prototype.setDeviceLevel: ');

  this.emit('data',msg);
};

/**
 * Get the hue of the device.
 *
 * @fires ZigbeeDevice#data       `data` written to SRPC client
 */
ZigbeeDevice.prototype.getDeviceHue = function(state) {
  var msg = new Buffer(14);
  var msgIdx;

  this.log.debug('ZigbeeDevice.prototype.setDeviceHue++');

  //set SRPC len and CMD ID
  msg[SRPC_CMD_ID_POS] = RPCS_GET_DEV_HUE;
  msg[SRPC_CMD_LEN_POS] = 12;

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

  this.emit('data',msg);
};

/**
 * Get the sat of the device.
 *
 * @fires ZigbeeDevice#data       `data` written to SRPC client
 */
ZigbeeDevice.prototype.getDeviceSat = function(state) {
  var msg = new Buffer(14);
  var msgIdx;

  this.log.debug('ZigbeeDevice.prototype.getDeviceSat++');

  //set SRPC len and CMD ID
  msg[SRPC_CMD_ID_POS] = RPCS_GET_DEV_SAT;
  msg[SRPC_CMD_LEN_POS] = 12;

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

  this.emit('data',msg);
};