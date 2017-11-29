myApp.service('ShoppingListService', function ($http) {
    console.log('ShoppingListService loaded');
    var self = this;

    self.shoppingLists = {
        lists: []
    };

    self.completeShop = {
        list: []
    }

    self.getShoppingLists = function (store) {
        console.log('service getShoppingLists', store);
        var storeId = store; //store id number
        console.log('storeId', storeId);

        var storeList = store;
        return $http.get('/shoppinglist/allitems/' + storeId)
            .then(function (response) {
                self.shoppingLists.lists = response.data;
                console.log('shopping service shoppinglists', self.shoppingLists.lists);
                console.log('response in get shopping lists service', response);
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
        console.log('shopdesiredqty', item);
        var itemId = item.item_id;
        $http.put('shoppinglist/updateitem/' + itemId, item)
            .then(function (response) {
                console.log('success');
            }).catch(function (error) {
                console.log('error');
            })
    }

    //pulls shopping list by store again, uses same path on router as
    //getShoppingLists function
    // self.doneShoppingUpdate = function (storeId) {
    //     console.log('service - done shopping data', storeId);
    //     var storeId = storeId.store_id;
    //     return $http.get('/shoppinglist/allitems/' + storeId)
    //         .then(function (response) {
    //             self.completeShop.list = response.data;
    //             // console.log('complete shopping lists', self.completeShop.list);
    //             // console.log('complete shopping lists full response', response);
    //             return response.data;
    //         }).catch(function (error) {
    //             console.log('error');
    //         })
    // }

    //removes items not purchased from shopping list
    self.removeNotPurchasedItems = function(storeId) {
        console.log('array in remove not purchased', storeId);
        var storeId = storeId;
        return $http.put('/shoppinglist/removenotpurchased/items/' + storeId)
        .then(function(response){
            console.log('success');
            return response;
        }).catch(function(error){
            console.log('error');
            
        })
    }
});