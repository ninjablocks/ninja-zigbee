var net = require('net')
  , util = require('util')
  , Stream = require('stream')
  , spawn = require('child_process').spawn
  , ZigBeeClient = require(__dirname+'/lib/ZigbeeClient')
  , NinjaLight = require(__dirname+'/lib/NinjaLight')
  , ZigbeeActuator = require(__dirname+'/lib/ZigbeeActuator')
  , NinjaSmartPlug = require(__dirname+'/lib/NinjaSmartPlug')
  , NinjaTempSensor = require(__dirname+'/lib/NinjaTempSensor')

function zigbeeModule(opts,app) {

  var self = this;

  this._app = app;
  this._opts = opts;

  // Spawn the SRPC Server
  var rpcServer = spawn(__dirname+'/bin/zllGateway.bin', ["/dev/ttyACM1"],  { cwd:__dirname+'/bin/' });

  rpcServer.stdout.on('data', function (data) {

    this._app.log.info('(ZigBee) %s', data);
  }.bind(this));

  // Listen for errors
  rpcServer.stderr.on('data',function(err) {

    this._app.log.error('(ZigBee) %s', err);
  }.bind(this));

  rpcServer.on('exit', function (code) {

    this._app.log.error('(ZigBee)  process exited with code %s', code);
  }.bind(this));

  // Hack to give the Server time to start
  // TODO: parse response from server's stdout
  app.on('client::up', begin.bind(this));
};

module.exports = zigbeeModule;

util.inherits(zigbeeModule,Stream);

/**
 * Creates necessary classes/connections and the `pipes between the.
 *
 * @param  {Object} cloud Methods inherited from the parent of the module
 */
function begin() {

  if (this.socket) {
    // We already have a connection
    return;
  }
  // Create a new client
  var client = new ZigBeeClient(this._app.log);
  // Create a new connection to the SRPC server: port 0x2be3 for ZLL
  // TODO: incorporate this into the ZigbeeClient
  this.socket = net.connect(11235,function() {
    this._app.log.info('(ZigBee) Connected to TI ZLL Server');
    client.discoverDevices();
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
    .on('device',function(device) {

      // Setup the pipe between the device and socket
      device.socket = this.socket;

      // Register this device by wrapping it in a NinjaDevice
      if ( (device.type == "Color Dimmable Light")  ||
           (device.type == "ZLL Color Light") )
      {
        this._app.log.info('Found new ZigBee Light '+device.type);
        this.emit('register',new NinjaLight(this._app.log,device));
      }
      //on/off switch
      /*else if (device.type == "On/Off Switch")
      {
        this._app.log.info('Found new ZigBee Switch '+device.type);
        this.emit('register',new ZigbeeActuator(this._app.log,device));
      }*/
      else if (device.type == "Mains Power Outlet")
      {
        this._app.log.info('Found new ZigBee Smart Plug '+device.type);
        this.emit('register',new NinjaSmartPlug(this._app.log,device));
      }
      else if (device.type == "Temperature Sensor")
      {
        this._app.log.info('Found new ZigBee Temp Sensor '+device.type);
        this.emit('register',new NinjaTempSensor(this._app.log,device));
      }
      else
      {
        this._app.log.info('Found new unknown ZigBee device '+device.type);
      }


    }.bind(this));
};