myApp.controller('UserSetupController', function (UserService, UserSetupService) {
    console.log('UserSetupController created');
    var vm = this;

    vm.userStoreList = UserSetupService.stores.data;

    vm.saveStore = function(store) {
        UserSetupService.saveStore(store);
        console.log('controller store', store);
        //add alert for showing store was added
    }

    vm.savePantry = function(pantry) {
        UserSetupService.savePantry(pantry);
    }

    vm.getStores = function() {
        UserSetupService.getStores();
        vm.userStoreList = UserSetupService.stores;
        console.log('getstore', vm.userStoreList);
    }

    vm.getPantries = function() {
        UserSetupService.getPantries();
    }
    vm.getStores();
    console.log('userStoreList', vm.userStoreList.allstores);
    vm.getPantries();

});