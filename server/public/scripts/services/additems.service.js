myApp.service('AddItemService', function($http) {
    console.log('AddItemsService loaded');
    var self = this;

    self.userPantryItems = {
        allitems: []
    }

    self.allUserItems = {
        items: []
    }

    self.itemStock = {
        totals: []
    }

    //retrieves all items for the logged in user
    self.getAllItems = function() {
        $http.get('/items/allitems')
        .then(function(response){
            self.allUserItems.items = response.data;
            console.log('self.allUserItems.items', self.allUserItems.items);
        }).catch(function(error){
            console.log('error');
        })
    }

    //gets items for my pantries page
    self.getPantryItems = function (pantry) {
        console.log('pantry', pantry.pantry_id);
        var pantryId = pantry.pantry_id;
        console.log('pantryId', pantryId);
        
        return $http.get('/items/mypantries/' + pantryId)
        .then(function(response){
            self.userPantryItems.allitems = response.data;
            console.log('self.userPantryItems.allitems', self.userPantryItems.allitems);
            return response;
        }).catch(function(error){
            console.log('error');
            
        })
    }

    //deletes item from the pantry view
    self.deleteItemFromPantry = function (item) {
        console.log('item in delete', item);
        
        var itemToDelete = item.item_id;
        var itemPantry = item;
        // var itemPantry= item.pantry_location;
        return $http.put('/items/removeitem/' + itemToDelete, itemPantry)
        .then(function(response){
            console.log('item delete success');
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }

    //gets the item stock totals when item is selected from md-autocomplete
    self.getItemStockTotal = function (item) {
        console.log('item', item); 
        var itemId = item;
        return $http.get('/items/itemstock/' + itemId)
        .then(function(response){
            console.log('response from get itemstock total service', response.data);
            return response.data;

        }).catch(function(error){
            console.log('error');
        })
    }

    //updates pantry item quantity on ng-blur
    self.pantryUpdate = function (pantryId, pantryToUpdate) {
        console.log('in pantryUpdate', pantryId, pantryToUpdate);
        return $http.put('/pantries/' + pantryId, pantryToUpdate)
        .then(function(response){
            console.log('response');
            return response;
            //need to add a resposne return here for a notification
        }).catch(function(error){
            console.log('error');
            
        })
    }


    //updates the minimium quantity on item view
    self.updateMinQty = function (itemId, newMinQty) {
        console.log('in update min quantity', itemId, newMinQty);
        return $http.put('/itemupdate/mininmumquantity/' + itemId, newMinQty)
        .then(function(response){
            console.log('success');
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }

    //subtracts one item from the pantry view on click of the -
    self.removeOneItem = function(item) {
        console.log('remove one item in service', item);
        var itemId = item.item_id;
        var itemToUpdate = item;
        return $http.put('/removeitem/' + itemId, itemToUpdate)
        .then(function(response){
            console.log('success');
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }

    //adds one item from the pantry view on click of the +
    self.addOneItem = function (item) {
        console.log('remove one item in service', item);
        var itemId = item.item_id;
        var itemToUpdate = item;
        return $http.put('/additem/' + itemId, itemToUpdate)
            .then(function (response) {
                console.log('success');
                return response;
            }).catch(function (error) {
                console.log('error');
            })
    }

    //adds new item to pantry
    self.addNewItemToPantry = function (newItemToAdd, addItemtoPantries, newItemMinimumQty) {
        console.log('service addNewItemToPantry', newItemToAdd, addItemtoPantries, newItemMinimumQty);
        var newItemtoAdd = {
            itemLabel: newItemToAdd,
            addItemtoPantries: addItemtoPantries,
            newItemMinimumQty: newItemMinimumQty
        }
        return $http.post('/additem', newItemtoAdd)
        .then(function(response){
            console.log('success');
            return response;
        }).catch(function(error){
            console.log('error');
            
        })
    }

    self.shoppingListItemId = '';
    self.verifyItemReminder = function(itemId) {
        console.log('item Id in verify reminder', itemId);
        return $http.get('/additem/itemstockmin/' + itemId)
        .then(function(response){
            console.log('success');
            console.log('response.data in verifyItemReminder', response.data);
            self.shoppingListItemId = itemId;
            var verifiedItem = {
                itemId: itemId,
                response: response.data
            }
            console.log('verifiedItem', verifiedItem);
            return verifiedItem;
        }).catch(function(error){
            console.log('error');
            
        });
    }
    
    self.addItemToShopList = function(storeId, itemId) {
        console.log('additem to shopping list in the service', storeId, itemId);
        var itemForShopList = {
            storeId: storeId,
            itemId: itemId
        }
        return $http.post('/shoppinglist', itemForShopList)
        .then(function(response){
            console.log('success');
            return response;
        }).catch(function(error){
            console.log('error');
            
        })
    }

    self.verifyItemShopList = function(itemId) {
        console.log('item shop list verify', itemId);
        return $http.get('/shoppinglist/checkitem/' + itemId)
        .then(function(response){
            console.log('success');
            console.log('verify shopping list', response);
            
            return response.data;
        }).catch(function(error){
            console.log('error');
            
        })
    }


})