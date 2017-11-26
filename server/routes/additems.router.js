var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');
var pg = require('pg');

//route for getting pantries by logged in user
router.get('/mypantries/:id', function(req, res){
    console.log('req params', req.params.id);
    if(req.isAuthenticated) {
        var userId = req.user.id; 
        var pantryId = req.params.id;
        pool.connect(function(errorConnectingtoDB, db, done){
            var queryText = 
            'SELECT "Items"."item_name", "Items"."item_id", "Items"."default_store_id", "stock"."quantity", "stock"."pantry_location"' +
            'FROM "stock" JOIN "Items"' +
            'ON "stock"."item_id" = "Items"."item_id"' +
            'WHERE "stock"."pantry_location" = $1;';
            db.query(queryText, [pantryId], function (errorMakingQuery, result) {
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

//route for getting all items for the logged in user
router.get('/allitems', function (req, res) {
    if (req.isAuthenticated) {
        var userId = req.user.id;

        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText =
                'SELECT "Items"."item_id", "Items"."item_name", "Items"."default_store_id", "Items"."min_quantity", "stores"."store_id", "stores"."label"' +
                'FROM "Items" LEFT OUTER JOIN "stores"' +
                'ON("Items"."default_store_id" = "stores"."store_id")' +
                'WHERE "Items"."user_id" = $1;';
            db.query(queryText, [userId], function (errorMakingQuery, result) {
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

//route to delete an item from pantry page
router.put('/removeitem/:id', function(req, res){
    console.log('req params', req.params);
    console.log('req body', req.body);
    
    if (req.isAuthenticated) {
        var itemToDelete = req.params.id;
        var itemPantry = req.body.pantry_location;
        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText = 'DELETE FROM "stock" WHERE "item_id" = $1 AND "pantry_location" = $2;';
            db.query(queryText, [itemToDelete, itemPantry], function (errorMakingQuery, result) {
                done();
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

//route to get stock totals
router.get('/itemstock/:id', function (req, res) {
    console.log('req params', req.params.id);
    if (req.isAuthenticated) {
        var itemId = req.params.id;
        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText =
                'SELECT "pantry"."pantry_id", "pantry"."label", "stock"."quantity"' + 
                'FROM "pantry" LEFT OUTER JOIN "stock"' + 
                'ON("stock"."pantry_location" = "pantry"."pantry_id" and "stock"."item_id" = $1);';
            db.query(queryText, [itemId], function (errorMakingQuery, result) {
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