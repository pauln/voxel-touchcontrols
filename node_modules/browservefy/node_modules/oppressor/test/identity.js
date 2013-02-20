var oppressor = require('../');
var tap = require('tap').test;
var zlib = require('zlib');

var fs = require('fs');
var http = require('http');

var fileContents = fs.readFileSync(__dirname + '/data.txt', 'utf8');

tap(function (t) {
    t.plan(1);
    
    var port = Math.floor(Math.random() * 5e4 + 1e4);
    var server = http.createServer(function (req, res) {
        fs.createReadStream(__dirname + '/data.txt')
            .pipe(oppressor(req))
            .pipe(res)
        ;
    });
    server.listen(port);
    var opts = {
        host : 'localhost',
        port : port,
        headers : {
            'accept-encoding' : 'identity'
        }
    };
    
    server.on('listening', function () {
        http.get(opts, function (res) {
            var data = '';
            res.on('data', function (buf) { data += buf });
            res.on('end', function () {
                t.equal(data, fileContents);
            });
        });
    });
    
    t.on('end', function () {
        server.close();
    });
});
