myApp.service('UserSetupService', function ($http) {
    console.log('UserSetupService loaded');
    var self = this;

    var storeToSave = {
        label: ''
    }

    var pantryToSave = {
        label: ''
    }

    self.userStoreList = [];
    self.userPantryList = [];

    self.saveStore = function(store) {
        storeToSave.label = store;
        $http.post('/stores', storeToSave)
        .then(function(response) {
            console.log('new store added');
        }).catch(function(error){
            console.log('Failed to add store', error);
        })
    }//end save store

    self.savePantry = function(pantry) {
        pantryToSave.label = pantry;
        $http.post('/pantries', pantryToSave)
        .then(function(response){
            console.log('new pantry added');
        }).catch(function(error){
            console.log('Failed to add pantry', error);
        })
    }//end save pantry

    self.getStores = function() {
        $http.get('/stores/userstores')
        .then(function(response) {
            console.log('response data for stores', response.data);
            self.userStoreList = response.data;
        }).catch(function(error){
            console.log('error');
        })
    }

    self.getPantries = function () {
        $http.get('/pantries/userpantries')
            .then(function (response) {
                console.log('response data for pantries', response.data);
                self.userPantryList = response.data;
            }).catch(function (error) {
                console.log('error');
            })
    }
})