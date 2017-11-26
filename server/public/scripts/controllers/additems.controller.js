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

    // vm.totalItemQuantity = '';
    // vm.verifyItemStock = function() {
    //     var quantityCalcArray = vm.itemStock.totals;
    //     var itemTotal = 0;
    //     for (var i = 0; i < quantityCalcArray.length; i++) {
    //         itemTotal = itemTotal + quantityCalcArray[i].quantity;
    //     }
    //     vm.totalItemQuantity = itemTotal;
    //     console.log('itemTotal', vm.totalItemQuantity);
    // }

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
        AddItemService.pantryUpdate(pantryId, pantryToUpdate).then(function(error){
            vm.verifyItemReminder(pantryToUpdate.itemId);
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
                
            }
        })
    }

    vm.showPrompt = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
            .title('Would you like to add this item to your shopping list?')
            .textContent('Bowser is a common name.')
            .placeholder('Dog name')
            .ariaLabel('Dog name')
            .initialValue('Buddy')
            .targetEvent(ev)
            .required(true)
            .ok('Add!')
            .cancel('No');

        $mdDialog.show(confirm).then(function (result) {
            $scope.status = 'You decided to name your dog ' + result + '.';
        }, function () {
            $scope.status = 'You didn\'t name your dog.';
        });
    };
    
});