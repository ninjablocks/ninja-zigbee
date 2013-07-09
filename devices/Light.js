var util = require('util');
var stream = require('stream');

util.inherits(Light, stream);

function Light(address, headers, zigbeeDevice, socket) {
    this._headers = headers;
    this._zigbeeDevice = zigbeeDevice;
    this._socket = socket;

    this.on('message', function(address, reader) {
        console.log("Light " + address + " got a command " + reader.vars.command);
    });
}

module.exports = Light;

