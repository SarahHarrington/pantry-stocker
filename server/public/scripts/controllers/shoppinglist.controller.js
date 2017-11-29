myApp.controller('ShoppingListController', function (UserService, AddItemService, UserSetupService, $log, $mdToast, $mdDialog, ShoppingListService) {
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
        console.log('store', store);
        ShoppingListService.getShoppingLists(store).then(function(response){
            vm.shoppingLists = ShoppingListService.shoppingLists;
            var arrayForDone = vm.shoppingLists.lists;
            vm.doneShoppingData.store_id = store.store_id;
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
        if (item.item_purchased === true) {
            vm.doneShopping = true;
        }
    }

    var doneShoppingList = [];
    vm.doneShoppingUpdate = function (doneShoppingData) {
        console.log('done shopping update', doneShoppingData);
        vm.confirmDeleteUnpurchased(doneShoppingData);
        ShoppingListService.doneShoppingUpdate(doneShoppingData).then(function(response){
            console.log('controller doneshopping update', response);
            doneShoppingList = response;
            console.log('doneshoppinglist', doneShoppingList);
        })
    }

    vm.removeNotPurchasedItems = function (array) {
        console.log('removeNotPurchasedItems', array);
        ShoppingListService.removeNotPurchasedItems(array);
    
    }
    

    vm.confirmDeleteUnpurchased = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Delete all unpurchased items?')
            .textContent('')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(function () {
            console.log('confrim clicked');
            vm.removeNotPurchasedItems(doneShoppingList);
        }), function () {
            console.log('cancel clicked');
            
        };
    };

    
});