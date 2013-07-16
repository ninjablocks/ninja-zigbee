var Presence = require('ninja-presence-base');
var log4js = require('log4js');

/*
 * This driver exports all communication from zigbee as a presence driver,
 * allowing simple 'has it been seen recently' type rules.
 */
module.exports = Presence;

Presence.prototype.G = 'zigbee';
Presence.prototype.name = 'Presence - Zigbee';

Presence.prototype.init = function() {
  var self = this;

  this.log = log4js.getLogger('ZB - Presence');

  this.on('deviceSeen', function(address, headers, device) {
    self.see({
      name: device.name,
      id: address
    });
    self.log.debug("Saw device", device.name, address);
  });

};
