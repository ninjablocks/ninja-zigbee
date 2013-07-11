var util = require('util');
var Device = require('./Device');
var P = require('../lib/protocol');

util.inherits(Humidity, Device);

function Humidity(address, headers, zigbeeDevice, socket) {
    Power.super_.apply(this, arguments);

    this.writable = false;
    this.V = 0;
    this.D = 8; //Humidity Sensor

    this.onCommand(P.RPCS_HUMID_READING, this.onReading.bind(this));

    setInterval(this.pollForReading.bind(this), 2000);
}

Humidity.prototype.onReading = function(address, reader) {
    reader.word32lu('value');

    var value = reader.vars.value / 100;
    this.log.debug('Got reading', value);

    this.emit('data', value);
};

Humidity.prototype.pollForReading = function() {
    this.sendCommand(P.RPCS_GET_HUMID_READING);
};

module.exports = Humidity;
