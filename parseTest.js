var ZigbeeProfileStore = require('lib/ZigbeeProfileStore');
var log4js = require('log4js');
var pretty = require('prettyjson').render;

var log = log4js.getLogger('parseTest');

var ha = new ZigbeeProfileStore(log4js.getLogger('ZigbeeProfileStore'), 'ha');
ha.on('ready', function() {
    log.info('Store is ready!');
    log.info("Mains power outlet : " + pretty(ha.getDevice(260, 9)));
});
