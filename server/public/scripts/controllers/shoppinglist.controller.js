myApp.controller('ShoppingListController', function (UserService, AddItemService, UserSetupService, $log, $mdToast, $mdDialog, ShoppingListService, $location) {
    console.log('ShoppingListController created');
    var vm = this;

    vm.userStoreList = UserSetupService.stores.data;
    vm.shoppingLists = ShoppingListService.shoppingLists.lists;
    vm.userPantryList = UserSetupService.pantries;

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
        ShoppingListService.getShoppingLists(store).then(function(response){
            vm.shoppingLists = ShoppingListService.shoppingLists;
            var arrayForDone = vm.shoppingLists.lists;
            vm.doneShoppingData.store_id = store;
            // console.log('array for done in get shopping lists', arrayForDone);
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
        var itemId = item.item_id;
        var store = item.store_id;
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
            vm.removeNotPurchasedItems(storeId);
        }), function () {
            vm.updateShopList = true;
        };
    };

    vm.purchasedItems = ShoppingListService.purchasedItems;

    vm.getPurchasedItemsForPantry = function(storeId){
        ShoppingListService.getPurchasedItemsForPantry(storeId).then(function(response){
            vm.checkforViewChange();
            vm.getPantries();
        })
    }

    vm.getPantries = function () {
        UserSetupService.getPantries();
        vm.userPantryList = UserSetupService.pantries;
        
    }
    vm.updateItems = true;

    //function on click in the shopping list page to move to new view
    vm.addPurchasedItems = function(storeId) {
        $location.path('purchasedadd')
        vm.getPurchasedItemsForPantry(storeId);
    }

    vm.checkforViewChange = function(){
        if(vm.purchasedItems.allitems.length > 0) {
            vm.updateItems = true;

        } else {
            vm.updateItems = false;
        }
    }

    vm.addItemtoPantries = function (item, pantry) {
        if (item.length > 0) {
            var addItemtoPantries = [];
            var storeId = item.store_id;
            for (var i = 0; i < pantry.length; i++) {
                if (pantry[i].quantity) {
                    addItemtoPantries.push(pantry[i]);
                } 
            }
            ShoppingListService.addItemtoPantries(item[0], addItemtoPantries).then(function(response){
                var storeId = item[0].store_id;
                vm.getPurchasedItemsForPantry(storeId);
            })
        }
        else {
            console.log('out of items');
            vm.updateItems = false;
        }
    }
});