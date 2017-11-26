var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');
var pg = require('pg');


router.put('/mininmumquantity/:id', function (req, res) {
    // console.log('req params', req.params.id);
    console.log('req body', req.body);

    if (req.isAuthenticated) {
        var newMinQty = req.body.itemMin;
        var itemId = req.params.id;
        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText = 
            'UPDATE "Items"' +
            'SET "min_quantity" = $1' +
            'WHERE "item_id" = $2;';
            db.query(queryText, [newMinQty, itemId], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    console.log('min quanity updated!');
                    res.sendStatus(200);
                }//end else for second query
            })//end db.query for stock table
        })//end pool connect
    }//end if authenticted
    else {
        console.log('User is not logged in');
        res.send(false);
    }//end authenticated else
})

router.put('/remove/oneitem/:id', function(req, res){
    console.log('req.params.id', req.params.id);
    console.log('req.body', req.body);
    
})

module.exports = router;