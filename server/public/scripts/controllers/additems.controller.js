myApp.controller('AddItemController', function (UserService, AddItemService, UserSetupService, $log) {
    console.log('AddItemController created');
    var vm = this;

    // vm.userItems = AddItemService.userItems.allitems;

    vm.userStoreList = UserSetupService.stores.data;
    vm.userPantryList = UserSetupService.pantries.data;
    vm.userAllItems = AddItemService.allUserItems;
    vm.allItemStock = [];

    vm.addItem = function (item) {
        //need to append the search text here?
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
        console.log('selected change item', item);
        var itemToGetStock = item.item_id;
        vm.getItemStockTotal(itemToGetStock);
    }

    vm.createFilterFor = function (query) {
        return vm.userAllItems.items.filter(
            function (item) {
                return item.item_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
        );
    }
    vm.pantryId;
    vm.getItemStockTotal = function (item) {
        vm.getItemStockTotal = AddItemService.getItemStockTotal(item)
            .then(function (response) {
                vm.allItemStock = response;
                console.log('vm.allItemStock', vm.allItemStock);
                pantryId = vm.allItemStock.pantry_location;
                vm.checkIfChecked(pantryId);
            })
    }

    vm.checkPantryBox = false;

    vm.checkIfChecked = function () {
        for (var i = 0; i < vm.allItemStock.length; i++) {

            for (var j = 0; j < vm.userPantryList.length; j++) {
                
                if (vm.allItemStock[i].pantry_id === vm.userPantryList[j].pantry_id) {
                    vm.checkPantryBox = true;
                } else {
                    vm.checkPantryBox = false;
                }
            }
        }
    }
});