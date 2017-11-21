myApp.controller('AddItemController', function (UserService, AddItemService, UserSetupService) {
    console.log('AddItemController created');
    var vm = this;

    // vm.userItems = AddItemService.userItems.allitems;

    vm.addItem = function (item) {
        AddItemService.addItem(item);
        vm.item = {};
    }
});