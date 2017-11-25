var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');
var pg = require('pg');

router.put('/:id', function (req, res) {
    console.log('req.params.id', req.params.id);
    console.log('req.body', req.body);
    if (req.isAuthenticated) {
        var itemtoUpdate = req.params.id;
        var itemQuantity = req.body.quantity;
        itemQuantity = itemQuantity -= 1;
        var pantryId = req.body.pantry_location;
        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText = 
            'UPDATE "stock"' +
            'SET "quantity" = $1' +
            'WHERE "item_id" = $2 AND "pantry_location" = $3;';
            db.query(queryText, [itemQuantity, itemtoUpdate, pantryId], function (errorMakingQuery, result) {
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
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


module.exports = router;