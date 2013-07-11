var _ = require('underscore');

var commands = {


    // SRPC CMD ID's
    // define the outgoing (from server) RPSC command ID's
    RPCS_NEW_ZLL_DEVICE : 0x0001,
    RPCS_DEV_ANNCE : 0x0002,
    RPCS_SIMPLE_DESC : 0x0003,
    RPCS_TEMP_READING : 0x0004,
    RPCS_POWER_READING : 0x0005,
    RPCS_PING : 0x0006,
    RPCS_GET_DEV_STATE_RSP : 0x0007,
    RPCS_GET_DEV_LEVEL_RSP : 0x0008,
    RPCS_GET_DEV_HUE_RSP : 0x0009,
    RPCS_GET_DEV_SAT_RSP : 0x000a,
    RPCS_ADD_GROUP_RSP : 0x000b,
    RPCS_GET_GROUP_RSP : 0x000c,
    RPCS_ADD_SCENE_RSP : 0x000d,
    RPCS_GET_SCENE_RSP : 0x000e,
    RPCS_HUMID_READING : 0x000f,
    RPCS_ZONESTATE_CHANGE : 0x0010,

    // define incoming (to server) RPCS command ID's
    RPCS_CLOSE : 0x80,
    RPCS_GET_DEVICES : 0x81,
    RPCS_SET_DEV_STATE : 0x82,
    RPCS_SET_DEV_LEVEL : 0x83,
    RPCS_SET_DEV_COLOR : 0x84,
    RPCS_GET_DEV_STATE : 0x85,
    RPCS_GET_DEV_LEVEL : 0x86,
    RPCS_GET_DEV_HUE : 0x87,
    RPCS_GET_DEV_SAT : 0x88,
    RPCS_BIND_DEVICES : 0x89,
    RPCS_GET_THERM_READING : 0x8a,
    RPCS_GET_POWER_READING : 0x8b,
    RPCS_DISCOVER_DEVICES : 0x8c,
    RPCS_SEND_ZCL : 0x8d,
    RPCS_GET_GROUPS : 0x8e,
    RPCS_ADD_GROUP : 0x8f,
    RPCS_GET_SCENES : 0x90,
    RPCS_STORE_SCENE : 0x91,
    RPCS_RECALL_SCENE : 0x92,
    RPCS_IDENTIFY_DEVICE : 0x93,
    RPCS_CHANGE_DEVICE_NAME : 0x94,
    RPCS_REMOVE_DEVICE : 0x95,
    RPCS_GET_HUMID_READING : 0x96
};

// So we can show human readable names for commands
commands.inverted = _.invert(commands);

var addressModes = {
    // SRPC AfAddr Addr modes ID's
    AddrNotPresent : 0,
    AddrGroup : 1,
    Addr16Bit : 2,
    Addr64Bit : 3,
    AddrBroadcast : 1
};

module.exports = _.extend(commands, addressModes);
