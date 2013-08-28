var util = require('util');
var Device = require('./Device');
var P = require('../lib/protocol');

util.inherits(IASZone, Device);

var ZONE_STATE_BITS = [
    'Alarm1',
    'Alarm2',
    'Tamper',
    'Battery',
    'SupervisionReports',
    'RestoreReports',
    'Trouble',
    'AC',
    'Reserved1',
    'Reserved2',
    'Reserved3',
    'Reserved4',
    'Reserved5',
    'Reserved6',
    'Reserved7',
    'Reserved8'
];

function IASZone(address, headers, zigbeeDevice, socket) {
    IASZone.super_.apply(this, arguments);

    this.writable = false;
    this.V = 0;
    this.D = 244; // state device

    this.onCommand(P.RPCS_ZONESTATE_CHANGE, function(address, reader) {

        reader.word16lu('zoneState');

        this.log.debug('Zone State : ', reader.vars.zoneState);

        var state = {};
        reader.vars.zoneState.toString(2).split('').reverse().forEach(function(bit, pos) {
            state[ZONE_STATE_BITS[pos]] = (bit === '1');
        });

        this.log.debug('Zone State Parsed : ', state);

        // ES: Saw 0x35 = open, 0x31 = closed on Netvox ZB01C
        //this.emit('data', reader.vars.value === 0x31? 0 : 1);

    }.bind(this));
}

module.exports = IASZone;
