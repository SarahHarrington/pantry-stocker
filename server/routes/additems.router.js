var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');
var pg = require('pg');


//router to add item
router.post('/', function (req, res) {
    if (req.isAuthenticated()) {
        console.log('add item post');
        var userInfo = req.user.id;
        var item = req.body;
        console.log('userid', req.user.id)
        console.log(req.body);
        pool.connect(function (errorConnectingtoDB, db, done) {
            if (errorConnectingtoDB) {
                console.log('Error Connecting to DB', errorConnectingtoDB);
                res.sendStatus(500);
            }
            else {
                db.query('INSERT INTO "Items" ("item_name", "user_id", "default_store_id") VALUES ($1, $2, $3) RETURNING "item_id";',
                    [item.itemName, userInfo, item.itemStore], function (errorMakingQuery, result) {
                        if (errorMakingQuery) {
                            console.log('Error Making Query - Add Item', errorMakingQuery);
                            res.sendStatus(500);
                        }//if query error for item insert in item table
                        else {                            
                            db.query('INSERT INTO "stock" ("item_id", "quantity", "min_quantity", "pantry_location") VALUES ($1, $2, $3, $4);',
                                [result.rows[0].item_id, item.itemQuantity, item.reminderQuantity, item.itemPantry], function (errorMakingQuery, result) {
                                    done();
                                    if (errorMakingQuery) {
                                        console.log('Error Making Query - Add Item to Stock', errorMakingQuery);
                                        res.sendStatus(500);
                                    }//if for item stock insert
                                    else {
                                        res.sendStatus(201);
                                    }//item stock insert
                                })//db.query 
                        }//if query else   
                    })//db.query
            }//end else for pool
        })//end pool
    }//if authenticated
    else {
        console.log('User is not logged in');
        res.send(false);
    }//is authenticated
});//router.post for add item


module.exports = router;