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

});