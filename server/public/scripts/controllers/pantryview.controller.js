myApp.controller('PantryViewController', function (UserService, UserSetupService, AddItemService, $mdToast, $mdDialog, $location) {
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

    //removes one item fromt he pantry
    vm.removeOneItem = function(item) {
        var itemId = item.item_id;
        var pantryId = item.pantry_location;
        AddItemService.removeOneItem(item).then(function(response){
            vm.getPantryItems({ pantry_id: pantryId })
            vm.verifyItemShopList(itemId);
        })
    }

    //adds one item to the pantry
    vm.addOneItem = function(item) {
        var itemId = item.item_id;
        var pantryId = item.pantry_location;
        AddItemService.addOneItem(item).then(function (response) {
            vm.getPantryItems({ pantry_id: pantryId });
            vm.verifyItemShopList(itemId);
        })
    }

    vm.shoppingListItemId = AddItemService.shoppingListItemId;
    //checks to see if item meets threshold for minimum qty, if so does popup
    vm.verifyItemReminder = function (itemId) {
        AddItemService.verifyItemReminder(itemId);
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

    //triggers edit winodw from pantry view
    vm.editItemIndividual = function (item) {
        console.log('item in edit from pantry', item);
        
        var itemId = item.item_id;
        AddItemService.getItemStockTotal(itemId).then(function(response){
            $mdDialog.show({
                controller: 'AddItemController as aic',
                templateUrl: 'views/templates/edititem.html',
                parent: angular.element(document.body),
                targetEvent: response,
                clickOutsideToClose: true,
                fullscreen: vm.customFullscreen
            })
        });
    }


});