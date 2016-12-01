var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);


exports.getAll = function(callback) {
    var query = 'SELECT * FROM school_view;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(school_id, callback) {
    var query = 'SELECT * FROM school_view WHERE school_id = ?';
    var queryData = [school_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO school (school_name, address_id) VALUES (?, ?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.school_name, params.address_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

}

exports.delete = function(school_id, callback) {
    var query = 'DELETE FROM school WHERE school_id = ?';
    var queryData = [school_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};


