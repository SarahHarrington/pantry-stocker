myApp.controller('AddItemController', function (UserService, AddItemService, UserSetupService, $q, $log, $timeout) {
    console.log('AddItemController created');
    var vm = this;

    // vm.userItems = AddItemService.userItems.allitems;

    vm.userStoreList = UserSetupService.stores.data;
    vm.userPantryList = UserSetupService.pantries.data;
    vm.userAllItems = AddItemService.allUserItems;

    vm.addItem = function (item) {
        AddItemService.addItem(item);
        vm.item = {};
    }

    vm.getStores = function () {
        UserSetupService.getStores();
        vm.userStoreList = UserSetupService.stores;
    }

    vm.getPantries = function () {
        UserSetupService.getPantries();
        vm.userPantryList = UserSetupService.pantries;
    }

    vm.getAllItems = function () {
        AddItemService.getAllItems();
        console.log('vm.userAllItems', vm.userAllItems);
    }

    vm.getStores();
    vm.getPantries();
    vm.getAllItems();
    // vm.querySearch = querySearch();

    vm.querySearch = function (query) {
        console.log('in query search function', vm.userAllItems.items);
        var results
        results = query ? vm.createFilterFor(query) : vm.userAllItems.items;
        return results;
    }

    vm.selectedItemChange = function (item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }

    vm.createFilterFor = function (query) {
        // var lowercaseQuery = angular.lowercase(query);

        // return function filterFn(item) {
        //     console.log('item in the filter function', item.item_name);

        //     return(item.item_name.indexOf(lowercaseQuery) === 0);
        return vm.userAllItems.items.filter(
            function (item) {
                return item.item_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
        );
    }
});