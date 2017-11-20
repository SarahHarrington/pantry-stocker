var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');
var pg = require('pg');

router.post('/', function (req, res) {
    if (req.isAuthenticated) {
        console.log('Add store post');
        console.log('userid', req.user.id);
        console.log('store', req.body);
        var userInfo = req.user.id;
        var store = req.body;

        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } else {
                var queryText = 'INSERT INTO "stores" ("label", "user_id") VALUES ($1, $2);';
                db.query(queryText, [store.label, userInfo], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                }); // END QUERY
            }
        }); // END POOL
    }
    else {
        console.log('User is not logged in');
        res.send(false);
    }
});

router.get('/userstores', function (req, res) {
    if (req.isAuthenticated) {
        console.log('Get for Stores');
        console.log('userid', req.user.id);
        var userId = req.user.id;
        
        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } else {
                var queryText = 'SELECT * FROM "stores" WHERE "user_id" = $1;';
                db.query(queryText, [userId], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                    }
                }); // END QUERY
            }
        }); // END POOL
    }
    else {
        console.log('User is not logged in');
        res.send(false);
    }
});

router.delete('/:id', function(req, res){
    console.log('req body', req.params.id);
    var storeId = req.params.id;
    if (req.isAuthenticated) {
        console.log('delete store route');
        pool.connect(function(errorConnectingToDb, db, done){
            if (errorConnectingToDb) {
                console.log('Error Connecting', errorConnectingToDb);
                res.sendStatus(500);
            }//end pool if
            else {
                var queryText = 'DELETE from "stores" WHERE "store_id" = $1;'
                db.query(queryText, [storeId],function (errorMakingQuery, result){
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    }//end query if
                    else {
                        res.sendStatus(201);
                    }
                })//end db.query
            }//end pool else
        })//end pool connect
    }//end req authenticated
    else {
        console.log('User is not logged in');
        res.send(false);
    }//end req else authenticated
})//end router delete

module.exports = router;