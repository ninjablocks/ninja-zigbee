/**
 * Parses XML ZigBee profile/cluster data from "data/profiles"
 */
var parser = new require('xml2js').Parser();
var fs = require('fs');
var util = require('util');
var stream = require('stream');
var _ = require('underscore');
var async = require('async');

util.inherits(ZigbeeProfileStore,stream);

function ZigbeeProfileStore(logger, fileName) {
    var self = this;

    this.log = logger;

    async.parallel([
        function(cb) {
             self.readXml(__dirname + '/../data/profiles/' + fileName + '.xml', function(err, result) {
                self.log.debug('Parsed ' + result.profiles.profile.length + ' profiles from ' + fileName + '.xml');
                self._profiles = _.map(result.profiles.profile, cleanHorribleOutput);
                cb();
            });
        },
        function(cb) {
            self.readXml(__dirname + '/../data/profiles/zcl.xml', function(err, result) {
                self.log.debug('Parsed ' + result.clusters.cluster.length + ' clusters from the ZCL');
                self._clusters = _.map(result.clusters.cluster, cleanHorribleOutput);
                cb();
            });
        }
    ], function() {

        // Attach the clusters to the device profiles
        _.each(self._profiles, function(profile) {
            _.each(profile.device, function(device) {
                _.each(['server', 'client'], function(section) {
                    if (device[section]) {
                        device[section] = _.map(device[section][0].clusterRef, function(clusterRef) {
                            return self.getCluster(clusterRef.name);
                        });
                    }
                });
            });
        });

        self.log.info('Ready');
        self.emit('ready');
    });
}

ZigbeeProfileStore.prototype.getDevice = function(profileId, deviceId) {
    this.log.trace('getDevice', profileId, deviceId);
    return this.filterById(this.filterById(this._profiles, profileId).device, deviceId);
};

ZigbeeProfileStore.prototype.getCluster = function(name) {
    return _.filter(this._clusters, function(c) {
        return c.name == name;
    })[0];
};

ZigbeeProfileStore.prototype.getProfile = function(id) {
    this.log.trace('getProfile', id);
    return this.filterById(this._profiles, id);
};

ZigbeeProfileStore.prototype.filterById = function(haystack, id) {
    var str = typeof id == 'string';
    return _.filter(haystack, function(p) {
        return str? p.id == id : parseInt(p.id, 16) == id;
    })[0];
};

ZigbeeProfileStore.prototype.readXml = function(file, cb) {
    var self = this;

    self.log.trace('Parsing ' + file);

    fs.readFile(file, function(err, data) {
        parser.parseString(data, function (err, result) {
            cb(err, result);
        });
    });
};

module.exports = ZigbeeProfileStore;


// Ignore me
// ES: I hate all the stupid xml attribute properties... so I'm flattening.
function cleanHorribleOutput(x) {
    if (x && x.$) {
        _.extend(x, x.$);
        delete(x.$);
    }

    _.each(x, function(value, prop) {
        if (_.isArray(value) || _.isObject(value)) {
            cleanHorribleOutput(value);
        }
    });

    return x;
}

