var util = require('util');
var Device = require('./Device');
var P = require('../lib/protocol');

util.inherits(Light, Device);

function Light(address, headers, zigbeeDevice, socket) {
    Light.super_.apply(this, arguments);

    this.writable = true;
    this.V = 0;
    this.D = 224; // Light

    this.write({hue:12,sat:212,bri:99,on:true,transitionTime:50});
}

Light.prototype.write = function(data) {

    if (typeof data == 'string') {
        data = JSON.parse(data);
    }

    var hue = data.hue >> 8;

    this.sendCommand(P.RPCS_SET_DEV_COLOR, function(msg) {
        msg.UInt8(hue);
        msg.UInt8(data.sat);
        msg.UInt16LE(data.transitionTime || 10);
    });

    this.sendCommand(P.RPCS_SET_DEV_LEVEL, function(msg) {
        msg.UInt8(data.bri);
        msg.UInt16LE(data.transitionTime || 10);
    });

    this.sendCommand(P.RPCS_SET_DEV_STATE, function(msg) {
        msg.UInt8(data.on? 0xFF : 0x0);
    });
};

module.exports = Light;
