myApp.service('AddItemService', function($http) {
    console.log('AddItemsService loaded');
    var self = this;

    self.item = {
        itemName: '',
        itemQuantity: '',
        storePurchased: '',
        defaultStore: '',
        reminderQty: ''
    }

    self.addItem = function (newItem) {
        console.log('add item button clicked');
        $http.post('/additems', newItem)
        .then(function(response){
            console.log('new item added');
            
        }).catch(function(error){
            console.log('Failed to add item', error);
        })
    }




})