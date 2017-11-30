myApp.controller('ShoppingListController', function (UserService, AddItemService, UserSetupService, $log, $mdToast, $mdDialog, ShoppingListService, $location) {
    console.log('ShoppingListController created');
    var vm = this;

    vm.userStoreList = UserSetupService.stores.data;
    vm.shoppingLists = ShoppingListService.shoppingLists.lists;

    vm.doneShoppingData = {
        store_id: '',
    }

    vm.getStores = function () {
        UserSetupService.getStores();
        vm.userStoreList = UserSetupService.stores;
    }

    vm.getStores()
    vm.doneShopping = false;
    vm.getShoppingLists = function(store) {
        console.log('get shopping lists store', store);
        ShoppingListService.getShoppingLists(store).then(function(response){
            vm.shoppingLists = ShoppingListService.shoppingLists;
            var arrayForDone = vm.shoppingLists.lists;
            vm.doneShoppingData.store_id = store;
            console.log('array for done in get shopping lists', arrayForDone);
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
        if (item.item_purchased === true) {
            vm.doneShopping = true;
        }
    }

    vm.updateShopList = true;
    vm.doneShoppingList = [];
    vm.storeIdForShoppingListUpdates = '';

    vm.doneShoppingUpdate = function (storeId) {
        vm.doneShopping = false;
        vm.updateShopList = false;
        vm.doneShoppingData.store_id = storeId;
    }

    vm.removeNotPurchasedItems = function (storeId) {
        vm.doneShoppingUpdate(vm.doneShoppingData);
        ShoppingListService.removeNotPurchasedItems(storeId).then(function(response){
            vm.getShoppingLists(storeId);
        })
    }
    
    //function for confirmation of removing items not purchased
    vm.confirmDeleteUnpurchased = function (storeId) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Delete all unpurchased items?')
            .textContent('')
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .targetEvent(storeId)
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(function () {
            console.log('confirm clicked');
            vm.removeNotPurchasedItems(storeId);
        }), function () {
            console.log('cancel clicked');
            vm.updateShopList = true;
        };
    };

    vm.purchasedItems = ShoppingListService.purchasedItems;
    
    vm.getPurchasedItemsForPantry = function(storeId){
        ShoppingListService.getPurchasedItemsForPantry(storeId)//.then(function(response){
            // vm.purchasedItems.allitems = response;
            vm.purchasedItems = ShoppingListService.purchasedItems;
            console.log('controller purchased items for pantry', vm.purchasedItems.allitems);
            
    // })
        $location.path('purchasedadd');
    }

    vm.addPurchasedItemstoPantries = function (storeId) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Move purchased items to pantries?')
            .textContent('')
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .targetEvent(storeId)
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(function () {
            console.log('confirm clicked');
            vm.getPurchasedItemsForPantry(storeId);
            //will need to run a delete function after to remove from DB
        }), function () {
            console.log('cancel clicked');
            // vm.updateShopList = true;
        };
    };
    
});