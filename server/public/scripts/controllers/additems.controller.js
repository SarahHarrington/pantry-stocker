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

    // vm.addItem = function (item) {
    //     //need to append the search text here?
    //     AddItemService.addItem(item);
    //     vm.item = {};
    // }

    vm.getStores = function () {
        UserSetupService.getStores();
        vm.userStoreList = UserSetupService.stores;
    }

    // vm.getPantries = function () {
    //     UserSetupService.getPantries();
    //     vm.userPantryList = UserSetupService.pantries;
    // }

    vm.getAllItems = function () {
        AddItemService.getAllItems();
        console.log('vm.userAllItems', vm.userAllItems);
    }

    vm.getStores();
    // vm.getPantries();
    vm.getAllItems();
    // vm.querySearch = querySearch();

    vm.pantryLabel = '';
    vm.querySearch = function (query) {
        console.log('in query search function', vm.userAllItems.items);
        var results
        results = query ? vm.createFilterFor(query) : vm.userAllItems.items;
        return results;
    }

    vm.pantryLabel = '';
    vm.minimumQty = '';
    vm.selectedItemChange = function (item) {
        if (!item) {
            return
        }
        console.log('selected change item', item, vm);
        var itemToGetStock = item.item_id;
        vm.pantryLabel = item.label;
        vm.getItemStockTotal(itemToGetStock);
    }

    vm.clearSearch = function () {
        vm.selectedItem = null;
        vm.searchText = "";
    }

    vm.createFilterFor = function (query) {
        return vm.userAllItems.items.filter(
            function (item) {
                return item.item_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
        );
    }
    vm.itemMinQty = '';
    vm.getItemStockTotal = function (item) {
        AddItemService.getItemStockTotal(item).then(function(response){
            vm.itemStock.totals = response;
            console.log('response in getitemstocktotal', vm.itemStock.totals);            
        }).then(function(response){
            vm.verifyItemStock();
        }) 
    }

    vm.reminderQuantity = '';
    vm.totalItemQuantity = '';
    vm.verifyItemStock = function() {
        var quantityCalcArray = vm.itemStock.totals;
        var itemTotal = 0;
        var itemMinQuantityTotal = 0;
        for (var i = 0; i < quantityCalcArray.length; i++) {
            itemTotal = itemTotal + quantityCalcArray[i].quantity;
            itemMinQuantityTotal = itemMinQuantityTotal + quantityCalcArray[i].min_quantity;
        }
        vm.reminderQuantity = itemMinQuantityTotal;
        vm.totalItemQuantity = itemTotal;
        console.log('itemTotal', vm.totalItemQuantity);
        console.log('itemMinQuantityTotal', vm.reminderQuantity);
    }
    
});