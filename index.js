var net = require('net')
  , util = require('util')
  , Stream = require('stream')
  , spawn = require('child_process').spawn
  , ZigBeeClient = require(__dirname+'/lib/ZigbeeClient')
  , NinjaLight = require(__dirname+'/lib/NinjaLight')

function zigbeeModule(opts,app) {


  var self = this;

  this._app = app;
  this._opts = opts;

  // Spawn the SRPC Server
  var rpcServer = spawn(__dirname+'/bin/zllGateway.bin', ["/dev/ttyACM0"],  { cwd:__dirname+'/bin/' });

  rpcServer.stdout.on('data', function (data) {
    console.log('Zigbee stdout: ' + data);
  });  

  // Listen for errors
  rpcServer.stderr.on('data',function(err) {
    console.log('Zigbee Error: '+err);
    self._app.log.error('Zigbee Error: '+err);
    
  });  
  
  rpcServer.on('exit', function (code) {
    console.log('Zigbee process exited with code ' + code);
  });  
  
  // Hack to give the Server time to start
  // TODO: parse response from server's stdout
  app.on('client::up', function() {
      begin.call(self);
  });
};

module.exports = zigbeeModule

util.inherits(zigbeeModule,Stream);

/**
 * Creates necessary classes/connections and the `pipes between the.
 *
 * @param  {Object} cloud Methods inherited from the parent of the module
 */
function begin() {
  var self = this;
  // Create a new client
  var client = new ZigBeeClient;

  // Create a new connection to the SRPC server: port 0x2be3 for ZLL
  // TODO: incorporate this into the ZigbeeClient
  var socket = net.connect(11235,function() {
    self._app.log.info('Connected to TI ZLL Server');    
    console.log('Connected to TI ZLL Server');
    client.discoverDevices();  
  });

  // Listen for errors on this connections
  socket.on('error',function(err) {
    console.log('Zigbee Error: '+err);
    self._app.log.error('Zigbee Error: '+err);
  });

  // Node warns after 11 listeners have been attached
  // Increase the max listeners as we bind ~3 events per n devices
  socket.setMaxListeners(999);

  // Setup the bi-directional pipe between the client and socket.
  // Additionally setup the pipe between any new devices and the socket
  // once they are discovered.
  client
    .pipe(socket)
    .pipe(client)
    .on('device',function(device) {

      // Setup the pipe between the device and socket
      device.pipe(socket);

      console.log('Found new ZigBee Device Profile:'+device.profileId);
      // Register this device by wrapping it in a NinjaDevice
      // Quick hack to only register an HA device
      if (device.profileId == 0x0104) {
        self._app.log.info('Found new ZigBee Device '+device.type);
        console.log('Found new ZigBee Device '+device.type);
        self.emit('register',new NinjaLight(device));
      }
    });
};