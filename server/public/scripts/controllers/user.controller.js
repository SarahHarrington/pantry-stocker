myApp.controller('UserController', function(UserService, $location) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.isOpen = false;

  vm.demo = {
    isOpen: false,
    count: 0,
    selectedDirection: 'right'
  };

});
