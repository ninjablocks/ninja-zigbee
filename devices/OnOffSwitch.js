var util = require('util');
var Device = require('./Device');
var P = require('../lib/protocol');

util.inherits(OnOffSwitch, Device);

// TODO: Support cluster "Level Control" for device "Level Control Switch"
function OnOffSwitch(address, headers, zigbeeDevice, socket) {
    OnOffSwitch.super_.apply(this, arguments);

    this.writable = false;
    this.V = 0;
    this.D = 244; // state device

    this.onCommand(P.RPCS_ZONESTATE_CHANGE, function(address, reader) {
        reader.word8('value');

        this.log.debug('State change value : ', reader.vars.value);

        // ES: Saw 0x35 = open, 0x31 = closed on Netvox ZB01C
        this.emit('data', reader.vars.value === 0x31? 0 : 1);

    }.bind(this));
}

module.exports = OnOffSwitch;
