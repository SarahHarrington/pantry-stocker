var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');
var pg = require('pg');

router.post('/', function (req, res) {

    if (req.isAuthenticated()) {
        var userId = req.user.id;
        var storeId = req.body.storeId;
        var itemId = req.body.itemId;
        pool.connect(function (errorConnectingtoDB, db, done) {
            if (errorConnectingtoDB) {
                console.log('Error Connecting to DB', errorConnectingtoDB);
                res.sendStatus(500);
            }
            else {
                var queryText = 'INSERT INTO "shopping_list" ("item_id", "user_id", "store_id") VALUES ($1, $2, $3);';
                db.query(queryText, [itemId, userId, storeId], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error Making Query - Add Item', errorMakingQuery);
                        res.sendStatus(500);
                    }//if query error for item insert in item table
                    else {
                        res.sendStatus(200);
                    }//if query else   
                })//db.query
            }//end else for pool
        })//end pool
    }//if authenticated
    else {
        console.log('User is not logged in');
        res.send(false);
    }//is authenticated
});//router.post for add item to shopping list


module.exports = router;