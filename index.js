var net = require('net')
  , util = require('util')
  , Stream = require('stream')
  , spawn = require('child_process').spawn
  , ZigBeeClient = require(__dirname+'/lib/ZigbeeClient')
  , _ = require('underscore');

function zigbeeModule(opts,app) {

  var self = this;

  this._app = app;
  this._opts = opts;

  /*// Spawn the SRPC Server
  var rpcServer = spawn(__dirname+'/bin/zllController.darwin.bin', ["/dev/tty.usbmodem1411"],  { cwd:__dirname+'/bin/' });

  rpcServer.stdout.on('data', function (data) {

    this._app.log.info('(ZigBeeaaa) %s', data);
  }.bind(this));

  // Listen for errors
  rpcServer.stderr.on('data',function(err) {

    this._app.log.error('(ZigBee) %s', err);
  }.bind(this));

  rpcServer.on('exit', function (code) {

    this._app.log.error('(ZigBee)  process exited with code %s', code);
  }.bind(this));*/

  // Hack to give the Server time to start
  // TODO: parse response from server's stdout
  app.on('client::up', begin.bind(this));
}

module.exports = zigbeeModule;

util.inherits(zigbeeModule,Stream);

/**
 * Creates necessary classes/connections and the `pipes between the.
 *
 * @param  {Object} cloud Methods inherited from the parent of the module
 */
function begin() {
  var self = this;

  if (this.socket) {
    // We already have a connection
    return;
  }
  // Create a new client
  var client = new ZigBeeClient(this._app.log);

  var seenAddresses = {};

  client.on('ready', function() {
    // Create a new connection to the SRPC server: port 0x2be3 for ZLL
    // TODO: incorporate this into the ZigbeeClient
    this.socket = net.connect(11235,function() {
      this._app.log.info('(ZigBee) Connected to TI ZLL Server');
      setTimeout(function() {
        client.discoverDevices();
      }, 4000);
      setInterval(function() {
        //client.discoverDevices();
      }, 1000);
    }.bind(this));

    // Listen for errors on this connections
    this.socket.on('error',function(err) {
      this._app.log.error('(ZigBee) %s',err);
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
          return; // XXX: Why do i get told about it so many times?
        }

        self._app.log.info('Device found', zigbeeDevice.name + ' (' + address + ')');

        // Forward all relevant messages from zigbee to our new devices
        var devices = createNinjaDevices(address, headers, zigbeeDevice, self.socket);
        _.each(devices, function(device) {
          client.on('message', function(incomingAddress, reader) {
            if (incomingAddress == address) {
              device.emit('message', address, reader);
            }
          });
        });

        seenAddresses[address] = true;
      })
      .on('message',function(address, reader) {

        self._app.log.info('Message from (' + address + ')');

      }.bind(this));

  }.bind(this));

}

// TODO: move this out of here!
// TODO: this should have the profile id, not just device id?
var mappings = {
    "Light" : ["0x0100","0x0103"],
    "Relay" : ["0x0009"]
};

var drivers = {};

_.each(mappings, function(deviceIds, driverName) {
  drivers[driverName] = require('devices/' + driverName);
});

function createNinjaDevices(address, headers, zigbeeDevice, socket) {

  var devices = [];

  _.each(mappings, function(deviceIds, driverName) {
    if (deviceIds.indexOf(zigbeeDevice.id) > -1) {
      var device = new drivers[driverName](address, headers, zigbeeDevice, socket);
      device.driverName = driverName;
      devices.push(device);
    }
  });

  return devices;
}
