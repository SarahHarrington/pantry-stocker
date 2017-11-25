myApp.controller('AddItemController', function (UserService, AddItemService, UserSetupService, $log) {
    console.log('AddItemController created');
    var vm = this;

    // vm.userItems = AddItemService.userItems.allitems;
    vm.addItemForm = false;
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
        console.log('selected change item', item);
        var itemToGetStock = item.item_id;
        vm.pantryLabel = item.label;
        vm.minimumQty = item.min_quantity;
        vm.getItemStockTotal(itemToGetStock);
    }

    //clears the search for items
    vm.clearSearch = function () {
        vm.selectedItem = null;
        vm.searchText = "";
        vm.itemStock.totals = [];
        vm.reminderQuantity = '';
        vm.totalItemQuantity = '';
        vm.editAddItem = true;
        vm.addItemForm = false;
        vm.getAllItems();
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
            console.log('response in getitemstocktotal', vm.itemStock.totals);            
        }).then(function(response){
            //vm.verifyItemStock();
        }) 
    }

    vm.totalItemQuantity = '';
    vm.verifyItemStock = function() {
        var quantityCalcArray = vm.itemStock.totals;
        var itemTotal = 0;
        for (var i = 0; i < quantityCalcArray.length; i++) {
            itemTotal = itemTotal + quantityCalcArray[i].quantity;
        }
        vm.totalItemQuantity = itemTotal;
        console.log('itemTotal', vm.totalItemQuantity);
    }

    vm.addItem = function() {
        vm.addItemForm = true;

    }

    vm.updatePantryQty = function(pantry, item) {
        console.log('updatepantryqty function fired');
        console.log('pantry', pantry);
        console.log('item', item);

        var pantryId = pantry.pantry_id;
        var pantryToUpdatete = {
            pantryQty: pantry.quantity,
            itemId: item.item_id
        }
        AddItemService.pantryUpdate(pantryId, pantryToUpdatete);
    }

    vm.updateMinQty = function (item, newMinQty) {
        var itemId = item.item_id;
        var newMinQty = {
            itemMin: newMinQty
        }
        console.log('updateMinQty', itemId, newMinQty);
        AddItemService.updateMinQty(itemId, newMinQty);
    }

    //write function to fire what ng-include shows when the item is selected
    //ng-include="THIS WOULD BE A VARIABLE THAT WOULD BE ASSIGNED BASED ON THE FUNCTION"
    
});