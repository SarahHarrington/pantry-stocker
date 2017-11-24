myApp.controller('PantryViewController', function (UserService, UserSetupService, AddItemService) {
    console.log('PantryViewController created');
    var vm = this;

    vm.userPantryList = UserSetupService.pantries.data;
    vm.userPantryItems = AddItemService.userPantryItems.allitems;

    vm.getPantries = function () {
        UserSetupService.getPantries();
        vm.userPantryList = UserSetupService.pantries;
    }

    vm.getPantries();

    vm.getPantryItems = function (pantryId) {
        console.log('get items clicked');
        AddItemService.getPantryItems(pantryId);
        vm.userPantryItems = AddItemService.userPantryItems;
    }

    vm.deleteItemFromPantry = function(item) {
        //update this to delete from the stock table only
        console.log('delete item from pantry clicked');
        console.log('item in delete pantry', item);
        
        AddItemService.deleteItemFromPantry(item);
        // vm.getPantryItems();
    }

});