// Required libraries/interfaces/classes
var Stream = require('stream');
var util = require('util');

// Inherit Stream 'interface'
util.inherits(ZigbeeDevice,Stream);

// Export the class
module.exports = ZigbeeDevice;

//SRPC header bit positions
const SRPC_CMD_ID_POS = 0;
const SRPC_CMD_LEN_POS = 1;

//SRPC CMD ID's
//define the outgoing RPSC command ID's
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
const Addr16Bit = 2;

const ZllDeviceIdx = 1;
const ZigBeeDeviceIdx = 1;


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

    this.log = logger;

    this.log.debug('Creating ZigbeeDevice: ' +NetworkAddr +':' +EndPoint );

    // Would be better to get the device name from the device!
    //CHECK PROFILE ID AS WELL, HUE USES ZLL PROFILE ID!!!!
    if(ProfileId == 0xc05e) //ZLL
    {
      switch (DeviceId)
      {
    		case (0x0000):
    		{
    			//An On off Light
    			Type = "ZLL On/Off Light";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": ZLL On/Off Light";
    			break;
    		}
    		case (0x0010):
    		{
    			//An On Off Plug-In unit
    			Type = "ZLL On/Off Plug";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": ZLL On/Off Plug";
    			break;
    		}
    		case (0x0100):
    		{
    			//A Dimmable Light
    			Type = "ZLL Dimmable Light";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": ZLL Dimmable Light";
    			break;
    		}
    		case (0x0110):
    		{
    			//A Dimmable Plug-In unit
    			Type = "ZLL Dimmable Plug";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": ZLL Dimmable Plug";
    			break;
    		}
    		case (0x0200):
    		{
    			//A Color Light
    			Type = "ZLL Color Light";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": ZLL Color Light";
    			break;
    		}
    		case (0x0210):
    		{
    			//An Extended Color Light
    			Type = "ZLL Extended Color Light";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": ZLL Extended Color Light";
    			break;
    		}
    		case (0x0220):
    		{
    			//An Color Temp Light
    			Type = "ZLL Color Temp Light";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": ZLL Color Temp Light";
    			break;
    		}
    		case (0x0800):
    		{
    			//A Color Controller
    			Type = "ZLL Color Controller";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": ZLL Color Controller";
    			break;
    		}
    		case (0x0810):
    		{
    			//A Color Scene Controller
    			Type = "ZLL Color Scene Controller";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": ZLL Color Scene Controller";
    			break;
    		}
    		case (0x0820):
    		{
    			//A Dimmable Scene Controller
    			Type = "ZLL Dimmable Scene Controller";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": ZLL Dimmable Scene Controller";
    			break;
    		}
    		case (0x0830):
    		{
    			//A Dimmable Controller
    			Type = "ZLL Dimmable Controller";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": ZLL Dimmable Controller";
    			break;
    		}
    		case (0x0840):
    		{
    			//A Control Bridge
    			Type = "ZLL Control Bridge";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": ZLL Control Bridge";
    			break;
    		}
    		case (0x0850):
    		{
    			//An On/Off Sensor
    			Type = "ZLL On/Off Sensor";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZllDeviceIdx+1) + ": On/Off Sensor";
    			break;
    		}
        default:
        {
          Type = "Unknown Device";
          Name="Unknown";
          break;
        }
      }
    }
    else if(ProfileId == 0x0104) //ZLL
    {
      switch (DeviceId)
      {
    		case (0x0000):
    		{
    			Type = "On/Off Switch";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "On/Off Switch";
    			break;
    		}
    		case (0x0001):
    		{
    			Type = "Level Control Switch";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Level Control Switch";
    			break;
    		}
    		case (0x0002):
    		{
    			Type = "On/Off Output";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "On/Off Output";
    			break;
    		}
    		case (0x0003):
    		{
    			Type = "Level Controllable Output";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Level Controllable Output";
    			break;
    		}
    		case (0x0004):
    		{
    			Type = "Scene Selector";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Scene Selector";
    			break;
    		}
    		case (0x0005):
    		{
    			Type = "Configuration Tool";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Configuration Tool";
    			break;
    		}
    		case (0x0006):
    		{
    			Type = "Remote Control";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Remote Control";
    			break;
    		}
    		case (0x0007):
    		{
    			Type = "Combined Interface";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Combined Interface";
    			break;
    		}
    		case (0x0008):
    		{
    			Type = "Range Extender";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Range Extender";
    			break;
    		}
    		case (0x0009):
    		{
    			Type = "Mains Power Outlet";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Mains Power Outlet";
    			break;
    		}
    		case (0x000A):
    		{
    			Type = "Door Lock";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Door Lock";
    			break;
    		}
    		case (0x000B):
    		{
    			Type = "Door Lock Controller";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Door Lock Controller";
    			break;
    		}
     		case (0x000C):
    		{
    			Type = "Simple Sensor";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Simple Sensor";
    			break;
    		}
     		case (0x000D):
    		{
    			Type = "Consumption Awareness Device";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Consumption Awareness Device";
    			break;
    		}
     		case (0x0050):
    		{
    			Type = "Home Gateway";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Home Gateway";
    			break;
    		}
     		case (0x0051):
    		{
    			Type = "Smart plug";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Smart plug";
    			break;
    		}
     		case (0x0052):
    		{
    			Type = "White Goods";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "White Goods";
    			break;
    		}
     		case (0x0053):
    		{
    			Type = "Meter Interface";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Meter Interface";
    			break;
    		}
     		case (0x0100):
    		{
    			Type = "On/Off Light";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "On/Off Light";
    			break;
    		}
     		case (0x0101):
    		{
    			Type = "Dimmable Light";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Dimmable Light";
    			break;
    		}
     		case (0x0102):
    		{
    			Type = "Color Dimmable Light";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Color Dimmable Light";
    			break;
    		}
     		case (0x0103):
    		{
    			Type = "On/Off Light Switch";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "On/Off Light Switch";
    			break;
    		}
     		case (0x0104):
    		{
    			Type = "Dimmer Switch";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Dimmer Switch";
    			break;
    		}
     		case (0x0105):
    		{
    			Type = "Color Dimmer Switch";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Color Dimmer Switch";
    			break;
    		}
     		case (0x0106):
    		{
    			Type = "Light Sensor";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Light Sensor";
    			break;
    		}
     		case (0x0107):
    		{
    			Type = "Occupancy Sensor";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Occupancy Sensor";
    			break;
    		}
     		case (0x0200):
    		{
    			Type = "Shade";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Shade";
    			break;
    		}
     		case (0x0201):
    		{
    			Type = "Shade Controller";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Shade Controller";
    			break;
    		}
     		case (0x0202):
    		{
    			Type = "Window Covering Device";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Window Covering Device";
    			break;
    		}
     		case (0x0203):
    		{
    			Type = "Window Covering Controller";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Window Covering Controller";
    			break;
    		}
     		case (0x0300):
    		{
    			Type = "Heating/Cooling Unit";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Heating/Cooling Unit";
    			break;
    		}
        case (0x0301):
    		{
    			Type = "Thermostat";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Thermostat";
    			break;
    		}
        case (0x0302):
    		{
    			Type = "Temperature Sensor";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Temperature Sensor";
    			break;
    		}
        case (0x0303):
    		{
    			Type = "Pump";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Pump";
    			break;
    		}
        case (0x0304):
    		{
    			Type = "Pump Controller";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Pump Controller";
    			break;
    		}
        case (0x0305):
    		{
    			Type = "Pressure Sensor";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Pressure Sensor";
    			break;
    		}
        case (0x0306):
    		{
    			Type = "Flow Sensor";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Flow Sensor";
    			break;
    		}
        case (0x0307):
    		{
    			Type = "Mini Split AC";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Mini Split AC";
    			break;
    		}
    		//reserved in Zigbee, but used by some vendors for a device with temp and huniditty sensing
        case (0x03FE):
    		{
    			Type = "Temperature Sensor";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "Temperature Sensor";
    			break;
    		}
        case (0x0400):
    		{
    			Type = "IAS Control and Indicating Equipment ";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "IAS Control and Indicating Equipment ";
    			break;
    		}
        case (0x0401):
    		{
    			Type = "IAS Ancillary Control Equipment";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "IAS Ancillary Control Equipment";
    			break;
    		}
        case (0x0402):
    		{
    			Type = "IAS Zone";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "IAS Zone";
    			break;
    		}
        case (0x0403):
    		{
    			Type = "IAS Warning Device";
    			//set a default name that can be renamed later and stored in the hub
    			Name= (ZigBeeDeviceIdx+1) + ": " + "IAS Warning Device";
    			break;
    		}
        default:
        {
          Type ="Unknown Device";
          Name="Unknown";
          break;
        }
      }
    }
    this.type = Type;
    this.name = Name;
};

/**
 * Returns a unique lookup key for this device
 * @return {String} The lookup key
 */
ZigbeeDevice.prototype.fetchLookupKey = function() {
    return [this.nwkAddr,this.endPoint].join('');
}