myApp.service('ShoppingListService', function ($http) {
    console.log('ShoppingListService loaded');
    var self = this;


    self.getShoppingLists = function() {
        return $http.get('/shoppinglist/allitems')
        .then(function(response){
            console.log('service response', response);
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }

});