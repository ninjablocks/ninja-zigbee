var util = require('util');
var Device = require('./Device');

util.inherits(OnOffSwitch, Device);

// TODO: Support cluster "Level Control" for device "Level Control Switch"
function OnOffSwitch(address, headers, zigbeeDevice, socket) {
    OnOffSwitch.super_.apply(this, arguments);

    this.writable = false;
    this.V = 0;
    this.D = 6;

    this.on('message', function(address, reader) {
        console.log('On/off switch got a message', reader.vars);
    });
}

module.exports = OnOffSwitch;
