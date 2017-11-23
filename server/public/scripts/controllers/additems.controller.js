myApp.controller('AddItemController', function (UserService, AddItemService, UserSetupService, $log) {
    console.log('AddItemController created');
    var vm = this;

    // vm.userItems = AddItemService.userItems.allitems;

    vm.userStoreList = UserSetupService.stores.data;
    vm.userPantryList = UserSetupService.pantries.data;
    vm.userAllItems = AddItemService.allUserItems;
    vm.itemStock = {
        totals: []
    }

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
    // vm.pantryId;
    vm.getItemStockTotal = function (item) {
        vm.getItemStockTotal = AddItemService.getItemStockTotal(item).then(function(response){
            vm.itemStock.totals = response;
            console.log('response in getitemstocktotal', vm.itemStock.totals);
        }) 
    }
    vm.itemCheckboxValue = false;
    vm.itemCheckbox = function (quantity) {
        console.log('pantry in itemcheckbox', quantity);
        for (var i = 0; i < vm.itemStock.totals; i++) {
            var element = vm.itemStock.totals[i].quantity;
            console.log('element', element);
            
            if(element === null) {
                return false;
            } else {
                return true;
            }
        }
    }
});