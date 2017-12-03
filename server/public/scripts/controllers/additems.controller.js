myApp.controller('AddItemController', function (UserService, AddItemService, UserSetupService, $log, $mdToast, $mdDialog) {
    console.log('AddItemController created');
    var vm = this;

    vm.addItemForm = false;
    vm.editAddItem = true;
    vm.userStoreList = UserSetupService.stores.allstores;
    vm.userPantryList = UserSetupService.pantries.data;
    vm.userAllItems = AddItemService.allUserItems;
    vm.itemStock = AddItemService.itemStock.totals;

//initial functions for page load
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
    }

    vm.getStores();
    vm.getAllItems();

// END initial functions for page load

//Functions for Item search in md-autocomplete
    vm.querySearch = function (query) {
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
//Functions for Item search in md-autocomplete

    //Gets item stock totals when an item is selected from the autocomplete options
    vm.getItemStockTotal = function (item) {
        AddItemService.getItemStockTotal(item)
        .then(function(response){
            vm.itemStock = response;
            vm.editAddItem = false;
        })
    }

    vm.itemMinQty = '';

    //Opens the section to add a new item to your lists/pantries
    vm.addItem = function() {
        vm.getPantries();
        vm.minimumQty = '';
        vm.addItemForm = true;
    }

    //runs on ng-blur to auto update the pantry quantities when editing
    vm.updatePantryQty = function(pantry, item) {
        var pantryId = pantry.pantry_id;
        var pantryToUpdate = {
            pantryQty: pantry.quantity,
            itemId: item.item_id
        }
        AddItemService.pantryUpdate(pantryId, pantryToUpdate).then(function(response){
            vm.verifyItemShopList(pantryToUpdate.itemId);
            AddItemService.openToast(response);
        })
    }

    //runs on ng-blur to auto update the min quantity when editing
    vm.updateMinQty = function (item, newMinQty) {
        var itemId = item.item_id;
        var newMinQty = {
            itemMin: newMinQty
        }
        AddItemService.updateMinQty(itemId, newMinQty).then(function(response){
            vm.verifyItemShopList(itemId); 
            AddItemService.openToast(response);
        })
    }

    //adds the new item to the pantries
    //NEED TO ADD THE PICTURE THING
    vm.addNewItemToPantry = function (newItemToAdd, pantry, newItemMinimumQty) {
        console.log('add item controller');
        
        var addItemtoPantries = [];
        for (var i = 0; i < pantry.length; i++) {
            if (pantry[i].quantity) {
                addItemtoPantries.push(pantry[i]);
            }
        }
        AddItemService.addNewItemToPantry(newItemToAdd, addItemtoPantries, newItemMinimumQty).then(function(response){
            vm.clearSearch();
        })
    }

    vm.shoppingListItemId = AddItemService.shoppingListItemId;

    //Checks to see if the item is below the reminder threshold
    vm.verifyItemReminder = function (itemId) {
        AddItemService.verifyItemReminder(itemId);
    }

    //triggers the pop to add the item to shopping lists
    vm.addItemToShopList = function(storeId) {
        var itemId = vm.shoppingListItemId;        
        AddItemService.addItemToShopList(storeId, itemId).then(function(response){
            AddItemService.hide(response);
        })
    }

    vm.closeShopList = function(ev) {
        AddItemService.hide(ev);
    }
    
    //verifies if the item is on the shopping lists already
    vm.verifyItemShopList = function(itemId) {
        var itemId = itemId;
        AddItemService.verifyItemShopList(itemId).then(function(response){
            var checkItemOnShopList = Number.parseInt(response[0].c);
            if (checkItemOnShopList === 0) {
                vm.verifyItemReminder(itemId);
            }
        })
    }

    //image picker through file stack
    vm.pickImage = function() {
        console.log('pickimage clicked');
        AddItemService.pickImage();
    }

    vm.getItemForEdit = AddItemService.itemForEditing;

    vm.addToShoppingList = function(store, item) {
        console.log('in the add to shopping list', store, item);
        var itemId = item.item_id;
        var storeId = store.store_id;
        AddItemService.verifyItemShopList(itemId).then(function(response){
            AddItemService.addItemToShopList(storeId, itemId);
            vm.selectedStore = '';
        })
    }

    
});