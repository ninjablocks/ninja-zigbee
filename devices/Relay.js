var util = require('util');
var Device = require('./Device');

util.inherits(Relay, Device);

function Relay(address, headers, zigbeeDevice, socket) {
    Relay.super_.apply(this, arguments);

    this.writable = true;
    this.V = 0;
    this.D = 238;

    this.on('message', function(address, reader) {
        // TODO: Do something with the incoming zigbee message

       //* this.log('Got a message, so I\'m going to turn the relay on and off');
        this.write(1);
        this.write(0);
        //*/
    }.bind(this));
}

Relay.prototype.write = function(data) {
    this.sendDeviceState(function(msg) {
        msg.UInt8(data? 0xFF : 0x0); // We check for JS 'truthyness' for 0, 1, '0', '1', true, false etc should all work.
    });
};

module.exports = Relay;

