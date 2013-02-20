var Negotiator = require('negotiator');
var zlib = require('zlib');
var through = require('through');
var responseStream = require('response-stream');

module.exports = function (req) {
    var negotiator = new Negotiator(req);
    var enc = negotiator.preferredEncodings([ 'gzip', 'compress', 'identity' ]);
    if (Array.isArray(enc)) enc = enc[0];
    
    var createStream = {
        gzip : zlib.createGzip,
        compress : zlib.createDeflate,
        identity : through,
    }[enc] || through;
    
    var stream = responseStream(createStream());
    stream.on('setHeader', function (args, prevent) {
        if (String(args[0]).toLowerCase() === 'content-length') {
            prevent();
        }
    });
    
    stream.on('writeHead', function (args, prevent) {
        if (!args[0] || typeof args[0] !== 'object') return;
        
        Object.keys(args[1]).forEach(function (key) {
            if (String(key).toLowerCase() === 'content-length') {
                delete args[0][key];
            }
        });
    });
    
    stream.on('response', function (res) {
        if (!res._headers
        || res._headers['content-encoding'] === undefined) {
            res.setHeader('content-encoding', enc);
        }
        res.removeHeader('content-length');
    });
    
    return stream;
};
