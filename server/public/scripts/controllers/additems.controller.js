myApp.controller('AddItemController', function (UserService, AddItemService, UserSetupService) {
    console.log('AddItemController created');
    var vm = this;

    vm.userStoreList = UserSetupService.stores.data;
    vm.userPantryList = UserSetupService.pantries.data;

    vm.addItem = function (newItem) {
        AddItemService.addItem(newItem);
    }

    vm.getStores = function () {
        UserSetupService.getStores();
        vm.userStoreList = UserSetupService.stores;
    }

    vm.getPantries = function () {
        UserSetupService.getPantries();
        vm.userPantryList = UserSetupService.pantries;
    }

    vm.getStores();
    vm.getPantries();
});