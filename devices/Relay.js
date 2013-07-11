var util = require('util');
var Device = require('./Device');
var P = require('../lib/protocol');

util.inherits(Relay, Device);

function Relay(address, headers, zigbeeDevice, socket) {
    Relay.super_.apply(this, arguments);

    this.writable = true;
    this.V = 0;
    this.D = 238;

}

Relay.prototype.write = function(data) {
    this.log.info('Turning ' + (data?'on':'off'));
    this.sendCommand(P.RPCS_SET_DEV_STATE, function(msg) {
        msg.UInt8(data? 0xFF : 0x0); // We check for JS 'truthyness' for 0, 1, '0', '1', true, false etc should all work.
    });
};

module.exports = Relay;
