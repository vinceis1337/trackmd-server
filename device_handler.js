/**
 * Created by jhsukei on 2/20/16.
 */

var express = require('express'),
    bodyParser = require('body-parser'),
    SessionState = require('./session_state');

var database_util = require('./database_logic');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';
var app = express();

app.use(bodyParser.json());

var AUTH_USERS_TABLE = 'authorized_users_table';
var INVENTORY_TABLE = 'inventory_table';
var PATIENT_TABLE = 'patient_table';
var READER_TABLE = 'reader_table';
var SESSION_TABLE = 'session_table';

var SESSION_IDLE = 'SESSION_IDLE';
var SESSION_TAKE = 'SESSION_TAKE';
var SESSION_LIVE =  'SESSION_LIVE';

var session_state;


//Work around to keep node from crashing. Will require a restart...maybe...idk...
//TODO: Implement that DOMAIN/Cluster pattern detailed here.
//http://stackoverflow.com/questions/5999373/how-do-i-prevent-node-js-from-crashing-try-catch-doesnt-work
process.on('uncaughtException', function (error) {
    console.log('Server.js Error...continue on.');
    console.log(error.stack);
});

//Retrieve All session to and assign to state class
//Need to filter sessions later
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    database_util.findAllDocumentsByTable(db, SESSION_TABLE, function (data) {
        if (!session_state) {
            console.log("New Session State Initialized");
            session_state = new SessionState(null, [], [], [], [], SESSION_IDLE);
            session_state.session = data.session;
        }
        console.log('\n POST THING\n' + JSON.stringify(session_state.session));
        db.close();
    });
});


//Sends the Event Viewer Html
app.get('/', function (req, res) {
    res.send('HELLO WORLD');
});

app.post('/rfid', function (req, res) {
    var currentRFID = req.body.rfid;
    console.log(currentRFID);

    //res.json({message: ['HELLOW WORLD!!!' , 'ALSO RFID: ' + currentRFID]});

    MongoClient.connect(url, function (err, db, callback) {
        assert.equal(null, err);

        if (session_state.state == SESSION_IDLE) {
            database_util.findDocumentByTableAndKeyAndValue(db, AUTH_USERS_TABLE, "authorized_user.rfid", currentRFID, function (data) {
                if (data == null) {
                    var message = {message: ['ERROR: SESSION = IDLE', 'Need Auth User Sign IN']};
                    console.log("Sending to LCD: " + JSON.stringify(message));
                    res.json(message);
                }
                else {
                    session_state.authorizedUserAction(data.authorized_user.user_uuid, function (actionType, error, takenArray) {
                        var message = {message: ['Successful Sign ' + actionType, 'Hello ' + data.authorized_user.first_name + ' ' + data.authorized_user.last_name]};
                        console.log("Sending to LCD: " + JSON.stringify(message));
                        res.json(message);
                    });
                }
                closeFinally(db);
            });
        }
        else if(session_state.state == SESSION_TAKE || session_state.state == SESSION_LIVE) {
            database_util.findDocumentByTableAndKeyAndValue(db, AUTH_USERS_TABLE, "authorized_user.rfid", currentRFID, function (data) {
                if (data == null) {
                    database_util.findDocumentByTableAndKeyAndValue(db, PATIENT_TABLE, "patient.rfid", currentRFID, function (data) {
                        if (data == null) {
                            database_util.findDocumentByTableAndKeyAndValue(db, INVENTORY_TABLE, "item.rfid", currentRFID, function (data) {
                                console.log("did we reach here");
                                if (data == null) {
                                    var message = {message: ['ERROR: RFID NOT FOUND', "RFID: " + currentRFID]};
                                    console.log("Sending to LCD: " + JSON.stringify(message));
                                    res.json(message);
                                    closeFinally(db);
                                }
                                else {

                                    session_state.itemAction(data.item.item_uuid, data.item.description, function(actionType) {
                                        var message = {message: ['Item Successfully Taken ' + actionType, data.item.description]};
                                        console.log("Sending to LCD: " + JSON.stringify(message));
                                        res.json(message);
                                    });
                                    console.log('\n POST THING\n' + JSON.stringify(data));
                                    closeFinally(db);
                                }
                            });
                        }
                        else {
                            session_state.patientUserAction(data.patient.user_uuid, function (actionType, error, takenArray) {
                                if (!error) {
                                    var message = {message: ['Successful Sign ' + actionType, 'Hello ' + data.patient.first_name + ' ' + data.patient.last_name]};
                                    console.log("Sending to LCD: " + JSON.stringify(message));
                                    res.json(message);
                                }
                                else {
                                    var message = {message: ['WARNING ITEMS LEFT BEHIND', 'RFIDs Detected: ' + takenArray]};
                                    console.log("Sending to LCD: " + JSON.stringify(message));
                                    res.json(message);
                                }
                            });
                            console.log('\n POST THING\n' + JSON.stringify(data));
                            closeFinally(db);
                        }
                    });
                }
                else {
                    session_state.authorizedUserAction(data.authorized_user.user_uuid, function (actionType, error, takenArray) {
                        if (!error) {
                            var message = {message: ['Successful Sign ' + actionType, 'Hello ' + data.authorized_user.first_name + ' ' + data.authorized_user.last_name]};
                            console.log("Sending to LCD: " + JSON.stringify(message));
                            res.json(message);
                        }
                        else {
                            var message = {message: ['WARNING ITEMS LEFT BEHIND', 'Detected: ' + takenArray]};
                            console.log("Sending to LCD: " + JSON.stringify(message));
                            res.json(message);
                        }
                    });
                    closeFinally(db);
                }
            });
        }
    });

    if (session_state.state == SESSION_IDLE) {
        //write session and set session.readOnly = TRUE
    }

    //MongoClient.connect(url, function (err, db) {
    //    assert.equal(null, err);
    //    findDocumentByTableAndRFID(db, AUTH_USERS_TABLE, currentRFID, function () {
    //        db.close();
    //    });
    //});
    //res.sendStatus(200);
});

function closeFinally(db) {
    db.close();
}

////Helper Method to get AuthUserByRFID
//var findDocumentByTableAndRFID = function (db, table, rfid, callback) {
//    var cursor = db.collection(table).find({"authorized_user.rfid": rfid});
//    cursor.each(function (err, doc) {
//        assert.equal(err, null);
//        if (doc == null) {
//            ""
//        }
//        if (doc != null) {
//            console.dir(doc);
//            proccessAuthUsersReturnValues(doc);
//        } else {
//            callback();
//        }
//    });
//};
//
//var proccessAuthUsersReturnValues = function (document) {
//    var authUserUuid = document.authorized_user.user_uuid;
//    console.log('\nPLEASE GOD\n' + document.authorized_user.user_uuid);
//    //Match User UUID to open Session
//    MongoClient.connect(url, function (err, db) {
//        assert.equal(null, err);
//        findDocumentByTableAndUserUuid(db, SESSION_TABLE, authUserUuid, function () {
//            db.close();
//        });
//    });
//};
//
//var findDocumentByTableAndUserUuid = function (db, table, user_uuid, callback) {
//    var cursor = db.collection(table).find({"session.authorized_users.user_uuid": user_uuid});
//    cursor.each(function (err, doc) {
//        assert.equal(err, null);
//        if (doc != null) {
//            var jsonDoc = JSON.stringify(doc);
//            console.dir(jsonDoc);
//            console.log('\n PLEASE GOD WORK PLEASE\n' + doc.session.taken[0].item_uuid);
//            //Do stuff here
//        } else {
//            console.log('wat');
//            callback();
//        }
//    });
//};

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
