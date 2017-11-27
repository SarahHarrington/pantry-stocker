myApp.controller('ShoppingListController', function (UserService, AddItemService, UserSetupService, $log, $mdToast, $mdDialog, ShoppingListService) {
    console.log('ShoppingListController created');
    var vm = this;

    vm.userStoreList = UserSetupService.stores.data;
    vm.shoppingLists = ShoppingListService.shoppingLists.lists;

    vm.getStores = function () {
        UserSetupService.getStores();
        vm.userStoreList = UserSetupService.stores;
    }

    vm.getStores();
    vm.getShoppingLists = function(store) {
        ShoppingListService.getShoppingLists(store);
        vm.shoppingLists = ShoppingListService.shoppingLists;
        console.log('vm.shoppingLists', vm.shoppingLists);
        
    }
    // vm.getShoppingLists();

    // vm.getListItems = function(store) {
    //     console.log('getListItems', store);
    //     vm.getShoppingLists();
    // }

});