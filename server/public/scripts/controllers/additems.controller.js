myApp.controller('AddItemController', function (UserService, AddItemService) {
    console.log('AddItemController created');
    var vm = this;

    vm.addItem = function (newItem) {
        AddItemService.addItem();
    }
});