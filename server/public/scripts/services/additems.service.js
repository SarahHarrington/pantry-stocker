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
        pantryId: '',
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

    self.getPantryItems = function (pantryId) {
        var pantry_id = 
        self.userPantryItems.pantryId = pantryId;
        $http.get('/items/mypantries/' + pantryId)
        .then(function(response){
            self.userPantryItems.allitems = response.data;
            console.log('self.userPantryItems.allitems', self.userPantryItems.allitems);
        }).catch(function(error){
            console.log('error');
            
        })
    }
})