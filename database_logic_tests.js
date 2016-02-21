/**
 * Created by jhsukei on 2/20/16.
 * THese are test cases don't run unless you need to
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var database_util = require('./database_logic');
var url = 'mongodb://localhost:27017/test';

//Static Table Names
var AUTH_USERS_TABLE = 'authorized_users_table';
var INVENTORY_TABLE = 'inventory_table';
var PATIENT_TABLE = 'patient_table';
var READER_TABLE = 'reader_table';
var SESSION_TABLE = 'session_table';

var TEST_KEY = 'patient.first_name';
var TEST_GOOD_VALUE = 'Ray';
var TEST_BAD_VALUE = 'FUCKDAPOLICE';

var TEST_UPDATE_KEY = 'authorized_user.first_name';
var TEST_PREVIOUS_VALUE = 'Ronking';
var TEST_NEW_VALUE = 'Ron';

var TEST_DELETE_KEY = 'reader.room';
var TEST_DELETE_VALUE = '308';

//Test Happy Path  for findDocumentByTableAndKeyAndValue
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    database_util.findDocumentByTableAndKeyAndValue(db, PATIENT_TABLE, TEST_KEY, TEST_GOOD_VALUE, function (data) {
        if (data != null){
            console.log("Test 1: Passed");
        }
        else if (data == null){
            console.log("Test 1: Failed");
        }
        db.close();
    });
});

////Test Negative Path for findDocumentByTableAndKeyAndValue
//MongoClient.connect(url, function (err, db) {
//    assert.equal(null, err);
//    database_util.findDocumentByTableAndKeyAndValue(db, AUTH_USERS_TABLE, TEST_KEY, TEST_BAD_VALUE, function (data) {
//        if (data != null){
//            console.log("Test 2: Failed");
//        }
//        else if (data == null){
//            console.log("Test 2: Passed");
//        }
//        db.close();
//    });
//});

//Test Happy Path for updateDocumentByTableAndKeyAndValues
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    database_util.updateDocumentByTableAndKeyAndValues(db, AUTH_USERS_TABLE, TEST_UPDATE_KEY, TEST_PREVIOUS_VALUE, TEST_NEW_VALUE, function (data) {
        if (data){
            console.log("Test 3: Passed");
        }
        else if (!data) {
            console.log("Test 3: Failed");
        }
        db.close();
    });
});

//Test Reverse Path for updateDocumentByTableAndKeyAndValues
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    database_util.updateDocumentByTableAndKeyAndValues(db, AUTH_USERS_TABLE, TEST_UPDATE_KEY, TEST_NEW_VALUE, TEST_PREVIOUS_VALUE, function (data) {
        if (data){
            console.log("Test 4: Passed");
        }
        else if (!data) {
            console.log("Test 4: Failed");
        }
        db.close();
    });
});

//removeDocumentByTableAndKeyAndValue
//Need to run INIT_DB script for test to work
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    database_util.removeDocumentByTableAndKeyAndValue(db, READER_TABLE, TEST_DELETE_KEY, TEST_DELETE_VALUE, function (data) {
        if (data){
            console.log("Test 5: Passed");
        }
        else if (!data) {
            console.log("Test 5: Failed");
        }
        db.close();
    });
});
