var util = require('util');
var Read32Device = require('./Read32Device');
var P = require('../lib/protocol');

util.inherits(Driver, Read32Device);

function Driver(address, headers, zigbeeDevice, socket) {
    this._incomingCommand = P.RPCS_POWER_READING;
    this._outgoingCommand = P.RPCS_GET_POWER_READING;

    this.V = 0;
    this.D = 243; //power

    this._valueReader = function(v) {return v;};

    Driver.super_.apply(this, arguments);
}

module.exports = Driver;
