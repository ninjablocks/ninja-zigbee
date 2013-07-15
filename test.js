
var opts = {};

var d = new (require('./index'))(opts, {
    on : function(x,cb){
        setTimeout(cb, 100);
    },
    log: {
        debug: console.log,
        info: console.log,
        warn: console.log,
        error: console.log
    },
    opts: {
        cloudHost : "zendo.ninja.is",
        apiHost : "api.ninja.is",
        streamHost : "stream.ninja.is"
    },
    token: 'XXX'
});

d.emit = function(channel, value) {
    console.log('Driver.emit', channel);
    if (channel == 'register') {
        console.log('Registered device : ', value.name);
        var device = value;

        device.on('data', function(data) {
            console.log('Device emitted data - ' + data);
        });

        if (device.D == 238) { // relay
            var last = true;
            setInterval(function() {
            //    device.write(last = !last);
            }, 2000);
        }

        if (device.D == 224) { // light
            setInterval(function() {
                device.write({
                    bri: Math.floor(Math.random() * 256),
                    hue: Math.floor(Math.random() * 65535),
                    sat: Math.floor(Math.random() * 256),
                    on: Math.random() > 0.5,
                    transitionTime: Math.floor(Math.random() * 2000)
                });
            }, 2000);
        }

    }
};

d.save = function() {
    console.log('Saved opts', opts);
};

