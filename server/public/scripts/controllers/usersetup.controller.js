myApp.controller('UserSetupController', function (UserService, UserSetupService, AddItemService) {
    console.log('UserSetupController created');
    var vm = this;

    vm.userStoreList = UserSetupService.stores.data;
    vm.userPantryList = UserSetupService.pantries.data;
    vm.userItems = AddItemService.userItems.allitems;

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

    vm.getItems = function () {
        AddItemService.getItems();
        vm.userItems = AddItemService.userItems;
        console.log('vm.userItems', vm.userItems);
    }
    vm.getItems();

});