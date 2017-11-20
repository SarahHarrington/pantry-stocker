myApp.controller('UserSetupController', function (UserService, UserSetupService) {
    console.log('UserSetupController created');
    var vm = this;

    vm.saveStore = function(store) {
        UserSetupService.saveStore(store);
        console.log('controller store', store);
    }

    vm.savePantry = function(pantry) {
        UserSetupService.savePantry(pantry);
    }

    vm.getStores = function() {
        UserSetupService.getStores();
    }

    vm.getPantries = function() {
        UserSetupService.getPantries();
    }
    vm.getStores();
    vm.getPantries();
});