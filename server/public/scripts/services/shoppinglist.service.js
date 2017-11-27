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

});