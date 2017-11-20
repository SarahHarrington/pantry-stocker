myApp.controller('UserSetupController', function (UserService, UserSetupService) {
    console.log('UserSetupController created');
    var vm = this;

    vm.userStoreList = UserSetupService.stores.data;
    vm.userPantryList = UserSetupService.pantries.data;

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
    console.log('userStoreList', vm.userStoreList.allstores);
    vm.getPantries();

    vm.removeStore = function(storeId) {
        // console.log('storeId', storeId);
        UserSetupService.removeStore(storeId);
    }

});