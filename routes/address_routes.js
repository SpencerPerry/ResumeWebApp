var express = require('express');
var router = express.Router();
var address_dal = require('../model/address_dal');


// View All address
router.get('/all', function(req, res) {
    address_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('address/addressViewAll', { 'result':result });
        }
    });

});

// View the address for the given id
router.get('/', function(req, res){
    if(req.query.address_id == null) {
        res.send('address_id is null');
    }
    else {
        address_dal.getById(req.query.address_id, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('address/addressViewById', {'result': result});
           }
        });
    }
});

module.exports = router;
