var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pg = require('pg');


//router to add item
router.post('/', function (req, res) {
    if(req.isAuthenticated()) {
        console.log('add item post');
        var userInfo = req.user._id;
        console.log('userid', req.user._id);
        
    //    var queryText = 'INSERT INTO "items" '
    //     db.query(queryText, [], function(errorMakingQuery, result){
    //         if(errorMakingQuery) {
    //             console.log('Error Making Query - Add Item', errorMakingQuery);
    //             res.sendStatus(500);
    //         }//if query error
    //         else{
    //             res.sendStatus(201);
    //         }//if query else
    //     })//db.query
    // }//if authenticated
    // else {
    //     console.log('User is not logged in');
    //     res.send(false);
    }//is authenticated
});//router.post for add item



module.exports = router;