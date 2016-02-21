/**
 * Created by jhsukei on 2/20/16.
 */

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    setUpSession(db, function(){
        db.close();
    });
});

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    setUpPatient(db, function(){
        db.close();
    });
});

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    setUpReader(db, function(){
        db.close();
    });
});

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    setUpItems(db, function(){
        db.close();
    });
});

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    setUpAuthorizedUsers(db, function(){
        db.close();
    });
});



var setUpSession = function(db, callback) {
    db.collection('session_table').insertOne( {
        "session": {
            "authorized_users": [
                {
                    "user_uuid": "896b677f-fb14-11e0-b14d-d11ca798dbac"
                },
                {
                    "user_uuid": "asffdasd-fb14-11e0-b14d-d11ca798dbad"
                },
                {
                    "user_uuid": "sdfsdfsf-fb14-11e0-b14d-d11ca798dbae"
                }
            ],
            "patient_users": [
                {
                    "user_uuid": "12345678-fb14-11e0-b14d-d11c9798dbaf"
                }
            ],
            "actions_log": [
                {
                }
            ],
            "taken": [
                {
                    "item_uuid": "bbbbbbbb-fb14-11e0-b14d-d11ca798dbac"
                }
            ]
        }
    }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the session_table collection.");
        callback();
    });
};

var setUpPatient = function(db, callback) {
    db.collection('patient_table').insertOne( {
        "patient": {
            "user_uuid": "12345678-fb14-11e0-b14d-d11c9798dbaf",
            "first_name": "Ray",
            "last_name": "Sunbo",
            "age": "30",
            "gender": "male",
            "rfid": "3295019250102"
        }
    }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the patient_table collection.");
        callback();
    });
};

var setUpReader = function(db, callback) {
    db.collection('reader_table').insertOne( {
        "reader": {
            "device_uuid": "zzzzzzzz-fb14-11e0-b14d-d11ca798dbac",
            "room": "308",
            "description": "Surgery Room 308"
        }
    }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the session_table collection.");
        callback();
    });
};

var setUpItems = function(db, callback) {
    db.collection('inventory_table').insertMany([
        {
            "item": {
                "item_uuid": "bbbbbbbb-fb14-11e0-b14d-d11ca798dbac",
                "rfid": "3125512550102",
                "description": "Surgical Clamp, Stainless Steel",
                "single_use_only": false,
                "status": "ready",
                "timestamp": "2015-12-21T16:00:00"
            }
        },
        {
            "item": {
                "item_uuid": "cccccccc-fb14-11e0-b14d-d11ca798dbac",
                "rfid": "04ca6a32a03c80",
                "description": "Scalpel, Stainless Steel",
                "single_use_only": false,
                "status": "ready",
                "timestamp": "2015-12-21T16:00:00"
            }
        },
        {
            "item": {
                "item_uuid": "dddddddd-fb14-11e0-b14d-d11ca798dbac",
                "rfid": "04ab6a32a03c80",
                "description": "Sponge, Spongeysponge",
                "single_use_only": true,
                "status": "ready",
                "timestamp": "2015-12-21T16:00:00"
            }
        },
        {
            "item": {
                "item_uuid": "eeeeeeee-fb14-11e0-b14d-d11ca798dbac",
                "rfid": "04ee6a32a03c80",
                "description": "Drill, Stainless Steel",
                "single_use_only": false,
                "status": "ready",
                "timestamp": "2015-12-21T16:00:00"
            }
        }
    ], function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the inventory_table collection.");
        callback();
    });
};

var setUpAuthorizedUsers = function(db, callback) {
    db.collection('authorized_users_table').insertMany([
        {
            "authorized_user": {
                "user_uuid": "896b677f-fb14-11e0-b14d-d11ca798dbac",
                "first_name": "Ronking",
                "last_name": "Doctorman",
                "occupation": "Doctor of Internal Medicine",
                "gender": "female",
                "rfid": "c2f5ccec"

            }
        },
        {
            "authorized_user": {
                "user_uuid": "RONLOLOLL-fb14-11e0-b14d-d11ca798dbac",
                "first_name": "Nurse",
                "last_name": "Ron",
                "occupation": "Nurse Ronald",
                "gender": "male",
                "rfid": "3277aeec"
            }
        }
    ], function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the session_table collection.");
        callback();
    });
};