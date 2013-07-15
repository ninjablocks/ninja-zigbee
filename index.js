var net = require('net')
  , util = require('util')
  , Stream = require('stream')
  , spawn = require('child_process').spawn
  , ZigBeeClient = require(__dirname+'/lib/ZigbeeClient')
  , _ = require('underscore')
  , log4js = require('log4js');

function zigbeeModule(opts,app) {

  var self = this;

  this._app = app;
  this._opts = opts;
  this.log = log4js.getLogger('ZB');

  // Spawn the SRPC Server
  var rpcServer = spawn(__dirname+'/bin/zllGateway.darwin.bin', ["/dev/tty.usbmodem1431"],  { cwd:__dirname+'/bin/' });

  rpcServer.stdout.on('data', function (data) {
    self.log.trace('rpc: ' + data);
  });

  rpcServer.stderr.on('data', function (data) {
    self.log.error('rpc: ' + data);
  });

  rpcServer.on('close', function (code) {
    self.log.error('rpc exited with code ' + code);
  });

  // Hack to give the Server time to start
  // TODO: parse response from server's stdout
  app.on('client::up', this.begin.bind(this));
}

module.exports = zigbeeModule;

util.inherits(zigbeeModule,Stream);

/**
 * Creates necessary classes/connections and the `pipes between the.
 *
 * @param  {Object} cloud Methods inherited from the parent of the module
 */
zigbeeModule.prototype.begin = function() {
  var self = this;

  if (this.socket) {
    // We already have a connection
    return;
  }
  // Create a new client
  var client = new ZigBeeClient();

  var seenAddresses = {};

  client.on('ready', function() {
    // Create a new connection to the SRPC server: port 0x2be3 for ZLL
    // TODO: incorporate this into the ZigbeeClient
    this.socket = net.connect(11235,function() {
      this.log.info('Connected to TI ZLL Server');
      setTimeout(function() {
        //client.discoverDevices();
      }, 1000);
      setInterval(function() {
        client.discoverDevices();
      }, 1000);
    }.bind(this));

    // Listen for errors on this connection
    this.socket.on('error',function(err) {
      this.log.error(err);
    }.bind(this));

    // Node warns after 11 listeners have been attached
    // Increase the max listeners as we bind ~3 events per n devices
    this.socket.setMaxListeners(999);

    // Setup the bi-directional pipe between the client and socket.
    // Additionally setup the pipe between any new devices and the socket
    // once they are discovered.
    client
      .pipe(this.socket)
      .pipe(client)
      .on('device',function(address, headers, zigbeeDevice) {

        if (seenAddresses[address]) {
          return;
        }
        seenAddresses[address] = true;

        self.log.info('Device found', zigbeeDevice.name + ' (' + address + ')');

        // Forward all relevant messages from zigbee to our new devices
        var devices = createNinjaDevices(address, headers, zigbeeDevice, self.socket);
        _.each(devices, function(device) {
          self.emit('register', device);

          client.on(address, function(incomingAddress, reader) {
            device.emit('message', incomingAddress, reader);
          });
        });

        seenAddresses[address] = true;
      });

  }.bind(this));

};

// TODO: move this out of here! into device drivers?
var mappings = {
    "Light" : ["0xc05e:0x0000", "0xc05e:0x0100","0xc05e:0x0200"],
    "Relay" : ["0x0104:0x0009"],
    "Power" : ["0x0104:0x0009"],
    "LightSensor" : ["0x0104:0x0106"]
};

var drivers = {};

_.each(mappings, function(deviceIds, driverName) {
  drivers[driverName] = require('./devices/' + driverName);
});

function createNinjaDevices(address, headers, zigbeeDevice, socket) {

  function h(v) {
    v = '000' + v.toString(16);
    return '0x' + v.substring(v.length-4);
  }

  var id = h(headers.profileId) + ':' + h(headers.deviceId);

  var devices = [];

  _.each(mappings, function(deviceIds, driverName) {
    if (deviceIds.indexOf(id) > -1) {
      var device = new drivers[driverName](address, headers, zigbeeDevice, socket, driverName);
      devices.push(device);
    }
  });

  return devices;
}

/*

  var BufferMaker = require('buffermaker');
  var msg = new BufferMaker();
  msg.UInt16LE(512);
  console.log("XXX : " + msg.make().toJSON());
*/
