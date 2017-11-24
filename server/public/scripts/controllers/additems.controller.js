myApp.controller('AddItemController', function (UserService, AddItemService, UserSetupService, $log) {
    console.log('AddItemController created');
    var vm = this;

    // vm.userItems = AddItemService.userItems.allitems;
    vm.editAddItem = true;
    vm.userStoreList = UserSetupService.stores.data;
    vm.userPantryList = UserSetupService.pantries.data;
    vm.userAllItems = AddItemService.allUserItems;
    vm.itemStock = {
        totals: []
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

    //clears the search for items
    vm.clearSearch = function () {
        vm.selectedItem = null;
        vm.searchText = "";
        vm.itemStock.totals = [];
        vm.reminderQuantity = '';
        vm.totalItemQuantity = '';
    }

    //filters the item query to lower case
    vm.createFilterFor = function (query) {
        return vm.userAllItems.items.filter(
            function (item) {
                return item.item_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
        );
    }
    vm.itemMinQty = '';
    vm.getItemStockTotal = function (item) {
        AddItemService.getItemStockTotal(item)
        .then(function(response){
            vm.itemStock.totals = response;
            vm.editAddItem = false;
            console.log(vm.editAddItem);
            
            console.log('response in getitemstocktotal', vm.itemStock.totals);            
        }).then(function(response){
            //vm.verifyItemStock();
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

    vm.addItem = function(item, reminderQty) {
        console.log('click add item button');
        console.log('item', item);
        console.log('reminderQty', reminderQty);
    }

    vm.updatePantryQty = function(pantry, item) {
        console.log('updatepantryqty function fired');
        console.log('pantry', pantry);
        console.log('item', item);
        //item stock will be updating every time the field loses focus, clear the form here for the user
        
        
    }

    //write function to fire what ng-include shows when the item is selected
    //ng-include="THIS WOULD BE A VARIABLE THAT WOULD BE ASSIGNED BASED ON THE FUNCTION"
    
});