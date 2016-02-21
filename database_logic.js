/**
 * Created by jhsukei on 2/20/16.
 */
var assert = require('assert');

module.exports =
{
    //Generic
    //PARAMS: db, table, key, value
    //RETURNS: Document if found
    //         NULL if not found
    //         WILL ONLY RETURN 1 DOCUMENT
    findDocumentByTableAndKeyAndValue: function (db, table, key, value, callback) {
        var query = {};
        query[key] = value;
        console.log(query);

        var cursor = db.collection(table).find(query);

        var parseCollection = function() {
            cursor.next(function(err, doc){
                if (err)
                    return console.error(err);
                console.dir(doc);
                shitFound = true;
                callback(doc);
                //hasNextCollection();
            });
        };

        var hasNextCollection= function() {
            cursor.hasNext(function(err, result){
                if (err)
                    return console.error(err);

                if (result)
                    parseCollection();
                else {
                    //Here is the last point of iterations
                    //We can use this for statistics output
                    callback(null);
                }
            });
        };

        hasNextCollection();
    },

    //Generic Update Document
    //PARAMS: db, table, key, previousValue, newValue
    //Returns: TRUE if updated successfully
    //         FALSE if not found
    updateDocumentByTableAndKeyAndValues: function(db, table, key, previousValue, newValue, callback) {
        var query = {};
        query[key] = previousValue;

        var query2 = {};
        query2[key] = newValue;

        console.log(query);
        console.log(query2);

        db.collection(table).updateOne(
            query,
            {
                $set: query2,
                $currentDate: {"lastModified": true}
            }, function (err, results) {

                if (results.result.nModified > 0) {
                    console.log(results.result);
                    callback(true);
                }
                else if (results.result.nModified  == 0) {
                    console.log(err);
                    callback(false);
                }
            });
    },

    //Generic DELETE field in a Document
    //PARAMS: db, table, key, value
    //Returns: TRUE if deleted successfully
    //         FALSE if not found
    removeDocumentByTableAndKeyAndValue: function(db, table, key, value, callback) {
        var query = {};
        query[key] = value;

        db.collection(table).deleteOne(
            query,
            function (err, results) {
                if (results.result.n > 0) {
                    console.log(results.result);
                    callback(true);
                }
                else if (results.result.n == 0) {
                    callback(false);
                }
            }
        );
    },

    //Generic INSERT Document into a table singleData entity
    //PARAMS: db, table, data(in json)
    //Returns: The document added inserted successfully
    //         null if not inserted successfully
    insertDocumentByTableAndSingleData: function(db, table, data, callback) {
        db.collection(table).insertOne(data, function (err, result) {
            assert.equal(err, null);
            if (err == null) {
                console.log("Inserted a document into the " + table + " collection.");
                callback(result);
            }
            else if (err != null) {
                callback(null);
            }
        });
    },

    //Generic INSERT Document into a table with manyData entities
    //PARAMS: db, table, data(in json)
    //Returns: The document added inserted successfully
    //         null if not inserted successfully
    insertDocumentByTableAndManyData: function(db, table, data, callback) {
        db.collection(table).insertMany(data, function (err, result) {
            assert.equal(err, null);
            if (err == null) {
                console.log("Inserted a document into the " + table + " collection.");
                callback(result);
            }
            else if (err != null) {
                callback(null);
            }
        });
    }
};