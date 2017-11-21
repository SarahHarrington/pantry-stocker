myApp.service('AddItemService', function($http) {
    console.log('AddItemsService loaded');
    var self = this;

    self.item = {
        itemName: '',
        itemQuantity: '',
        itemStore: '',
        itemPantry: '',        
        reminderQty: ''
    }

    self.userPantryItems = {
        allitems: []
    }

    self.addItem = function (newItem) {
        console.log('add item button clicked');
        return $http.post('/items/additems', newItem)
        .then(function(response){
            console.log('new item added');
            return response;
        }).catch(function(error){
            console.log('Failed to add item', error);
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
})