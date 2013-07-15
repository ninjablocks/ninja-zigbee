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
    data = (data=== true || data === 1 || data === '1');
    this.log.info('Turning ' + (data?'on':'off'));
    this.sendCommand(P.RPCS_SET_DEV_STATE, function(msg) {
        msg.UInt8(data? 0xFF : 0x0);
    });
};

module.exports = Relay;
