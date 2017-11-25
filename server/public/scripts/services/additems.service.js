myApp.service('AddItemService', function($http) {
    console.log('AddItemsService loaded');
    var self = this;

    // self.item = {
    //     itemName: '',
    //     itemQuantity: '',
    //     itemStore: '',
    //     itemPantry: '',        
    //     reminderQty: ''
    // }

    self.userPantryItems = {
        allitems: []
    }

    self.allUserItems = {
        items: []
    }

    self.itemStock = {
        totals: []
    }

    // self.addItem = function (newItem) {
    //     console.log('add item button clicked');
    //     return $http.post('/items/additems', newItem)
    //     .then(function(response){
    //         console.log('new item added');
    //         return response;
    //     }).catch(function(error){
    //         console.log('Failed to add item', error);
    //     })
    // }

    self.getAllItems = function() {
        $http.get('/items/allitems')
        .then(function(response){
            self.allUserItems.items = response.data;
            console.log('self.allUserItems.items', self.allUserItems.items);
        }).catch(function(error){
            console.log('error');
        })
    }

    self.getPantryItems = function (pantry) {
        console.log('pantry', pantry.pantry_id);
        var pantryId = pantry.pantry_id;
        console.log('pantryId', pantryId);
        
        $http.get('/items/mypantries/' + pantryId)
        .then(function(response){
            self.userPantryItems.allitems = response.data;
            console.log('self.userPantryItems.allitems', self.userPantryItems.allitems);
        }).catch(function(error){
            console.log('error');
            
        })
    }

    self.deleteItemFromPantry = function (item) {
        console.log('item in delete', item);
        
        var itemToDelete = item.item_id;
        var itemPantry = item;
        // var itemPantry= item.pantry_location;
        return $http.put('/items/removeitem/' + itemToDelete, itemPantry)
        .then(function(response){
            console.log('item delete success');
            return response;
        }).catch(function(error){
            console.log('error');
        })
    }

    self.getItemStockTotal = function (item) {
        console.log('item', item); 
        var itemId = item;
        return $http.get('/items/itemstock/' + itemId)
        .then(function(response){
            console.log('response from get itemstock total service', response.data);
            return response.data;

        }).catch(function(error){
            console.log('error');
        })
    }

    self.pantryUpdate = function (pantryId, pantryToUpdate) {
        console.log('in pantryUpdate', pantryId, pantryToUpdate);
        return $http.put('/pantries/' + pantryId, pantryToUpdate)
        .then(function(response){
            console.log('response');
            return response;
            //need to add a resposne return here for a notification
        }).catch(function(error){
            console.log('error');
            
        })
    }
})