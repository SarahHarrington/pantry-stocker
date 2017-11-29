myApp.controller('ShoppingListController', function (UserService, AddItemService, UserSetupService, $log, $mdToast, $mdDialog, ShoppingListService) {
    console.log('ShoppingListController created');
    var vm = this;

    vm.userStoreList = UserSetupService.stores.data;
    vm.shoppingLists = ShoppingListService.shoppingLists.lists;

    vm.getStores = function () {
        UserSetupService.getStores();
        vm.userStoreList = UserSetupService.stores;
    }

    vm.getStores()
    vm.doneShopping = false;
    vm.getShoppingLists = function(store) {
        console.log('store', store);
        ShoppingListService.getShoppingLists(store).then(function(response){
            vm.shoppingLists = ShoppingListService.shoppingLists;
            var arrayForDone = vm.shoppingLists.lists;
            console.log('vm.shoppingLists', vm.shoppingLists);
            vm.checkForDone(arrayForDone);
        })
    }

    vm.checkForDone = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].item_purchased === true) {
                vm.doneShopping = true;
            }  else {
                vm.doneShopping = false;
            }
        }
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
        // vm.checkForDone()
    }

    vm.doneShoppingUpdate = function (store, item) {
        console.log('done shopping update', store, item);
        
    }




});