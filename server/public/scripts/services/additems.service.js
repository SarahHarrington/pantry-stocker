myApp.service('AddItemService', function($http, $mdToast, $mdDialog) {
    console.log('AddItemsService loaded');
    var self = this;

    self.userPantryItems = {
        allitems: []
    }

    self.allUserItems = {
        items: []
    }

    self.itemStock = {
        totals: []
    }

    self.item = {
        image: ''
    }

    // var client = filestack.init(privateAPIForFileStack());
    // self.pickImage = function () {
    //     console.log('pick image service');
    //     client.pick({
    //         maxFiles: 1,
    //         uploadInBackground: false,
    //         onOpen: () => console.log('Opened')
    //     })
    //         .then((res) => {
    //             console.log(res);
    //             console.log(res.filesUploaded);
    //             console.log(res.filesFailed);
    //             self.item.image = res.filesUploaded[0].url;
    //         });
    // }
    

    //retrieves all items for the logged in user
    self.getAllItems = function() {
        $http.get('/items/allitems')
        .then(function(response){
            self.allUserItems.items = response.data;
        }).catch(function(error){
            console.log('error');
        })
    }

    //gets items for my pantries page
    self.getPantryItems = function (pantry) {
        var pantryId = pantry.pantry_id;        
        return $http.get('/items/mypantries/' + pantryId)
        .then(function(response){
            self.userPantryItems.allitems = response.data;
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }

    //deletes item from the pantry view
    self.deleteItemFromPantry = function (item) {        
        var itemToDelete = item.item_id;
        var itemPantry = item;
        return $http.put('/items/removeitem/' + itemToDelete, itemPantry)
        .then(function(response){
            console.log('item delete success');
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }

    //gets the item stock totals when item is selected from md-autocomplete
    self.getItemStockTotal = function (item) {
        console.log('service full item');
        
        var itemId = item;
        console.log('get item stock total service', item);
        
        return $http.get('/items/itemstock/' + itemId)
        .then(function(response){
            console.log('service, get itemstock total', response.data);
            self.itemStock.totals = response.data;
            return response.data;
        }).catch(function(error){
            console.log('error');
        })
    }

    //updates pantry item quantity on ng-blur
    self.pantryUpdate = function (pantryId, pantryToUpdate) {
        return $http.put('/pantries/' + pantryId, pantryToUpdate)
        .then(function(response){
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }


    //updates the minimium quantity on item view
    self.updateMinQty = function (itemId, newMinQty) {
        console.log('in update min quantity', itemId, newMinQty);
        return $http.put('/itemupdate/mininmumquantity/' + itemId, newMinQty)
        .then(function(response){
            console.log('success');
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }

    //subtracts one item from the pantry view on click of the -
    self.removeOneItem = function(item) {
        var itemId = item.item_id;
        var itemToUpdate = item;
        return $http.put('/removeitem/' + itemId, itemToUpdate)
        .then(function(response){
            console.log('success');
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }

    //adds one item from the pantry view on click of the +
    self.addOneItem = function (item) {
        var itemId = item.item_id;
        var itemToUpdate = item;
        return $http.put('/additem/' + itemId, itemToUpdate)
            .then(function (response) {
                console.log('success');
                return response;
            }).catch(function (error) {
                console.log('error');
            })
    }

    //adds new item to pantry
    self.addNewItemToPantry = function (newItemToAdd, addItemtoPantries, newItemMinimumQty) {
        var newItemtoAdd = {
            itemLabel: newItemToAdd,
            addItemtoPantries: addItemtoPantries,
            newItemMinimumQty: newItemMinimumQty, 
            image: self.item.image
        }
        console.log('new item to add', newItemtoAdd);
        
        console.log('new itmem to add service');
        
        return $http.post('/additem', newItemtoAdd)
        .then(function(response){
            console.log('success');
            return response;
        }).catch(function(error){
            console.log('error');
            
        })
    }

    self.shoppingListItemId = '';
    self.verifyItemReminder = function(itemId) {
        $http.get('/additem/itemstockmin/' + itemId)
        .then(function(response){
            console.log('success');
            self.shoppingListItemId = itemId;
            var shoppingListItemId = itemId;
            var array = response.data;
            console.log('array', response.data);
            for (var i = 0; i < array.length; i++) {
                var totalItemQuantity = Number.parseInt(array[i].total_quantity);
                var minItemQuantity = array[i].min_quantity;
                    if (totalItemQuantity <= minItemQuantity) {
                        self.showConfirm(shoppingListItemId);
                    }
                }
        }).catch(function(error){
            console.log('error');
        });
    }

    self.showConfirm = function (shoppingListItemId) {
        $mdDialog.show({
            controller: 'AddItemController as aic',
            templateUrl: 'views/templates/addtoshoppinglist.html',
            parent: angular.element(document.body),
            targetEvent: shoppingListItemId,
            clickOutsideToClose: true,
            fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
        })
    };
    
    self.addItemToShopList = function(storeId, itemId) {
        var itemForShopList = {
            storeId: storeId,
            itemId: itemId
        }
        return $http.post('/shoppinglist', itemForShopList)
        .then(function(response){
            console.log('success');
            return response;
        }).catch(function(error){
            console.log('error');
            
        })
    }

    self.verifyItemShopList = function(itemId) {
        return $http.get('/shoppinglist/checkitem/' + itemId)
        .then(function(response){
            console.log('success');
            return response.data;
        }).catch(function(error){
            console.log('error');
        })
    }

    self.openToast = function ($event) {
        $mdToast.show(
            $mdToast.simple()
                .textContent('Your item has been updated!')
                .hideDelay(1000));
    }

    self.showConfirm = function (shoppingListItemId) {
        $mdDialog.show({
            controller: 'AddItemController as aic',
            templateUrl: 'views/templates/addtoshoppinglist.html',
            parent: angular.element(document.body),
            targetEvent: shoppingListItemId,
            clickOutsideToClose: true,
            fullscreen: false // Only for -xs, -sm breakpoints.

        })
    };

    self.hide = function () {
        $mdDialog.hide();
    };

    self.cancel = function () {
        $mdDialog.cancel();
    };

    self.answer = function (answer) {
        $mdDialog.hide(answer);
    };

    self.itemForEditing = [];
    self.getItemForEdit = function (itemId) {
        console.log('getItemforEdit', itemId);
        return $http.get('/items/edititem/' + itemId)
            .then(function (response) {
                self.itemForEditing = response.data;
                return response;
            }).catch(function (error) {
                console.log('error');
            })
    }
})