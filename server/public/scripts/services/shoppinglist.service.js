myApp.service('ShoppingListService', function ($http) {
    console.log('ShoppingListService loaded');
    var self = this;

    self.shoppingLists = {
        lists: []
    };

    self.getShoppingLists = function(store) {
        console.log('service getShoppingLists', store);
        var storeId = store.store_id;
        console.log('storeId', storeId);
        
        var storeList = store;
        return $http.get('/shoppinglist/allitems/' + storeId, storeList)
        .then(function(response){
            self.shoppingLists.lists = response.data;
            console.log('shopping service shoppinglists', self.shoppingLists.lists);
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }

    self.deleteItemFromList = function(item) {
        console.log('delete service', item);
        var itemId = item.item_id;
        var itemStore = item;
        return $http.put('/shoppinglist/deleteitem/' + itemId, itemStore)
        .then(function(response){
            console.log('success');
            return response;
        }).catch(function(error){
            console.log('error');
            
        })
    }

    self.shopQuantitiesUpdate = function(item) {
        console.log('shopdesiredqty', item);
        var itemId = item.item_id;
        
        $http.put('shoppinglist/updateitem/' + itemId, item)
        .then(function(response){
            console.log('success');
            
        }).catch(function(error){
            console.log('error');
            
        })
        
    }

});