myApp.controller('UserSetupController', function (UserService, UserSetupService, AddItemService) {
    console.log('UserSetupController created');
    var vm = this;

    vm.userStoreList = UserSetupService.stores.data;
    vm.userPantryList = UserSetupService.pantries.data;
    vm.userPantryItems = AddItemService.userPantryItems.allitems;

    vm.saveStore = function(store) {
        UserSetupService.saveStore(store);
        //add alert for showing store was added
    }

    vm.savePantry = function(pantry) {
        UserSetupService.savePantry(pantry);
    }

    vm.getStores = function() {
        UserSetupService.getStores();
        vm.userStoreList = UserSetupService.stores;
    }

    vm.getPantries = function() {
        UserSetupService.getPantries();
        vm.userPantryList = UserSetupService.pantries;
    }

    vm.getStores();
    vm.getPantries();

    vm.removeStore = function(storeId) {
        UserSetupService.removeStore(storeId);
    }

    vm.removePantry = function (pantryId) {
        UserSetupService.removePantry(pantryId);
    }

    vm.getPantryItems = function (pantryId) {
        console.log('get items clicked');
        AddItemService.getPantryItems(pantryId);
        vm.userPantryItems = AddItemService.userPantryItems;
        console.log('vm.userItems', vm.userPantryItems);
    }
});