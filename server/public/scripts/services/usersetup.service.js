myApp.service('UserSetupService', function ($http) {
    console.log('UserSetupService loaded');
    var self = this;

    storeToSave = {
        label: ''
    }

    pantryToSave = {
        label: ''
    }

    self.saveStore = function(store) {
        storeToSave.label = store;
        $http.post('/stores', storeToSave)
        .then(function(response) {
            console.log('new store added');
        }).catch(function(error){
            console.log('Failed to add store', error);
        })
    }

    self.savePantry = function(pantry) {
        pantryToSave.label = pantry;
        $http.post('/pantries', pantryToSave)
        .then(function(response){
            console.log('new pantry added');
        }).catch(function(error){
            console.log('Failed to add pantry', error);
        })
    }
})