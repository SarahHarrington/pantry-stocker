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
        console.log('get items clicked');
        AddItemService.getPantryItems(pantryId);
        vm.userPantryItems = AddItemService.userPantryItems;
    }

    //deletes the item from the pantry
    vm.deleteItemFromPantry = function(item) {
        console.log('delete item from pantry clicked');
        console.log('item in delete pantry', item);
        var pantryId = item.pantry_location;
        console.log('pantryId in controller for delete', pantryId);
        AddItemService.deleteItemFromPantry(item).then(function(response){
            vm.getPantryItems({ pantry_id: pantryId }); 
        })
    }

    vm.removeOneItem = function(item) {
        console.log('item in remove one item', item);
        var itemId = item.item_id;
        var pantryId = item.pantry_location;
        AddItemService.removeOneItem(item).then(function(response){
            vm.getPantryItems({ pantry_id: pantryId })
            vm.openToast();
            vm.verifyItemReminder(itemId);
        })
    }

    vm.addOneItem = function(item) {
        console.log('item in add one item', item);
        var itemId = item.item_id;
        var pantryId = item.pantry_location;
        AddItemService.addOneItem(item).then(function (response) {
            vm.getPantryItems({ pantry_id: pantryId });
            vm.openToast();
            vm.verifyItemReminder(itemId);
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
                console.log('response in verify item reminder', response);
                var shoppingListItemId = response.itemId;
                vm.shoppingListItemId = shoppingListItemId;
                var response = response.response;
                for (var i = 0; i < response.length; i++) {
                    var totalItemQuantity = Number.parseInt(response[i].total_quantity);
                    var minItemQuantity = response[i].min_quantity;
                    console.log('in the for loop', totalItemQuantity, minItemQuantity);
                    if (totalItemQuantity <= minItemQuantity) {
                        console.log('im in the if');
                        vm.showConfirm(shoppingListItemId);
                    }
                }
            })
    }

    vm.showConfirm = function (shoppingListItemId) {
        console.log('shoppingListItemId in show confirm', shoppingListItemId);
        // vm.shoppingListItemId = shoppingListItemId;
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

        

});