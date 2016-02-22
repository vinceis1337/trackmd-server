/**
 * Created by jhsukei on 2/20/16.
 */

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';
var database_util = require('./database_logic');

//Static Table Names
var AUTH_USERS_TABLE = 'authorized_users_table';
var INVENTORY_TABLE = 'inventory_table';
var PATIENT_TABLE = 'patient_table';
var READER_TABLE = 'reader_table';
var SESSION_TABLE = 'session_table';

//Static Init Data
var AUTH_USERS_DATA = [
    {
        "authorized_user": {
            "user_uuid": "896b677f-fb14-11e0-b14d-d11ca798dbac",
            "first_name": "John",
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
];
var INVENTORY_DATA = [
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
];
var PATIENT_DATA = {
    "patient": {
        "user_uuid": "12345678-fb14-11e0-b14d-d11c9798dbaf",
        "first_name": "John",
        "last_name": "Doe",
        "age": "30",
        "gender": "male",
        "rfid": "72f5ccec"
    }
};
var READER_DATA = [{
        "reader": {
            "device_uuid": "zzzzzzzz-fb14-11e0-b14d-d11ca798dbac",
            "room": "308",
            "description": "Surgery Room 308"
        }
    },
    {
        "reader": {
            "device_uuid": "yyyyyyyy-fb14-11e0-b14d-d11ca798dbac",
            "room": "389423498",
            "description": "Surgery Room 308"
        }
    }
];
var SESSION_DATA = {
    "session": {
        "authorized_users": [
            {
                "user_uuid": "896b677f-fb14-11e0-b14d-d11ca798dbac"
            },
            {
                "user_uuid": "RONLOLOLL-fb14-11e0-b14d-d11ca798dbac"
            }
        ],
        "patient_users": [
            {
                "user_uuid": "12345678-fb14-11e0-b14d-d11c9798dbaf"
            }
        ],
        "actions_log": [
            {}
        ],
        "taken": [
            {
                "item_uuid": "bbbbbbbb-fb14-11e0-b14d-d11ca798dbac"
            }
        ]
    }
};

//Set up Auth Users
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    database_util.insertDocumentByTableAndManyData(db, AUTH_USERS_TABLE, AUTH_USERS_DATA, function(returnValue){
        if (returnValue != null){
            console.log(returnValue.result);
        }
        else if (returnValue == null){
            console.log("WE FUCKED UP");
        }
        db.close();
    });
});

//Set up Inventory
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    database_util.insertDocumentByTableAndManyData(db, INVENTORY_TABLE, INVENTORY_DATA, function(returnValue){
        if (returnValue != null){
            console.log(returnValue.result);
        }
        else if (returnValue == null){
            console.log("WE FUCKED UP");
        }
        db.close();
    });
});

//Set Up Patient Data
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    database_util.insertDocumentByTableAndSingleData(db, PATIENT_TABLE, PATIENT_DATA, function(returnValue){
        if (returnValue != null){
            console.log(returnValue.result);
        }
        else if (returnValue == null){
            console.log("WE FUCKED UP");
        }
        db.close();
    });
});

//Set up Reader Data
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    database_util.insertDocumentByTableAndManyData(db, READER_TABLE, READER_DATA, function(returnValue){
        if (returnValue != null){
            console.log(returnValue.result);
        }
        else if (returnValue == null){
            console.log("WE FUCKED UP");
        }
        db.close();
    });
});

//Set up Session Table
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    database_util.insertDocumentByTableAndSingleData(db, SESSION_TABLE, SESSION_DATA, function(returnValue){
        if (returnValue != null){
            console.log(returnValue.result);
        }
        else if (returnValue == null){
            console.log("WE FUCKED UP");
        }
        db.close();
    });
});