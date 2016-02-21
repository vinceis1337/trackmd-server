/**
 * Created by jhsukei on 2/20/16.
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs');

var app = express();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';

app.use( bodyParser.json() );

var AUTH_USERS_TABLE = 'authorized_users_table';
var INVENTORY_TABLE = 'inventory_table';
var PATIENT_TABLE = 'patient_table';
var READER_TABLE = 'reader_table';
var SESSION_TABLE = 'session_table';

var SESSION_IDLE = true;
var SESSION_LIVE = true;
var SESSION_TAKE = true;


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

app.post('/rfid', function (req, res){
   var currentRFID = req.body.rfid;
    console.log(currentRFID);

    if(SESSION_IDLE) {
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            findDocumentByTableAndRFID(db, AUTH_USERS_TABLE, currentRFID, function (data) {
                db.close();
                respondToIoTDevice(data);
            });
        });
    }
    else if (!SESSION_IDLE){
        console.log("Auth USER Needed to start Session");
    }
});

function respondToIoTDevice(data) {
    if (data.error) {
        res.send(data.error);
        return;
    }
    res.send(data.message);
}

//Helper method for checking if the RFID scanned is in the Auth User
var findDocumentByTableAndRFID = function(db, table, rfid, callback) {
    var cursor =db.collection(table).find({"authorized_user.rfid" : rfid});
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc == null) {
            console.log("No matching AuthUser RFID found");
            //Send some error messaging to the Edison.

            var data;
            data.push({"error": "No matching AuthUser RFID found"});
            callback(data);
        }
        if (doc != null) {
            console.dir(doc);
            processAuthUsersReturnValues(doc);
        } else {
            callback();
        }
    });
};

//If we found a matching Auth User
//We now take that users user_uuid
var processAuthUsersReturnValues = function(document){
    var authUserUuid = document.authorized_user.user_uuid;
    console.log('\nPLEASE GOD\n' + document.authorized_user.user_uuid);
    //Match User UUID to open Session
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findDocumentByTableAndUserUuid(db, SESSION_TABLE, authUserUuid, function() {
            db.close();
        });
    });
};

//We are verifying the Authorized User is in a valid Session
//We do this by searching for the Auth User's user_uuid
//If found set state to TAKE
var findDocumentByTableAndUserUuid = function(db, table, user_uuid, callback) {
    var cursor =db.collection(table).find({"session.authorized_users.user_uuid" : user_uuid});
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if(doc == null) {
            console.log("user_uuid not found in valid sessions");
            //Send Errors
        }
        if (doc != null) {
            var jsonDoc = JSON.stringify(doc);
            console.dir(jsonDoc);
            //console.log('\n PLEASE GOD WORK PLEASE\n' + doc.session.taken[0].item_uuid);
            //Change State to Take
        } else {
            callback();
        }
    });
};

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