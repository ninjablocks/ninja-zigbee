/*
 * This is our parent class, extended by all the device drivers. It handles all the communication to zigbee.
 */
var util = require('util');
var stream = require('stream');
var BufferMaker = require('buffermaker');
var log4js = require('log4js');
var P = require('../lib/protocol');

util.inherits(Device, stream);

function Device(address, headers, zigbeeDevice, socket, driverName) {

    this._headers = headers;
    this._zigbeeDevice = zigbeeDevice;
    this._socket = socket;

    this.G = address.replace(/[^a-zA-Z0-9]/g, '');
    this.name = 'ZigBee ' + zigbeeDevice.name + ' (' + address + ')';

    this.log = log4js.getLogger('ZB Device - ' + driverName + ' (' + address + ')');
    this.log.trace('Initialised');

    this.on('message', function(address, reader) {
        this.log.debug("Incoming command", P.inverted[reader.vars.command], JSON.stringify(reader.vars));
    }.bind(this));

    process.nextTick(function() {
        this.sendCommand(P.RPCS_IDENTIFY_DEVICE);
        this.sendCommand(P.RPCS_SEND_ZCL);
    }.bind(this));
}

Device.prototype.onCommand = function(command, cb) {

    this.on('message', function(address, reader) {
        if (reader.vars.command == command) {
            cb(address, reader);
        }
    });

};

Device.prototype.hasServerCluster = function(cluster) {
    for (var x in this._zigbeeDevice.server) {
        var c = this._zigbeeDevice.server[x];
        if (c.name == cluster) {
            return true;
        }
    }
    return false;
};

Device.prototype.sendCommand = function(command, cb) {

    var msg = new BufferMaker();
    msg.UInt8(command);
    msg.UInt8(0); // This is set at the end.
    msg.UInt8(P.Addr16Bit);
    msg.UInt16LE(this._headers.networkAddress);
    msg.UInt32LE(0); // pad for an ieee addr size;
    msg.UInt16LE(0); // pad for an ieee addr size;
    msg.UInt8(this._headers.endPoint);
    msg.UInt16LE(0); //pad out pan ID

    if (cb) {
      cb(msg); // Let the calling concrete class set its own state
    }

    var buffer = msg.make();
    buffer[1] = buffer.length-2; // Set the size of the message minus the first two bytes

    this.log.trace('Sending command : ' + P.inverted[command] + ' message length:', buffer.length);
    this.sendMessage(buffer);
};

Device.prototype.sendMessage = function(buffer) {
    this._socket.write(buffer);
};

Device.prototype.write = function() {
  this.log.warn('Write attemped on a non-writable device.');
};

module.exports = Device;


