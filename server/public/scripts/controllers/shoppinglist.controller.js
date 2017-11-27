myApp.controller('ShoppingListController', function (UserService, AddItemService, UserSetupService, $log, $mdToast, $mdDialog, ShoppingListService) {
    console.log('ShoppingListController created');
    var vm = this;

    vm.userStoreList = UserSetupService.stores.data;
    
    vm.getStores = function () {
        UserSetupService.getStores();
        vm.userStoreList = UserSetupService.stores;
    }

    vm.getStores();
    vm.shoppingLists = [];
    vm.getShoppingLists = function(store) {
        console.log('store', store);
        ShoppingListService.getShoppingLists(store).then(function(response){
            vm.shoppingLists = response.data;
            console.log('controller response', vm.shoppingLists);
            // vm.showShopList = true;
        })
    }
    // vm.getShoppingLists();

    // vm.getListItems = function(store) {
    //     console.log('getListItems', store);
    //     vm.getShoppingLists();
    // }

});