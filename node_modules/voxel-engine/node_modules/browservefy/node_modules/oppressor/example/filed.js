var oppressor = require('../');
var filed = require('filed');
var http = require('http');

var server = http.createServer(function (req, res) {
     filed(__dirname + '/data.txt')
        .pipe(oppressor(req))
        .pipe(res)
    ;
});
server.listen(8000);
