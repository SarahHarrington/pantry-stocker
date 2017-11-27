myApp.controller('AddItemController', function (UserService, AddItemService, UserSetupService, $log, $mdToast, $mdDialog) {
    console.log('AddItemController created');
    var vm = this;

    // vm.userItems = AddItemService.userItems.allitems;
    vm.addItemForm = false;
    vm.editAddItem = true;
    vm.userStoreList = UserSetupService.stores.allstores;
    vm.userPantryList = UserSetupService.pantries.data;
    vm.userAllItems = AddItemService.allUserItems;
    vm.itemStock = AddItemService.itemStock.totals;

    vm.getStores = function () {
        UserSetupService.getStores();
        vm.userStoreList = UserSetupService.stores;
    }

    vm.getPantries = function () {
        UserSetupService.getPantries();
        vm.userPantryList = UserSetupService.pantries;
    }

    vm.getAllItems = function () {
        AddItemService.getAllItems();
    }

    vm.getStores();
    vm.getPantries();
    vm.getAllItems();
    // vm.querySearch = querySearch();

    vm.querySearch = function (query) {
        var results
        results = query ? vm.createFilterFor(query) : vm.userAllItems.items;
        return results;
    }

    vm.pantryLabel = '';
    vm.minimumQty = '';
    vm.selectedItemChange = function (item) {
        if (!item) {
            return
        }
        var itemToGetStock = item.item_id;
        vm.pantryLabel = item.label;
        vm.minimumQty = item.min_quantity;
        vm.getItemStockTotal(itemToGetStock);
    }

    //clears the search for items
    vm.clearSearch = function () {
        vm.selectedItem = null;
        vm.searchText = "";
        vm.itemStock.totals = [];
        vm.reminderQuantity = '';
        vm.totalItemQuantity = '';
        vm.editAddItem = true;
        vm.addItemForm = false;
        vm.getAllItems();
    }

    //filters the item query to lower case
    vm.createFilterFor = function (query) {
        return vm.userAllItems.items.filter(
            function (item) {
                return item.item_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
        );
    }
    vm.itemMinQty = '';
    vm.getItemStockTotal = function (item) {
        console.log('getitemstocktotal controller', item);
        
        AddItemService.getItemStockTotal(item)
        .then(function(response){
            // vm.itemStock.totals = response;
            vm.editAddItem = false;
        }).then(function(response){
            // vm.verifyItemStock();
        }) 
    }

    vm.addItem = function() {
        vm.minimumQty = '';
        vm.addItemForm = true;

    }

    vm.updatePantryQty = function(pantry, item) {
        var pantryId = pantry.pantry_id;
        var pantryToUpdate = {
            pantryQty: pantry.quantity,
            itemId: item.item_id
        }
        AddItemService.pantryUpdate(pantryId, pantryToUpdate).then(function(response){
            vm.verifyItemShopList(pantryToUpdate.itemId);
            vm.openToast(response);
        })
    }

    vm.updateMinQty = function (item, newMinQty) {
        var itemId = item.item_id;
        var newMinQty = {
            itemMin: newMinQty
        }
        console.log('updateMinQty', itemId, newMinQty);
        AddItemService.updateMinQty(itemId, newMinQty).then(function(response){
            vm.verifyItemShopList(itemId); 
            vm.openToast(response);
        })
    }

    vm.addNewItemToPantry = function (newItemToAdd, pantry, newItemMinimumQty) {
        var addItemtoPantries = [];
        for (var i = 0; i < pantry.length; i++) {
            if (pantry[i].quantity) {
                addItemtoPantries.push(pantry[i]);
            }
        }
        AddItemService.addNewItemToPantry(newItemToAdd, addItemtoPantries, newItemMinimumQty).then(function(response){
            vm.clearSearch();
        })
    }

    vm.shoppingListItemId = AddItemService.shoppingListItemId;
    vm.verifyItemReminder = function (itemId) {
        AddItemService.verifyItemReminder(itemId)
        .then(function(response){
            var shoppingListItemId = response.itemId;
            vm.shoppingListItemId = shoppingListItemId;
            var response = response.response;
            for (var i = 0; i < response.length; i++) {
                var totalItemQuantity = Number.parseInt(response[i].total_quantity);
                var minItemQuantity = response[i].min_quantity;
                if (totalItemQuantity <= minItemQuantity) {
                    vm.showConfirm(shoppingListItemId);
                }
            }
        })
    }

    vm.openToast = function ($event) {
        $mdToast.show(
            $mdToast.simple()
                .textContent('Your item has been updated!')
                .hideDelay(1000));
    }

    vm.showConfirm = function (shoppingListItemId) {
        $mdDialog.show({
            controller: 'AddItemController as aic',
            templateUrl: 'views/templates/addtoshoppinglist.html',
            parent: angular.element(document.body),
            targetEvent: shoppingListItemId,
            clickOutsideToClose: true,
            fullscreen: vm.customFullscreen // Only for -xs, -sm breakpoints.
        
        })
    };

    vm.hide = function () {
        $mdDialog.hide();
    };

    vm.cancel = function () {
        $mdDialog.cancel();
    };

    vm.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    vm.addItemToShopList = function(storeId) {
        var itemId = vm.shoppingListItemId;        
        AddItemService.addItemToShopList(storeId, itemId).then(function(response){
            vm.hide(response);
        })
    }

    vm.closeShopList = function(ev) {
        vm.hide(ev);
    }
    
    vm.verifyItemShopList = function(itemId) {
        var itemId = itemId;
        AddItemService.verifyItemShopList(itemId).then(function(response){
            console.log('resposne in verify shop lsit controller', response);
            var checkItemOnShopList = Number.parseInt(response[0].c);
            console.log(checkItemOnShopList);
            if (checkItemOnShopList === 0) {
                console.log('in the if');
                vm.verifyItemReminder(itemId);
            }
        })
    }

    // vm.editItemIndividual = function(item) {
    //     console.log('edit clicked');
        
    //     $mdDialog.show({
    //         controller: 'AddItemController as aic',
    //         templateUrl: 'views/templates/edititem.html',
    //         parent: angular.element(document.body),
    //         targetEvent: item,
    //         clickOutsideToClose: true,
    //         fullscreen: vm.customFullscreen
    //     })
    // }

});