/*
 * This is our parent class, extended by all the device drivers. It handles all the communication to zigbee.
 */
var util = require('util');
var stream = require('stream');
var BufferMaker = require('buffermaker');
var log4js = require('log4js');

util.inherits(Device, stream);

var RPCS_SET_DEV_STATE = 0x82;
var Addr16Bit = 2;

function Device(address, headers, zigbeeDevice, socket, driverName) {

    this._headers = headers;
    this._zigbeeDevice = zigbeeDevice;
    this._socket = socket;

    this.G = address;
    this.name = 'ZigBee ' + zigbeeDevice.name + ' (' + address + ')';

    this.log = log4js.getLogger('ZB Device - ' + driverName + ' (' + address + ')');
    this.log.trace('Initialised');

    this.on('message', function(address, reader) {
        this.log.debug("Incoming message", JSON.stringify(reader.vars));
    }.bind(this));
}

Device.prototype.sendDeviceState = function(cb) {
    this.sendCommand(RPCS_SET_DEV_STATE, cb);
};

Device.prototype.sendCommand = function(command, cb) {

    var msg = new BufferMaker();
    msg.UInt8(command);
    msg.UInt8(13); // TODO: AUTO SET THIS!
    msg.UInt8(Addr16Bit);
    msg.UInt16LE(this._headers.networkAddress);
    msg.UInt32LE(0); // pad for an ieee addr size;
    msg.UInt16LE(0); // pad for an ieee addr size;
    msg.UInt8(this._headers.endPoint);
    msg.UInt16LE(0); //pad out pan ID

    cb(msg); // Let the calling concrete class set its own state

    // TODO: Set correct message length

    this.log.trace('Sending command : ' + command + ' message', msg.make().toJSON());
    this.sendMessage(msg);
};

Device.prototype.sendMessage = function(msg) {
    this._socket.write(msg.make());
};

module.exports = Device;


