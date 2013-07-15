// Required libraries/interfaces/classes
var util = require('util');
var Stream = require('stream');
var binary = require('binary');
var log4js = require('log4js');
var P = require('../lib/protocol');

var ZigbeeProfileStore = require(__dirname+'/ZigbeeProfileStore');

// Extend ZigBeeClient class with Stream
util.inherits(ZigBeeClient,Stream);

// Export the ZigBeeClient class
module.exports = ZigBeeClient;

var ZllDeviceIdx = 1;
var ZigBeeDeviceIdx = 1;


/**
 * Creates a new Zigbee Client
 *
 * @class Represents a Zigbee Client
 */
function ZigBeeClient(logger) {

  var self = this;

  this.writable = true;
  this.readable = true;
  this.log = log4js.getLogger('ZB - ZigbeeClient');

  this._profileStore = new ZigbeeProfileStore(logger, ['ha', 'zll']);

  this._profileStore.on('ready', function() {
    self.emit('ready');

    /*
    setTimeout(function() {
      var relay =          [1,33,161,194,1,4,  1,    9,0,0,0,1,173,0,0,0,0,96,80,131,0,0,0,96,0,0,0,0,0,0,0,96,2,0,0];
      var onOffLight =  [1,33,161,193,1,94,192,0,0,0,0,1,173,0,0,0,0,96,80,131,0,0,0,96,0,0,0,0,0,0,0,96,2,0,0]; // ES: not real... hand edited
      var dimmableLight = [1,33,161,191,1,94,192,0,1,0,0,1,173,0,0,0,0,96,80,131,0,0,0,96,0,0,0,0,0,0,0,96,2,0,0]; // ES: not real... hand edited
      var colourLight = [1,33,161,192,1,94,192,0,2,0,0,1,173,0,0,0,0,96,80,131,0,0,0,96,0,0,0,0,0,0,0,96,2,0,0]; // ES: not real... hand edited
      var onOffSwitch = [1,33,151,186,2,4,1,3,1,0,0,1,235,0,0,0,0,144,80,131,109,112,108,101,68,101,115,99,82,115,112,58,32,32,149];
      var lightSensor = [1,33,207,193,13,4,1,6,1,0,0,0,194,0,0,0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      //self.write(new Buffer(onOffSwitch));
      //self.write(new Buffer(relay));
      //self.write(new Buffer(onOffLight));
      //self.write(new Buffer(dimmableLight));
      //self.write(new Buffer(colourLight));
      self.write(new Buffer(lightSensor));
    }, 1000);
    //*/
  });
}

/**
 * Handles the interation over the data received
 * from the SRPC connection.
 *
 * @param  {String} data Data received from the SRPC
 */
ZigBeeClient.prototype.write = function(data) {
  // XXX: TODO: Can multiple messages arrive at once?
  this.log.debug('Processing msg');
  this.processData(data);
};

/**
 * Processes the data received from the SRPC connection.
 *
 * @param  {String} msg    Data received
 * @fires device Zigbee device/cluster description description
 *           message Parly parsed zigbee message
 *
 * TODO: Fix the comments.
 */
ZigBeeClient.prototype.processData = function(msg) {

  this.log.trace('Incoming ZigBee message', msg.length);

  // E.g .
  // [1,33,161,194,1,4,1,9,0,0,0,1,173,0,0,0,0,96,80,131,0,0,0,96,0,0,0,0,0,0,0,96,2,0,0]

  var reader = binary.parse(msg)
    .word8('command')
    .word8('length')
    .word16lu('networkAddress')
    .word8('endPoint')
    .word16lu('profileId')
    .word16lu('deviceId');

  delete(reader.vars.unknown);

  var address = reader.vars.networkAddress + ':' + reader.vars.endPoint;

  this.log.debug('Parsed message header : ', JSON.stringify(reader.vars));

  if (reader.vars.command == P.RPCS_NEW_ZLL_DEVICE) {
    var deviceDescription = this._profileStore.getDevice(reader.vars.profileId, reader.vars.deviceId);
    this.emit('device', address, reader.vars, deviceDescription);
  }

  this.emit(address, address, reader);
};

/**
 * Advises the SRPC server to discover devices
 *
 * @fires ZigbeeClient#data data to be written to the SRPC connection
 */
ZigBeeClient.prototype.discoverDevices = function() {
  this.log.debug('Discovering Devices');

  this.emit('data',new Buffer([P.RPCS_GET_DEVICES, 2, 0, 0]));
  //this.emit('data',new Buffer([P.RPCS_DISCOVER_DEVICES, 2, 0, 0]));
};

ZigBeeClient.prototype.end = function() {};
ZigBeeClient.prototype.destroy = function() {};
