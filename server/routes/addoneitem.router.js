var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');
var pg = require('pg');

router.post('/', function (req, res) {
    console.log('add item post');
    console.log('userid', req.user.id)
    console.log(req.body);
    if (req.isAuthenticated()) {
        console.log('add item post');
        var userInfo = req.user.id;
        var itemLabel = req.body.itemLabel;
        var addItemtoPantries = req.body.addItemtoPantries;
        var newItemMinimumQty = req.body.newItemMinimumQty;
        pool.connect(function (errorConnectingtoDB, db, done) {
            if (errorConnectingtoDB) {
                console.log('Error Connecting to DB', errorConnectingtoDB);
                res.sendStatus(500);
            }
            else {
                var queryText = 'INSERT INTO "Items" ("item_name", "user_id", "min_quantity") VALUES ($1, $2, $3) RETURNING "item_id";'
                db.query(queryText, [itemLabel, userInfo, newItemMinimumQty], function (errorMakingQuery, result) {
                        if (errorMakingQuery) {
                            console.log('Error Making Query - Add Item', errorMakingQuery);
                            res.sendStatus(500);
                        }//if query error for item insert in item table
                        else {
                            for (var i = 0; i < addItemtoPantries.length; i++) {
                                db.query('INSERT INTO "stock" ("item_id", "quantity", "pantry_location") VALUES ($1, $2, $3);',
                                    [result.rows[0].item_id, addItemtoPantries[i].quantity, addItemtoPantries[i].pantry_id], function (errorMakingQuery, result) {
                                        done();
                                        if (errorMakingQuery) {
                                            console.log('Error Making Query - Add new item to stock', errorMakingQuery);
                                            res.sendStatus(500);
                                            return
                                        }//if for item stock insert
                                    })
                            }//end of for loop
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
});//router.post for add item

router.put('/:id', function (req, res) {
    console.log('req.params.id', req.params.id);
    console.log('req.body', req.body);
    if (req.isAuthenticated) {
        var itemtoUpdate = req.params.id;
        var itemQuantity = req.body.quantity;
        itemQuantity = itemQuantity += 1;
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

router.get('/itemstockmin/:id', function(req, res){
        if (req.isAuthenticated) {
            var itemId = req.params.id;

            pool.connect(function (errorConnectingtoDB, db, done) {
                var queryText =
                    'SELECT "total_quantity", "min_quantity"' +
                    'FROM "stock_totals"' +
                    'WHERE "item_id" = $1;';
                db.query(queryText, [itemId], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('itemstock verify', result.rows);
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