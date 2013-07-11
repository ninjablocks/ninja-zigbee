var util = require('util');
var Device = require('./Device');
var P = require('../lib/protocol');

util.inherits(Power, Device);

function Power(address, headers, zigbeeDevice, socket) {
    Power.super_.apply(this, arguments);

    this.writable = false;
    this.V = 0;
    this.D = 243; //power

    this.onCommand(P.RPCS_POWER_READING, this.onPowerReading.bind(this));

    setInterval(this.pollForPowerReading.bind(this), 2000);
}

Power.prototype.onPowerReading = function(address, reader) {
    reader.word32lu('power');

    var power = reader.vars.power / 100;
    this.log.debug('Got power reading', power);

    this.emit('data', power);
};

Power.prototype.pollForPowerReading = function() {
    this.sendCommand(P.RPCS_GET_POWER_READING);
};

module.exports = Power;
