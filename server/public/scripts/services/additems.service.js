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

    self.addItem = function (newItem) {
        console.log('add item button clicked');
        return $http.post('/additems', newItem)
        .then(function(response){
            console.log('new item added');
            return response;
        }).catch(function(error){
            console.log('Failed to add item', error);
        })
    }

    




})