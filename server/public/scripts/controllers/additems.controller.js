myApp.controller('AddItemController', function (UserService) {
    console.log('AddItemController created');
    var vm = this;
    vm.userService = UserService;

    var item = {
        itemName: '',
        itemQuantity: '',
        storePurchased: '',
        defaultStore: '',
        expirationDate: '',
        reminderQty: ''
    }

});