var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);


exports.getAll = function(callback) {
    var query = 'SELECT * FROM resume_view;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(resume_id, callback) {
    var query = 'SELECT r.*, a.first_name, s.name, c.company_name, sc.school_name FROM resume r '+
        'JOIN resume_skill rs on rs.resume_id = r.resume_id ' +
        'JOIN skill s on s.skill_id = rs.skill_id ' +
        'JOIN resume_school rs on rs.resume_id = r.resume_id' +
        'JOIN school sc on sc.school_id = rs.school_id' +
        'JOIN resume_company rc on rc.resume_id = r.resume_id' +
        'JOIN company c on c.company_id = rc.company_id' +
        'JOIN account a on a.account_id = r.account_id' +
        'WHERE r.resume_id = ?';
    var queryData = [resume_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {
    var query = 'INSERT INTO resume (account_id, resume_name) VALUES (?, ?)';

    // the question marks in the sql query above will be replaced by the values of the
    // the data in queryData
    var queryData = [params.account_id, params.resume_name];

    connection.query(query, queryData, function(err, result) {

        // THEN USE THE resume_ID RETURNED AS insertId AND THE SELECTED skill_IDs INTO resume_skill
        var resume_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';
        var query2 = 'INSERT INTO resume_company (resume_id, company_id) VALUES ?';
        var query3 = 'INSERT INTO resume_school (resume_id, school_id) VALUES ?';

        // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
        var ResumeSkillData = [];
        for(var i=0; i < params.skill_id.length; i++) {
            ResumeSkillData.push([resume_id, params.skill_id[i]]);
        }

        // NOTE THE EXTRA [] AROUND companyAddressData
        connection.query(query, [ResumeSkillData], function(err, result){
            callback(err, result);
        });

        var ResumeCompanyData = [];
        for(var i=0; i < params.company_id.length; i++) {
            ResumeCompanyData.push([resume_id, params.company_id[i]]);
        }
        connection.query(query, [ResumeCompanyData], function(err, result){
            callback(err, result);
        });

        var ResumeSchoolData = [];
        for(var i=0; i < params.school_id.length; i++) {
            ResumeSchoolData.push([resume_id, params.school_id[i]]);
        }
        connection.query(query, [ResumeSchoolData], function(err, result){
            callback(err, result);
        });
    });

};

exports.delete = function(resume_id, callback) {
    var query = 'DELETE FROM resume WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};
// RESUME_SKILL
//declare the function so it can be used locally
var ResumeSkillInsert = function(resume_id, skillIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO resume_skill (resume_id, skill_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var ResumeSkillData = [];
    for(var i=0; i < skillIdArray.length; i++) {
        ResumeSkillData.push([resume_id, skillIdArray[i]]);
    }
    connection.query(query, [ResumeSkillData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.ResumeSkillInsert = ResumeSkillInsert;

//declare the function so it can be used locally
var ResumeSkillDeleteAll = function(resume_id, callback){
    var query = 'DELETE FROM resume_skill WHERE resume_id = ?';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.ResumeSkillDeleteAll = ResumeSkillDeleteAll;

exports.update = function(params, callback) {
    var query = 'UPDATE resume SET resume_name = ? WHERE skill_id = ?';

    var queryData = [params.resume_name, params.skill_id];

    connection.query(query, queryData, function(err, result) {
        //delete resume_skill entries for this resume
        ResumeSkillDeleteAll(params.resume_id, function(err, result){

            if(params.skill_id != null) {
                //insert resume_skill ids
                ResumeSkillInsert(params.resume_id, params.skill_id, function(err, result){
                    callback(err, result);
                });}
            else {
                callback(err, result);
            }
        });

    });
};

/*  Stored procedure used in this example
 DROP PROCEDURE IF EXISTS resume_getinfo;
 DELIMITER //
 CREATE PROCEDURE resume_getinfo (_resume_id int)
 BEGIN
 SELECT * FROM resume WHERE resume_id = _resume_id;
 SELECT s.*, rs.resume_id FROM skill s
 LEFT JOIN resume_skill rs on rs.skill_id = s.skill_id AND resume_id = _resume_id
 ORDER BY s.name;
 END //
 DELIMITER ;
 # Call the Stored Procedure
 CALL resume_getinfo (4);
 */

exports.edit = function(resume_id, callback) {
    var query = 'CALL resume_getinfo(?)';
    var queryData = [resume_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};


