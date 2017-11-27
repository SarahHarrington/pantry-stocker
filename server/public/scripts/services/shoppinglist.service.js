myApp.service('ShoppingListService', function ($http) {
    console.log('ShoppingListService loaded');
    var self = this;


    self.getShoppingLists = function(store) {
        console.log('service getShoppingLists', store);
        var storeId = store.store_id;
        var storeList = store;
        return $http.get('/shoppinglist/allitems/' + storeId, storeList)
        .then(function(response){
            console.log('service response', response);
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }

});