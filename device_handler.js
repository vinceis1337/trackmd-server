function deviceHandler() {
    var session_state = new sessionState();

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

    app.use(bodyParser.json());

    var AUTH_USERS_TABLE = 'authorized_users_table';
    var INVENTORY_TABLE = 'inventory_table';
    var PATIENT_TABLE = 'patient_table';
    var READER_TABLE = 'reader_table';
    var SESSION_TABLE = 'session_table';

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

    app.post('/rfid', function (req, res) {
        var currentRFID = req.body.rfid;
        var deviceID = req.body.deviceid;
        console.log(currentRFID);

        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            findDocumentByTableAndRFID(db, AUTH_USERS_TABLE, currentRFID, function () {
                db.close();
            });
        });
        res.sendStatus(200);
    });

    //Helper Method to get AuthUserByRFID
    var findDocumentByTableAndRFID = function (db, table, rfid, callback) {
        var cursor = db.collection(table).find({"authorized_user.rfid": rfid});
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc == null) {
                ""
            }
            if (doc != null) {
                console.dir(doc);
                proccessAuthUsersReturnValues(doc);
            } else {
                callback();
            }
        });
    };

    var proccessAuthUsersReturnValues = function (document) {
        var authUserUuid = document.authorized_user.user_uuid;
        console.log('\nPLEASE GOD\n' + document.authorized_user.user_uuid);
        //Match User UUID to open Session
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            findDocumentByTableAndUserUuid(db, SESSION_TABLE, authUserUuid, function () {
                db.close();
            });
        });
    };

    var findDocumentByTableAndUserUuid = function (db, table, user_uuid, callback) {
        var cursor = db.collection(table).find({"session.authorized_users.user_uuid": user_uuid});
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                var jsonDoc = JSON.stringify(doc);
                console.dir(jsonDoc);
                console.log('\n PLEASE GOD WORK PLEASE\n' + doc.session.taken[0].item_uuid);
                //Do stuff here
            } else {
                console.log('wat');
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
}