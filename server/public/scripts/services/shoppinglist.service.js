myApp.service('ShoppingListService', function ($http) {
    console.log('ShoppingListService loaded');
    var self = this;

    self.shoppingLists = {
        lists: []
    };

    self.completeShop = {
        list: []
    }

    self.purchasedItems = {
        allitems: []
    }

    self.getShoppingLists = function (store) {
        var storeId = store; //store id number
        var storeList = store;
        return $http.get('/shoppinglist/allitems/' + storeId)
            .then(function (response) {
                self.shoppingLists.lists = response.data;
                return response.data;
            }).catch(function (error) {
                console.log('error');
            })
    }

    self.deleteItemFromList = function (item) {
        console.log('delete service', item);
        var itemId = item.item_id;
        var itemStore = item;
        return $http.put('/shoppinglist/deleteitem/' + itemId, itemStore)
            .then(function (response) {
                console.log('success');
                return response;
            }).catch(function (error) {
                console.log('error');
            })
    }

    //updates checkbox, want, and got quantities on ng-blur
    self.shopQuantitiesUpdate = function (item) {
        var itemId = item.item_id;
        $http.put('shoppinglist/updateitem/' + itemId, item)
            .then(function (response) {
                console.log('success');
            }).catch(function (error) {
                console.log('error');
            })
    }

    //removes items not purchased from shopping list
    self.removeNotPurchasedItems = function(storeId) {
        var storeId = storeId;
        return $http.put('/shoppinglist/removenotpurchased/items/' + storeId)
        .then(function(response){
            console.log('success');
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }

    //gets all purchased items for updates to pantry
    self.getPurchasedItemsForPantry = function(storeId) {
        var storeId = storeId;
        return $http.get('shoppinglist/getstore/purchaseditems/' + storeId)
        .then(function(response){
            console.log('success');
            self.purchasedItems.allitems = response.data;
            console.log('getpurchaseditemspantry service', self.purchasedItems.allitems);
            // return response.data;
        }).catch(function(error){
            console.log('error');
            
        })
    }

    self.addItemtoPantries = function(item, pantries) {
        console.log('service add item to pantries', item, pantries);
        
    }
});