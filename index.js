var net = require('net');
var util = require('util');
var Stream = require('stream');
var spawn = require('child_process').spawn;
var _ = require('underscore');
var log4js = require('log4js');

var DebugDevice = require('./devices/DebugDevice');
var PresenceDriver = require('./lib/PresenceDriver');
var ZigBeeClient = require('./lib/ZigbeeClient');


// Adds extra logging, and attempts to communicate with any unknown devices.
var DEBUG_MODE = true;


function ZigbeeDriver(opts,app) {

  var self = this;

  this._app = app;
  this._opts = opts;
  this.log = log4js.getLogger('ZB');

  var rpcServer;

  // Spawn the SRPC Server
  switch (process.platform + process.arch) {
    case 'darwinx64':
      rpcServer = spawn(__dirname+'/bin/zllGateway.darwin.bin', ["/dev/tty.usbmodem1431"],  { cwd:__dirname+'/bin/' });
      break;
    case 'linuxarm':
      rpcServer = spawn(__dirname+'/bin/zllGateway.linux.arm.bin', ["/dev/ttyACM0"],  { cwd:__dirname+'/bin/' });
      break;
    case 'linuxx64':
      rpcServer = spawn(__dirname+'/bin/zllGateway.linux.x64.bin', ["/dev/ttyACM0"],  { cwd:__dirname+'/bin/' });
      break;
    default:
      throw new Error("The Zigbee Driver only supports linux and osx. Found: " + process.platform + ' - ' + process.arch);
  }

  rpcServer.stdout.on('data', function (data) {
    //self.log.debug('rpc: ' + data.toString());
  });

  rpcServer.stderr.on('data', function (data) {
    self.log.error('rpc: ' + data);
  });

  rpcServer.on('close', function (code) {
    self.log.error('rpc exited with code ' + code);
  });

  this._presence = new PresenceDriver(this._opts, this._app);

  // Hack to give the Server time to start
  // TODO: parse response from server's stdout
  app.once('client::up', this.begin.bind(this));
}

module.exports = ZigbeeDriver;

util.inherits(ZigbeeDriver,Stream);

/**
 * Creates necessary classes/connections and the pipes between the ZigbeeClient and this driver
 */
ZigbeeDriver.prototype.begin = function() {
  var self = this;

  if (this.socket) {
    // We already have a connection
    return;
  }
  // Create a new client
  var client = new ZigBeeClient();

  var devices = {};

  client.on('ready', function() {
    // Create a new connection to the SRPC server: port 0x2be3 for ZLL
    // TODO: incorporate this into the ZigbeeClient
    this.socket = net.connect(11235,function() {
      this.log.info('Connected to TI ZLL Server');
      setTimeout(function() {
        client.discoverDevices();
      }, 1000);
      setInterval(function() {
        //client.discoverDevices();
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
      .on('device',function(address, zigbeeDevice, headers, isNew) {

        self._presence.emit('deviceSeen', address, zigbeeDevice, headers);

        if (isNew) {
          if (!zigbeeDevice) {
            self.log.warn("Found an unknown device. Please post this to the forums -> Profile:" + hex(headers.profileId) + ' Device:' + hex(headers.deviceId) + ' Address:' + address);
            if (DEBUG_MODE) {
              zigbeeDevice = {
                name: '[Unknown Device]',
                profile: headers.profileId,
                id: headers.deviceId
              };
            } else {
              return;
            }
          }

          self.log.info('Device found', zigbeeDevice.name + ' ' + zigbeeDevice.profile + ':' + zigbeeDevice.id + ' (' + address + ')');

          // Forward all relevant messages from zigbee to our new devices
          var newDevices = createNinjaDevices(address, headers, zigbeeDevice, self.socket);

          if (!newDevices.length) {
            self.log.warn("Found a '" + zigbeeDevice.name + "' device that we weren't able to expose over NinjaBlocks. Please post this to the forums -> Profile:" + hex(headers.profileId) + ' Device:' + hex(headers.deviceId) + ' Address:' + address);
            if (DEBUG_MODE) {
              newDevices = [new DebugDevice(address, headers, zigbeeDevice, self.socket, 'DebugDevice')];
            }
          }

          _.each(newDevices, function(device) {
            self.emit('register', device);

            client.on(address, function(incomingAddress, zigbeeDevice, reader) {
              device.emit('message', incomingAddress, reader);
            });
          });


        }

      })
      .on('deviceSeen', function(address, zigbeeDevice, headers) {
        self._presence.emit('deviceSeen', address, zigbeeDevice, headers);
      });

  }.bind(this));

};

// TODO: move this out of here! into device drivers?
var mappings = {
    "Light" : ["0x0104:0x0102", "0x0104:0x0105", "0xc05e:0x0000", "0xc05e:0x0100","0xc05e:0x0200"],
    "Relay" : ["0x0104:0x0009"],
    "Power" : ["0x0104:0x0009"],
    "Humidity" : ["0x0104:0x0302"],
    "Temperature" : ["0x0104:0x0302"],
    "LightSensor" : ["0x0104:0x0106"],
    "OnOffSwitch" : ["0x0104:0x0103", "0x0104:0x0000", "0x0104:0x0001"],
    "IASZone" : ["0x0104:0x0402"]
};

var drivers = {};

_.each(mappings, function(deviceIds, driverName) {
  drivers[driverName] = require('./devices/' + driverName);
});

function createNinjaDevices(address, headers, zigbeeDevice, socket) {

  var id = hex(headers.profileId) + ':' + hex(headers.deviceId);

  var devices = [];

  _.each(mappings, function(deviceIds, driverName) {
    if (deviceIds.indexOf(id) > -1) {
      var device = new drivers[driverName](address, headers, zigbeeDevice, socket, driverName);
      devices.push(device);
    }
  });

  return devices;
}

function hex(v) {
  v = '000' + v.toString(16);
  return '0x' + v.substring(v.length-4);
}

/*

  var BufferMaker = require('buffermaker');
  var msg = new BufferMaker();
  msg.UInt16LE(512);
  console.log("XXX : " + msg.make().toJSON());
*/
