var util = require('util');
var Device = require('./Device');
var P = require('../lib/protocol');

util.inherits(Read32Device, Device);

function Read32Device(address, headers, zigbeeDevice, socket, driverName) {
    Read32Device.super_.apply(this, arguments);

    this.writable = false;

    if (!this._valueReader) { // Allow it to be overridden
        this._valueReader = function(v) {
            return v / 100;
        };
    }

    this.onCommand(this._incomingCommand, this.onReading.bind(this));

    setInterval(this.pollForReading.bind(this), 2000);
}

Read32Device.prototype.onReading = function(address, reader) {
    reader.word32lu('value');

    var value = this._valueReader(reader.vars.value);
    this.log.debug('Got reading', value);

    this.emit('data', value);
};

Read32Device.prototype.pollForReading = function() {
    this.sendCommand(this._outgoingCommand);
};

module.exports = Read32Device;
