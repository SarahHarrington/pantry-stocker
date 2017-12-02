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

    // UserSetupService.getPantries();

    // vm.userPantryList = {
    //     allpantries: []
    // }
    console.log('vm.userpantrylist on page load', vm.userPantryList);
    
    vm.getStores()
    
    vm.doneShopping = false;
    vm.getShoppingLists = function(store) {
        console.log('get shopping lists store', store);
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
        console.log('delete from list', item);
        var itemId = item.item_id;
        // var store = {
        //     store_id: item.store_id
        // };

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
            console.log('confirm clicked');
            vm.removeNotPurchasedItems(storeId);
        }), function () {
            console.log('cancel clicked');
            vm.updateShopList = true;
        };
    };

    vm.purchasedItems = ShoppingListService.purchasedItems;
    // vm.item_index = 0;
    // vm.individualItem = {};

    vm.getPurchasedItemsForPantry = function(storeId){
        console.log('getPurchasedItemsForPantry controller store id', storeId);
        ShoppingListService.getPurchasedItemsForPantry(storeId).then(function(response){
            console.log('in promise chain for get purchased', response.data);
            vm.checkforViewChange();
            vm.getPantries();
        })
        // vm.checkforViewChange();
    }

    // vm.itemPurchasedtoAdd = {}

    vm.getPantries = function () {
        UserSetupService.getPantries();
        vm.userPantryList = UserSetupService.pantries;
        console.log('in get pantries controller', vm.userPantryList);
        
    }
    vm.updateItems = true;

    //function on click in the shopping list page to move to new view
    vm.addPurchasedItems = function(storeId) {
        console.log('addPurchasedItems controller storeID', storeId);
        $location.path('purchasedadd')
        vm.getPurchasedItemsForPantry(storeId);
        // vm.getPantries();
        console.log('addPurchasedItems item list', vm.purchasedItems);
        // vm.checkforViewChange();
    }

    vm.checkforViewChange = function(){
        console.log('in check for view change');
        
        if(vm.purchasedItems.allitems.length > 0) {
            vm.updateItems = true;
            console.log('check for view change if vm.updateItems', vm.updateItems);

        } else {
            vm.updateItems = false;
            console.log('check for view change else vm.updateItems', vm.updateItems);
        }
    }

    // vm.pantryLocationsforItem = [];
    // vm.itemPantryLocation = function(itemId, pantry) {
    //     console.log('itempantrylocation', itemId, pantry);
    //     var itemForPantry = {
    //         itemId: itemId,
    //         pantry_id: pantry.pantry_id,
    //         quantity: pantry.quantity
    //     }
    //     vm.pantryLocationsforItem.push(itemForPantry);
    //     console.log('pantrylocationsforitem array', vm.pantryLocationsforItem);
    // }

    vm.addItemtoPantries = function (item, pantry) {
        console.log('addItemtoPantries button clicked, controller', item, pantry);
        if (item.length > 0) {
            var addItemtoPantries = [];
            var storeId = item.store_id;
            for (var i = 0; i < pantry.length; i++) {
                if (pantry[i].quantity) {
                    addItemtoPantries.push(pantry[i]);
                } 
            }
            console.log('addItemtoPantries array', addItemtoPantries);
            //this is adding the items to the pantries and deleting the current item
            ShoppingListService.addItemtoPantries(item[0], addItemtoPantries).then(function(response){
                // $location.path('purchasedadd');
                var storeId = item[0].store_id;
                console.log('storeId in shopping list service to restart process', response.data);
                // vm.addPurchasedItems(storeId);
                vm.getPurchasedItemsForPantry(storeId);
            })
        }
        else {
            console.log('out of items');
            vm.updateItems = false;
        }
    }

    // vm.next = function () {
    //     var array = vm.purchasedItems.allitems;
    //     console.log('move to next item');
    //     console.log('purchased items in vm.next', );
    //     console.log('vm.item_index', array);
    //     if (vm.item_index >= array.length -1) {
    //         console.log('all the items are done');
    //         //add a notification here and clear the page or go to home
    //     } else {
    //         vm.item_index++
    //     }
    // }
    
});