var util = require('util');
var PollingDevice = require('./PollingDevice');
var P = require('../lib/protocol');

util.inherits(Driver, PollingDevice);

function Driver(address, headers, zigbeeDevice, socket) {
    this._incomingCommand = P.RPCS_TEMP_READING;
    this._outgoingCommand = P.RPCS_GET_THERM_READING;

    this.V = 0;
    this.D = 9; //Temp Sensor

    Driver.super_.apply(this, arguments);
}

Driver.prototype.readZigbeeValue = function(reader) {
    reader.word16lu('value');
    return reader.vars.value / 100;
};

module.exports = Driver;
