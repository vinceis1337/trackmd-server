/**
 * Created by jhsukei on 2/20/16.
 */

var express = require('express'),
    fs = require('fs');

var app = express();


//Work around to keep node from crashing. Will require a restart...maybe...idk...
//TODO: Implement that DOMAIN/Cluster pattern detailed here.
//http://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work
process.on('uncaughtException', function (error) {
    console.log('Server.js Error...continue on.');
    console.log(error.stack);
});


//Sends the Event Viewer Html
app.get('/', function (req, res) {
    res.send('HELLO WORLD');
});

//Kills the Node
app.post('/exit', function (req, res) {
    process.exit();
    res.sendStatus(200);
});

//Instantiate the Server
app.use(express.static(__dirname));
var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});