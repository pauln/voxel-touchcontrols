var oppressor = require('../');
var fs = require('fs');
var http = require('http');

var server = http.createServer(function (req, res) {
    fs.createReadStream(__dirname + '/data.txt')
        .pipe(oppressor(req))
        .pipe(res)
    ;
});
server.listen(8000);
