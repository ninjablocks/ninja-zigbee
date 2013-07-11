var util = require('util');
var Read32Device = require('./Read32Device');
var P = require('../lib/protocol');

util.inherits(Driver, Read32Device);

function Driver(address, headers, zigbeeDevice, socket) {
    this._incomingCommand = P.RPCS_GET_HUMID_READING;
    this._outgoingCommand = P.RPCS_HUMID_READING;

    this.V = 0;
    this.D = 8; //Humidity Sensor

    Driver.super_.apply(this, arguments);
}

module.exports = Driver;
