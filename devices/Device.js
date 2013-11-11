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

    this.G = 'zigbee'+headers.ieeeHex.replace(/[^a-zA-Z0-9]/g, '');
    this.name = 'ZigBee ' + zigbeeDevice.name + ' (' + headers.ieeeHex + ')';

    this.log = log4js.getLogger('ZB Device - ' + driverName + ' (' +  headers.ieeeHex + ')');
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
    if (!c) {
        // Cluster id instead of name?
        if (!isNaN(parseInt(c.id, 16))) {
            c = {name:'[unknown]', id:cluster};
        }
    }
    if (!c) {
        this.log.warn('Unknown cluster', cluster,'. This device does not have that cluster and so cannot bind to it.');
        return;
    }

    this.log.info("Binding to cluster " + c.name + ' (' + c.id + ')');

    var msg = new BufferMaker();

    msg.UInt8(P.RPCS_BIND_DEVICES);
    msg.UInt8(0); // Message size... this is set at the end.
    msg.UInt16LE(this._headers.networkAddress);

    msg.UInt8(this._headers.endPoint);
    msg.Int64LE(this._headers.ieee);
    msg.UInt8(this.coordinator.endPoint);
    msg.Int64LE(this.coordinator.ieee);

    msg.UInt16LE(parseInt(c.id, 16));

    var buffer = msg.make();
    buffer[1] = buffer.length-2; // Set the size of the message minus the first two bytes

    // ES: I've seen it fail (when we send them too quick?) So delay up to 2 seconds.
    setTimeout(function() {
        this.sendMessage(buffer);
    }.bind(this), (Math.random() * 2000));
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

    this.log.trace('Sending command : ' + P.inverted[command] + ' command length:', buffer[1]);
    this.sendMessage(buffer);
};

// ES: I haven't actually *seen* this work yet, but it might possibly with different devices.
// This should flash the lights on the device for 'time' seconds.
Device.prototype.identify = function(time) {
    this.sendCommand(P.RPCS_IDENTIFY_DEVICE, function(msg) {
        msg.UInt16LE(time);
    });
};

Device.prototype.sendMessage = function(buffer) {
    this._socket.write(buffer);
};

Device.prototype.write = function() {
  this.log.warn('Write attemped on a non-writable device.');
};

module.exports = Device;
