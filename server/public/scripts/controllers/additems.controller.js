myApp.controller('AddItemController', function (UserService, AddItemService, UserSetupService, $log, $mdToast) {
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

    vm.addItem = function() {
        vm.minimumQty = '';
        vm.addItemForm = true;

    }

    vm.updatePantryQty = function(pantry, item) {
        console.log('updatepantryqty function fired');
        console.log('pantry', pantry);
        console.log('item', item);

        var pantryId = pantry.pantry_id;
        var pantryToUpdate = {
            pantryQty: pantry.quantity,
            itemId: item.item_id
        }
        AddItemService.pantryUpdate(pantryId, pantryToUpdate).then(function(response){
            vm.verifyItemReminder(pantryToUpdate.itemId);
            vm.openToast(response);
        })
    }

    vm.updateMinQty = function (item, newMinQty) {
        var itemId = item.item_id;
        var newMinQty = {
            itemMin: newMinQty
        }
        console.log('updateMinQty', itemId, newMinQty);
        AddItemService.updateMinQty(itemId, newMinQty).then(function(response){
            vm.verifyItemReminder(itemId); 
            vm.openToast(response);
        })
    }

    vm.addNewItemToPantry = function (newItemToAdd, pantry, newItemMinimumQty) {
        console.log('add new item to pantry', newItemToAdd, pantry, newItemMinimumQty);
        var addItemtoPantries = [];
        for (var i = 0; i < pantry.length; i++) {
            if (pantry[i].quantity) {
                addItemtoPantries.push(pantry[i]);
            }
        }
        console.log('addItemtoPantries', addItemtoPantries);
        AddItemService.addNewItemToPantry(newItemToAdd, addItemtoPantries, newItemMinimumQty).then(function(response){
            vm.clearSearch();
        })
    }

    vm.verifyItemReminder = function (itemId) {
        AddItemService.verifyItemReminder(itemId).then(function(response){
            console.log('response in verify item reminder', response);
            var totalItemQuantity = response.total_quantity;
            var minItemQuantity = response.min_quantity;
            
            if (totalItemQuantity <= minItemQuantity) {
                vm.showDialogue(ev);
            }
        })
    }

    vm.showDialogue = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('This is an alert title')
                .textContent('You can specify some description text in here.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
        );
    };

    vm.openToast = function ($event) {
        $mdToast.show($mdToast.simple().textContent('Your item has been updated!'));
    }
});