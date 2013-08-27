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

}

Device.prototype.onCommand = function(command, cb) {

    this.on('message', function(address, reader) {
        if (reader.vars.command == command) {
            cb(address, reader);
        }
    });

};

Device.prototype.bindToCluster = function(cluster) {

    // ES: TODO: Fix this. The coordinator should always be available.
    if (!this.coordinator) {
        setTimeout(function() {
            this.bindToCluster(cluster);
        }.bind(this), 50);
        return;
    }

    var c = this.hasServerCluster(cluster);

    this.log.info("Binding to cluster " + c.name + ' (' + c.id + ')');

    var msg = new BufferMaker();

    function writeAddress(y) {
        msg.UInt8(y.endPoint);

        var s = '0000000000000' + y.ieee.toString(16);
        s = s.substr(s.length-16, s.length).match(/.{8}/g);

        msg.UInt32LE(parseInt(s[0], 16));
        msg.UInt32LE(parseInt(s[1], 16));
    }

    msg.UInt8(P.RPCS_BIND_DEVICES);
    msg.UInt8(0); // Message size... this is set at the end.
    msg.UInt16LE(this._headers.networkAddress);

    writeAddress(this._headers);
    writeAddress(this.coordinator);

    msg.UInt16LE(c.id);

    var buffer = msg.make();
    buffer[1] = buffer.length-2; // Set the size of the message minus the first two bytes
    this.sendMessage(buffer);
};

Device.prototype.hasServerCluster = function(cluster) {
    for (var x in this._zigbeeDevice.server) {
        var c = this._zigbeeDevice.server[x];
        if (c.name == cluster) {
            return c;
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


