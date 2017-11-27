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

router.get('/checkitem/:id', function (req, res) {
    console.log('req params', req.params.id);
    if (req.isAuthenticated) {
        var userId = req.user.id;
        var itemId = req.params.id;
        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText =
                'SELECT COUNT(*) AS c FROM "shopping_list" WHERE item_id = $1 AND user_id = $2;';
            db.query(queryText, [itemId, userId], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                    console.log(result.rows);

                }
            })
        })
    }
    else {
        console.log('User is not logged in');
        res.send(false);
    }
})

router.get('/allitems/:id', function (req, res) {
    // console.log('req params', req.params.id);
    if (req.isAuthenticated) {
        var userId = req.user.id;
        var storeId = Number.parseInt(req.params);
        console.log('router get stores list', storeId);
        
        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText =
                'SELECT "shopping_list"."item_id", "shopping_list"."store_id", "shopping_list"."desired_qty", "shopping_list"."purchased_amount",' +
                '"shopping_list"."custom_item", "stores"."label", "Items"."item_name"' +
                'FROM "shopping_list" LEFT OUTER JOIN "Items"' +
                'ON("shopping_list"."item_id" = "Items"."item_id")' +
                'RIGHT OUTER JOIN "stores"' +
                'ON("shopping_list"."store_id" = "stores"."store_id")' +
                'WHERE "shopping_list"."user_id" = $1 AND "shopping_list"."store_id" = $2;'
            db.query(queryText, [userId, storeId], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                    console.log(result.rows);
                }
            })
        })
    }
    else {
        console.log('User is not logged in');
        res.send(false);
    }
})

module.exports = router;