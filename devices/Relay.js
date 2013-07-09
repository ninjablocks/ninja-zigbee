var util = require('util');
var stream = require('stream');

var SRPC_CMD_ID_POS = 0;
var SRPC_CMD_LEN_POS = 1;

var RPCS_SET_DEV_STATE = 0x82;

var Addr16Bit = 2;

util.inherits(Relay, stream);

function Relay(address, headers, zigbeeDevice, socket) {
    this._headers = headers;
    this._zigbeeDevice = zigbeeDevice;
    this._socket = socket;

    var self = this;

    this.on('message', function(address, reader) {
        console.log("Relay " + address + " got a command " + reader.vars.command);
    });

    var state = true;
    setInterval(function() {
        self.write(state = !state);
    }, 3000);
}

Relay.prototype.write = function(data) {
  this.setDeviceState(data);
};

/**
 * Change the state of the device (on/off).
 *
 * @param {Boolean} state true if on, false if off
 * @fires zigbee#data       `data` written to SRPC client
 */
Relay.prototype.setDeviceState = function(state) {
  var msg = new Buffer(15);
  var msgIdx;

  console.log('zigbee.prototype.setDeviceState++: nwk:' +this._headers.networkAddress +' ep:' +this._headers.endPoint +' on:' +state);

  //set SRPC len and CMD ID
  msg[SRPC_CMD_ID_POS] = RPCS_SET_DEV_STATE;
  msg[SRPC_CMD_LEN_POS] = 13;

  //set ptr to point to data
  msgIdx=2;

  //dstAddr.addrMode = Addr16Bit
  msg[msgIdx++] = Addr16Bit;
  //set afAddrMode_t nwk address
  msg[msgIdx++] = (this._headers.networkAddress & 0xFF);
  msg[msgIdx++] = ((this._headers.networkAddress & 0xFF00)>>8);
  //pad for an ieee addr size;
  msgIdx += 6;
  //set Ep
  msg[msgIdx++] = this._headers.endPoint;
  //pad out pan ID
  msgIdx+=2;

  //set State
  if(state){
      msg[msgIdx++] = 0xFF;
  } else {
      msg[msgIdx++] = 0x0;
  }
  this._socket.write(msg);
};

module.exports = Relay;

