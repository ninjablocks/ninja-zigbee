var util = require('util');
var Device = require('./Device');
var P = require('../lib/protocol');

util.inherits(Light, Device);

function Light(address, headers, zigbeeDevice, socket) {
    Light.super_.apply(this, arguments);

    this.writable = true;
    this.V = 0;
    this.D = 224; // Light
}

Light.prototype.write = function(data) {

    if (typeof data == 'string') {
        data = JSON.parse(data);
    }

    var hue = dataObject.hue >> 8,
        saturation = dataObject.sat,
        level = dataObject.bri;

    this.sendMessage(P.RPCS_SET_DEV_COLOR, function(msg) {
        msg.UInt8(hue);
        msg.UInt8(saturation);
        msg.UInt16LE(transitionTime);
    });

    this.sendMessage(P.RPCS_SET_DEV_LEVEL, function(msg) {
        msg.UInt8(level);
        msg.UInt16LE(transitionTime);
    });

    this.sendMessage(P.RPCS_SET_DEV_STATE, function(msg) {
        msg.UInt8(dataObject.on? 0xFF : 0x0);
    });
};

module.exports = Light;
