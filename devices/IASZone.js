var util = require('util');
var Device = require('./Device');
var P = require('../lib/protocol');

util.inherits(IASZone, Device);

function IASZone(address, headers, zigbeeDevice, socket) {
    IASZone.super_.apply(this, arguments);

    this.writable = false;
    this.V = 0;
    this.D = 244; // state device

    this.bindToCluster('IAS Zone');

    this.onCommand(P.RPCS_ZONESTATE_CHANGE, function(address, reader) {
        reader.word8('value');

        this.log.debug('State change value : ', reader.vars.value);

        // ES: Saw 0x35 = open, 0x31 = closed on Netvox ZB01C
        this.emit('data', reader.vars.value === 0x31? 0 : 1);

    }.bind(this));
}

module.exports = IASZone;
