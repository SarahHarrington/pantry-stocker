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

    self.userItems = {
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

    self.getItems = function () {
        console.log('get items running');
        $http.get('/items/mypantries')
        .then(function(response){
            self.userItems.allitems = response.data;
            console.log('self.userItems.allitems', self.userItems.allitems);
            
        }).catch(function(error){
            console.log('error');
            
        })
    }
})