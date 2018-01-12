myApp.controller('PantryViewController', function (UserService, UserSetupService, AddItemService, $mdToast, $mdDialog, $location) {
    console.log('PantryViewController created');
    var vm = this;

    vm.userPantryList = UserSetupService.pantries.data;
    vm.userPantryItems = AddItemService.userPantryItems.allitems;

    //gets all pantries for pantry list view
    vm.getPantries = function () {
        UserSetupService.getPantries();
        vm.userPantryList = UserSetupService.pantries;
    }
    vm.getPantries();

    //retrieves the items when the pantry button is clicked
    vm.getPantryItems = function (pantryId) {
        AddItemService.getPantryItems(pantryId);
        vm.userPantryItems = AddItemService.userPantryItems;
    }

    //deletes the item from the pantry
    vm.deleteItemFromPantry = function(item) {
        var pantryId = item.pantry_location;
        AddItemService.deleteItemFromPantry(item).then(function(response){
            vm.getPantryItems({ pantry_id: pantryId }); 
        }).catch(function(error){
            console.log('error deleting item from pantry')
        })
    }

    //removes one item from the pantry
    vm.removeOneItem = function(item) {
        var itemId = item.item_id;
        var pantryId = item.pantry_location;
        AddItemService.removeOneItem(item).then(function(response){
            vm.getPantryItems({ pantry_id: pantryId })
            vm.verifyItemShopList(itemId);
        }).catch(function(error){
            console.log('error in removing one item from the pantry')
        })
    }

    //adds one item to the pantry
    vm.addOneItem = function(item) {
        var itemId = item.item_id;
        var pantryId = item.pantry_location;
        AddItemService.addOneItem(item).then(function (response) {
            vm.getPantryItems({ pantry_id: pantryId });
            vm.verifyItemShopList(itemId);
        }).catch(function(error){
            console.log('error adding one item to the pantry')
        })
    }

    vm.shoppingListItemId = AddItemService.shoppingListItemId;
    //checks to see if item meets threshold for minimum qty, if so does popup
    vm.verifyItemReminder = function (itemId) {
        AddItemService.verifyItemReminder(itemId);
    }

    //verifies if item is on shopping list
    vm.verifyItemShopList = function (itemId) {
        var itemId = itemId;
        AddItemService.verifyItemShopList(itemId).then(function (response) {
            var checkItemOnShopList = Number.parseInt(response[0].c);
            if (checkItemOnShopList === 0) {
                vm.verifyItemReminder(itemId);
            }
        }).catch(function(error){
            console.log('verifies if item is on shopping list')
        })
    }

    //triggers edit winodw from pantry view
    vm.editItemIndividual = function (item) {
        console.log('item in edit from pantry', item);
        var itemId = item.item_id;
        AddItemService.getItemForEdit(itemId).then(function(response){
            $mdDialog.show({
                controller: 'AddItemController as aic',
                templateUrl: 'views/templates/edititem.html',
                parent: angular.element(document.body),
                targetEvent: response,
                clickOutsideToClose: true,
                fullscreen: vm.customFullscreen
            })
        }).catch(function(error){
            console.log('error in editing item individual')
        })
    }

    // vm.getItemForEdit = function (itemId) {
    //     AddItemService.getItemForEdit(itemId);
    // }
    vm.imageUrl = ''

    vm.showPrerenderedDialog = function (ev) {
        $mdDialog.show({
            contentElement: '#myDialog',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

});