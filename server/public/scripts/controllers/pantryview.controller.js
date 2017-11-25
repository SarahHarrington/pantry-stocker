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
        console.log('delete item from pantry clicked');
        console.log('item in delete pantry', item);
        var pantryId = item.pantry_location;
        console.log('pantryId in controller for delete', pantryId);
        AddItemService.deleteItemFromPantry(item).then(function(response){
            vm.getPantryItems({ pantry_id: pantryId }); 
        })
    }
});