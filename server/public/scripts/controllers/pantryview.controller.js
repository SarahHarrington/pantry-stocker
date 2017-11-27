myApp.controller('PantryViewController', function (UserService, UserSetupService, AddItemService, $mdToast, $mdDialog) {
    console.log('PantryViewController created');
    var vm = this;

    vm.userPantryList = UserSetupService.pantries.data;
    vm.userPantryItems = AddItemService.userPantryItems.allitems;

    //gets all pantries for pantry list view
    vm.getPantries = function () {
        UserSetupService.getPantries();
        vm.userPantryList = UserSetupService.pantries;
    }
    vm.getPantries();

    //retrieves the items when the pantry button is clicked
    vm.getPantryItems = function (pantryId) {
        AddItemService.getPantryItems(pantryId);
        vm.userPantryItems = AddItemService.userPantryItems;
    }

    //deletes the item from the pantry
    vm.deleteItemFromPantry = function(item) {
        var pantryId = item.pantry_location;
        AddItemService.deleteItemFromPantry(item).then(function(response){
            vm.getPantryItems({ pantry_id: pantryId }); 
        })
    }

    vm.removeOneItem = function(item) {
        var itemId = item.item_id;
        var pantryId = item.pantry_location;
        AddItemService.removeOneItem(item).then(function(response){
            vm.getPantryItems({ pantry_id: pantryId })
            vm.openToast();
            vm.verifyItemShopList(itemId);
        })
    }

    vm.addOneItem = function(item) {
        var itemId = item.item_id;
        var pantryId = item.pantry_location;
        AddItemService.addOneItem(item).then(function (response) {
            vm.getPantryItems({ pantry_id: pantryId });
            vm.openToast();
            vm.verifyItemShopList(itemId);
        })
    }

    vm.openToast = function ($event) {
        $mdToast.show(
            $mdToast.simple()
            .textContent('Your item has been updated!')
            .hideDelay(1000));
    }

    vm.shoppingListItemId = AddItemService.shoppingListItemId;
    vm.verifyItemReminder = function (itemId) {
        AddItemService.verifyItemReminder(itemId)
            .then(function (response) {
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

    vm.addItemToShopList = function (storeId) {
        var itemId = vm.shoppingListItemId;
        AddItemService.addItemToShopList(storeId, itemId);
    }

    vm.verifyItemShopList = function (itemId) {
        var itemId = itemId;
        AddItemService.verifyItemShopList(itemId).then(function (response) {
            var checkItemOnShopList = Number.parseInt(response[0].c);
            if (checkItemOnShopList === 0) {
                vm.verifyItemReminder(itemId);
            }
        })
    }

});