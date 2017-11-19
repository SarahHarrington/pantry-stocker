var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');
var pg = require('pg');

router.post('/', function (req, res) {
    if (req.isAuthenticated) {
        console.log('Add pantry post');
        console.log('userid', req.user.id);
        console.log('pantry', req.body);
        var userInfo = req.user.id;
        var pantry = req.body;

        pool.connect(function (errorConnectingToDb, db, done) {
            if (errorConnectingToDb) {
                console.log('Error connecting', errorConnectingToDb);
                res.sendStatus(500);
            } else {
                var queryText = 'INSERT INTO "pantry" ("label", "user_id") VALUES ($1, $2);';
                db.query(queryText, [pantry.label, userInfo], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }//END if else
                }); // END QUERY
            }//END ELSE
        }); // END POOL
    }//end of authentication if
    else {
        console.log('User is not logged in');
        res.send(false);
    }//end of authenication else
});//end of post for pantries

module.exports = router;