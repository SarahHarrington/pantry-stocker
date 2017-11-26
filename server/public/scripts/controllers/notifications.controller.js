// myApp.controller('NotificationsController', function (UserService, AddItemService, UserSetupService, $log, $mdDialog) {
//     console.log('NotificationsController created');
//     var vm = this;

//     vm.open = function (ev) {
//         $mdDialog.show(
//             {
//                 templateUrl: "printDialog.html",
//                 clickOutsideToClose: true,
//                 controller: NotificationsController,
//             });
//     };

//     vm.stores = usc.stores;
//     vm.chosenOption = "None"; // default

//     vm.$watch("chosenOption", function (newValue) {
//         if (angular.isDefined(newValue)) {
//             console.log(newValue);
//         }
//     });

//     vm.hide = function () {
//         $mdDialog.hide();
//     };

//     vm.cancel = function () {
//         $mdDialog.cancel();
//     };
// })

