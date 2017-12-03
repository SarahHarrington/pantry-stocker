myApp.service('UserSetupService', function ($http) {
    console.log('UserSetupService loaded');
    var self = this;

    var storeToSave = {
        label: ''
    }

    var pantryToSave = {
        label: ''
    }

    self.stores = {
        allstores: []
    }

    self.pantries = {
        allpantries: []
    }


    self.saveStore = function(store) {
        storeToSave.label = store;
        return $http.post('/stores', storeToSave)
        .then(function(response) {
            console.log('new store added');
            self.getStores();
            return response;
        }).catch(function(error){
            console.log('Failed to add store', error);
        })
    }//end save store
    
    self.savePantry = function(pantry) {
        pantryToSave.label = pantry;
        return $http.post('/pantries', pantryToSave)
        .then(function(response){
            console.log('new pantry added');
            self.getPantries();
            return response;
        }).catch(function(error){
            console.log('Failed to add pantry', error);
        })
    }//end save pantry

    self.getStores = function() {
        $http.get('/stores/userstores')
        .then(function(response) {
            self.stores.allstores = response.data;
            console.log('response data for stores', self.stores.allstores);
        }).catch(function(error){
            console.log('error');
        })
    }

    self.getPantries = function () {
        $http.get('/pantries/userpantries')
            .then(function (response) {
                self.pantries.allpantries = response.data;
                console.log(self.pantries.allpantries);
                // console.log('response data for pantries', self.pantries.allpantries);
            }).catch(function (error) {
                console.log('error');
            })
    }

    self.removeStore = function (storeId) {
        var store_id = storeId.store_id;
        $http.delete('/stores/' + store_id)
            .then(function (response) {
                self.getStores();
            }).catch(function (error) {
                console.log('error');
            })
    }

    self.removePantry = function (pantryId) {
        console.log('pantryId', pantryId);
        var pantry_id = pantryId.pantry_id;
        $http.delete('/pantries/' + pantry_id)
            .then(function (response) {
                self.getPantries();
            }).catch(function (error) {
                console.log('error');
            })
    }
})