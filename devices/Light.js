var util = require('util');
var Device = require('./Device');

util.inherits(Light, Device);

var RPCS_SET_DEV_STATE      = 0x82;
var RPCS_SET_DEV_LEVEL      = 0x83;
var RPCS_SET_DEV_COLOR      = 0x84;

function Light(address, headers, zigbeeDevice, socket) {
    Light.super_.apply(this, arguments);

    this.writable = true;
}

Light.prototype.write = function(data) {

    if (typeof data == 'string') {
        data = JSON.parse(data);
    }

    var hue = dataObject.hue >> 8,
        saturation = dataObject.sat,
        level = dataObject.bri;

    this.sendMessage(RPCS_SET_DEV_COLOR, function(msg) {
        msg.UInt8(hue);
        msg.UInt8(saturation);
        msg.UInt16LE(transitionTime);
    });

    this.sendMessage(RPCS_SET_DEV_LEVEL, function(msg) {
        msg.UInt8(level);
        msg.UInt16LE(transitionTime);
    });

    this.sendMessage(RPCS_SET_DEV_STATE, function(msg) {
        msg.UInt8(dataObject.on? 0xFF : 0x0);
    });
};

module.exports = Light;
