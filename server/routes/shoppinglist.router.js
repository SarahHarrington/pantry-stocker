var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');
var pg = require('pg');

//puts items on shopping lists
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

//check if item is already on shopping list
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

//get shopping list items
router.get('/allitems/:id', function (req, res) {
    if (req.isAuthenticated) {
        var userId = req.user.id;
        var storeId = req.params.id;
        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText =
                'SELECT "shopping_list"."item_id", "shopping_list"."store_id", "shopping_list"."desired_qty", "shopping_list"."purchased_amount",' +
                '"shopping_list"."custom_item", "stores"."label", "Items"."item_name", "shopping_list"."item_purchased"' +
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

router.put('/deleteitem/:id', function (req, res) {
    var storeId = req.body.store_id;
    var itemId = req.params.id;
    var userId = req.user.id;
    if (req.isAuthenticated) {
        console.log('router delete item from stores list', storeId, itemId, userId);

        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText =
                'DELETE FROM "shopping_list" WHERE "store_id" = $2 AND "user_id" = $3 AND "item_id" = $1'
            db.query(queryText, [itemId, storeId, userId], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            })
        })
    }
    else {
        console.log('User is not logged in');
        res.send(false);
    }
})

//updates items 
router.put('/updateitem/:id', function (req, res) {
    var storeId = req.body.store_id;
    var itemId = req.params.id;
    var userId = req.user.id;
    var desiredQty = req.body.desired_qty;
    var purchasedQty = req.body.purchased_amount;
    var purchased = req.body.item_purchased;
    if (req.isAuthenticated) {
        console.log('router update item from stores list', storeId, itemId, userId, desiredQty, purchasedQty, purchased);

        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText =
                'UPDATE "shopping_list"' +
                'SET "desired_qty" = $4, "purchased_amount" = $5, "item_purchased" = $6' +
                'WHERE "item_id" = $1 AND "store_id" = $2 AND "user_id" = $3;';
            db.query(queryText, [itemId, storeId, userId, desiredQty, purchasedQty, purchased], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            })
        })
    }
    else {
        console.log('User is not logged in');
        res.send(false);
    }
})

//removes items not purchased from the users shopping list
router.put('/removenotpurchased/items/:id', function (req, res) {
    var storeId = req.params.id;
    var userId = req.user.id;
    if (req.isAuthenticated) {
        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText =
                'DELETE FROM "shopping_list"' +
                'WHERE "store_id" = $1 AND "user_id" = $2 AND "item_purchased" = false;';
            db.query(queryText, [storeId, userId], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            })
        })
    }
    else {
        console.log('User is not logged in');
        res.send(false);
    }
})

router.get('/getstore/purchaseditems/:id', function (req, res) {
    console.log('req params', req.params.id);
    if (req.isAuthenticated) {
        var userId = req.user.id;
        var storeId = req.params.id;
        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText =
                'SELECT "shopping_list"."item_id", "shopping_list"."store_id", "shopping_list"."purchased_amount",' +
                '"shopping_list"."shopping_list_id", "stores"."label", "Items"."item_name"' +
                'FROM "shopping_list" LEFT OUTER JOIN "Items"' +
                'ON("shopping_list"."item_id" = "Items"."item_id")' +
                'RIGHT OUTER JOIN "stores"' +
                'ON("shopping_list"."store_id" = "stores"."store_id")' +
                'WHERE "shopping_list"."user_id" = $1 AND "shopping_list"."store_id" = $2 AND "shopping_list"."item_purchased" = true LIMIT 1;'
            db.query(queryText, [userId, storeId], function (errorMakingQuery, result) {
                console.log('in get purchased item',new Date());
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    console.log('next item from shopping list', result.rows);
                    console.log('sending result', new Date());
                    res.send(result.rows);
                    
                }
            })
        })
    }
    else {
        console.log('User is not logged in');
        res.send(false);
    }
})

router.put('/purchaseditmes/addtopantries/:id', function (req, res) {

    if (req.isAuthenticated) {
        console.log('in the purchased items add to pantry and delete from shopping list', req.params);
        
        var userInfo = req.user.id;
        var itemId = req.params.id;
        var addItemtoPantries = req.body.addItemtoPantries;
        var shopping_list_id = req.body.shopping_list_id;
        pool.connect(function (errorConnectingtoDB, db, done) {
                var queryText =
                    'INSERT INTO "stock" ("item_id", "pantry_location", "quantity") VALUES ($1, $2, $3)' +
                    'ON CONFLICT ("item_id", "pantry_location")' +
                    'DO UPDATE SET "quantity" = "stock"."quantity" + EXCLUDED.quantity;';
                for (var i = 0; i < addItemtoPantries.length; i++) {
                    db.query(queryText, [itemId, addItemtoPantries[i].pantry_id, addItemtoPantries[i].quantity,], function (errorMakingQuery, result) {
                        done();
                        if (errorMakingQuery) {
                            console.log('Error making query');
                            res.sendStatus(500);
                            return
                        }
                    }); 
                } 
                console.log('deleting shopping list id', shopping_list_id);
                db.query('DELETE from "shopping_list" WHERE "shopping_list_id" = $1;', [shopping_list_id], function (errorMakingQuery, result) {
                    console.log('update and delete', new Date());
                    done();
                    if (errorMakingQuery) {
                        console.log('error making query');
                        res.sendStatus(500);
                        return
                    }
                res.sendStatus(200);
                })
                // console.log('res send success status', new Date());
            // res.sendStatus(200);
        // }
        })
    }
    else {
        console.log('User is not logged in');
        res.send(false);
    }
})

// router.delete('/delete/purchased/shopping_list/:id', function(req, res){
//     console.log('delete route', req.params.id);
    
//     if (req.isAuthenticated) {
//         var shopping_list_id = req.params.id;
//         pool.connect(function (errorConnectingToDb, db, done) {
//             if (errorConnectingToDb) {
//                 console.log('Error Connecting', errorConnectingToDb);
//                 res.sendStatus(500);
//             }//end pool if
//             else {
//                 var queryText = 'DELETE from "shopping_list" WHERE "shopping_list_id" = $1;'
//                 db.query(queryText, [shopping_list_id], function (errorMakingQuery, result) {
//                     done();
//                     if (errorMakingQuery) {
//                         console.log('Error making query', errorMakingQuery);
//                         res.sendStatus(500);
//                     }//end query if
//                     else {
//                         res.sendStatus(201);
//                     }
//                 })//end db.query
//             }//end pool else
//         })//end pool connect
//     }//end req authenticated
//     else {
//         console.log('User is not logged in');
//         res.send(false);
//     }//end req else authenticated
// })


module.exports = router;