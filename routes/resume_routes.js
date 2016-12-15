var express = require('express');
var router = express.Router();
var resume_dal = require('../model/resume_dal');
var account_dal = require('../model/account_dal');
var skill_dal = require('../model/skill_dal');
var company_dal = require('../model/company_dal');
var school_dal = require('../model/school_dal');


// View All resume
router.get('/all', function(req, res) {
    resume_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('resume/resumeViewAll', { 'result':result });
        }
    });

});

// View the resume for the given id
router.get('/', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('resume/resumeViewById', {'result': result});
            }
        });
    }
});

// Return the add a new resume form
router.get('/add', function(req, res) {
    // passing all the query parameters (req.query) to the insert function instead of each individually
    account_dal.getAll(function (err, result1) {
        if (err) {
            res.send(err);
        }
        else {
            skill_dal.getAll(function (err, result2) {
                if (err) {
                    res.send(err);
                }
                else {
                    company_dal.getAll(function (err, result3) {
                        if (err) {
                            res.send(err);
                        }
                        else {
                            school_dal.getAll(function (err, result4) {
                                if (err) {
                                    res.send(err);
                                }
                                else {
                                    res.render('resume/resumeAdd', {'account': result1, 'skill': result2,'company': result3,  });
                                    res.render('resume/resumeAdd', {});
                                    res.render('resume/resumeAdd', {'company': result3});
                                    res.render('resume/resumeAdd', {'school': result4});
                                }
                            })

                        }
                    })
                }
            })
        }
    })
});
// insert a resume record
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.resume_name == null) {
        res.send('Resume Name must be provided.');
    }
    else if(req.query.account_id == null) {
        res.send('An account must be selected');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        resume_dal.insert(req.query, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        })

    }
});

router.get('/edit2', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');

    }
    else {
        resume_dal.edit(req.query.resume_id, function(err, result){
            console.log(result);
            res.render('resume/resumeUpdate', {resume: result[0][0], skill: result[1]});
        });
    }

});

router.get('/edit', function(req, res){
    if(req.query.resume_id == null) {
        res.send('A resume id is required');
    }
    else {
        resume_dal.getById(req.query.resume_id, function(err, resume){
            account_dal.getAll(function(err, account) {
                skill_dal.getAll(function(err, skill) {
                    company_dal.getAll(function(err, company) {
                        school_dal.getAll(function(err, school) {
                            res.render('resume/resumeUpdate', {
                                resume: company[0],
                                account: account,
                                skill: skill,
                                company: company,
                                school: school
                            });
                        });
                    });
                });
            });
        });
    }
});

// Delete a resume for the given resume_id
router.get('/delete', function(req, res){
    if(req.query.resume_id == null) {
        res.send('resume_id is null');
    }
    else {
        resume_dal.delete(req.query.resume_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/resume/all');
            }
        });
    }
});



module.exports = router;