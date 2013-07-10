var util = require('util');
var Device = require('./Device');

util.inherits(LightSensor, Device);

function LightSensor(address, headers, zigbeeDevice, socket) {
    LightSensor.super_.apply(this, arguments);

    this.writable = false;
}

module.exports = LightSensor;


