myApp.controller('ShoppingListController', function (UserService, AddItemService, UserSetupService, $log, $mdToast, $mdDialog, ShoppingListService) {
    console.log('ShoppingListController created');
    var vm = this;

    vm.userStoreList = UserSetupService.stores.data;
    vm.shoppingLists = ShoppingListService.shoppingLists.lists;
    vm.hideDoneButton = true;

    vm.getStores = function () {
        UserSetupService.getStores();
        vm.userStoreList = UserSetupService.stores;
    }

    vm.getStores();
    vm.getShoppingLists = function(store) {
        console.log('store', store);
        ShoppingListService.getShoppingLists(store);
        vm.shoppingLists = ShoppingListService.shoppingLists;
        console.log('vm.shoppingLists', vm.shoppingLists);
        
    }
    vm.deleteItemFromList= function(item) {
        console.log('delete from list', item);
        var itemId = item.item_id;
        var store = {
            store_id: item.store_id
        };
        ShoppingListService.deleteItemFromList(item).then(function (response) {
            vm.getShoppingLists(store); 
        })
    }

    vm.shopQuantitiesUpdate =  function(item) {
        ShoppingListService.shopQuantitiesUpdate(item);
    }

    vm.listCheckbox = function(item) {
        console.log('item in listCheckbox', item);
        
    }


});