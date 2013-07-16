var Presence = require('ninja-presence-base');

/*
 * This driver exports all communication from zigbee as a presence driver,
 * allowing simple 'has it been seen recently' type rules.
 */
module.exports = Presence;

Presence.prototype.G = 'zigbee';
Presence.prototype.name = 'Presence - Zigbee';

Presence.prototype.init = function() {
  var self = this;

  this.on('deviceSeen', function(address, reader, device) {
    self.see({
      name: device.name,
      id: address
    });
    self._app.log.info("Found zigbee device", device.name, address);
  });

};


Presence.prototype.scan = function() {
  // Not implemented... we're already scanning.
};
