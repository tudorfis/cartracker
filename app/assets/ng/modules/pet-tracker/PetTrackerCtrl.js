define([], function() {
    return function ($scope, $rootScope, $timeout, $cookies, $mdToast, Api, googleMaps) {

        var s = $scope,
            rs = $rootScope;

        s.initProfileArea = function() {
            Api.get('/profile').then(function(res){
                s.profile_info = res.data;
            });
        };

        s.initPetArea = function() {
            Api.get('/pets/list', {}, {}, true, true).then(function(res){
                s.pets = res.data;
                s.cancelEditPet();

                var locations = [];
                angular.forEach(s.pets, function(pet, k){
                    pet.is_enabled_v = (pet.is_enabled == 'ENABLED');
                    if (pet.position && pet.position.latitude && pet.position.longitude) {
                        locations.push([
                            pet.name, pet.position.latitude, pet.position.longitude, '', pet.id, pet.position.attributes.battery, pet.position.speed
                        ]);
                    }
                });
                $timeout(function(){
                    googleMaps.initializePetMap('pet_area_maps', locations, s);
                }, 100);
            });
        };

        s.initHomeArea = function() {
            Api.get('/details').then(function(res) {
                var user_info = res.data.user;
                s.lat = user_info.home.lat;
                s.lng = user_info.home.lng;
                s.address = user_info.homeAddress;
                $timeout(function () {
                    googleMaps.initializeMap('home_area_maps', s.lat, s.lng, s.address, s);
                }, 100);
            });
        };

        s.init = function() {

            // BASIC
            rs.checkLoggedIn();
            rs.is_pet_tracker = true;
            rs.show_pet_edit = false;
            s.edit_profile = false;
            s.home_area_info = {
                address: ''
            };

            // CLOCK
            $scope.clock = "loading clock...";
            $scope.tickInterval = 1000; //ms
            var tick = function() {
                $scope.clock = Date.now();
                $timeout(tick, $scope.tickInterval); // reset the timer
            };
            $timeout(tick, $scope.tickInterval);

            s.initProfileArea();
        };
        s.init();

        s.cancelEditPet = function() {
            rs.pet_info = {};
            rs.show_pet_edit = false;
        };

        s.saveHomeArea = function() {
            Api.post('/profile/home', {
                "address": s.address,
                "point": {
                    "lat": s.lat,
                    "lng": s.lng
                }
            }).then(function(res){
                if (!res.is_error) {
                    s.update_home_area = true;
                    $timeout(function(){
                        s.update_home_area = false;
                    }, 3000)
                } else {
                    s.update_home_area_error = true;
                    $timeout(function(){
                        s.update_home_area_error = false;
                    }, 3000)
                }
            });
        };

        s.searchAddress = function() {
            googleMaps.showAddress(s.home_area_info.address, s);
        };

        s.setEditProfile = function (value) {
            s.edit_profile = value;
        };

        s.updateProfile = function() {
            Api.post('/profile', s.profile_info).then(function(res){
                s.setEditProfile(false);
                s.update_profile_complete = true;
                $timeout(function(){
                    s.update_profile_complete = false;
                }, 2000);
            });
        };

        s.setPetInfo = function(petInfo, petId) {
            if (petId) {
               angular.forEach(s.pets, function(pet){
                   if (pet.id == petId) {
                       rs.pet_info = pet;
                   }
                   return false;
               });
            } else {
                rs.pet_info = petInfo;
            }
            s.petInfowindow.close();
            rs.show_pet_edit = true;
            rs.show_new_pet = false;
            $timeout(function(){
                googleMaps.initializeSinglePetMap('pet_info_map', rs.pet_info, s);
            }, 50)

        };

        s.checkPet = function() {
            var return_val = true;
            if (!rs.pet_info.dog_cat) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('* Please select dog or cat')
                        .theme('error-toast')
                        .position('top right')
                        .hideDelay(1500)
                );
                return_val = false;
            } else if (!rs.pet_info.gender) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('* Please select gender')
                        .theme('error-toast')
                        .position('top right')
                        .hideDelay(1500)
                );
                return_val = false;
            } else if (!rs.pet_info.hunting_profile) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('* Please select hunting profile')
                        .theme('error-toast')
                        .position('top right')
                        .hideDelay(1500)
                );
                return_val = false;
            }
            return return_val;
        };

        s.addNewPet = function(){
            rs.pet_info = {};
            rs.show_pet_edit = true;
            rs.show_new_pet = true;
        };

        s.updatePet = function() {
            if (s.checkPet()) {
                rs.pet_info.is_enabled = (rs.pet_info.is_enabled_v ? 'PET' : 'DISABLED');
                var id = (rs.pet_info.id || 'register'),
                    data = {
                        name: rs.pet_info.name,
                        dog_cat: rs.pet_info.dog_cat,
                        gender: rs.pet_info.gender.toUpperCase(),
                        hunting_profile: rs.pet_info.hunting_profile,
                        petStatus: rs.pet_info.is_enabled,
                        photo: (rs.pet_info.image || '')
                    };
                Api.post('/pets/'+id, data).then(function(res){
                    if (!res.is_error) {
                        s.update_pet_success = true;
                        $timeout(function(){
                            s.update_pet_success = false;
                        }, 3000);
                    } else {
                        s.update_pet_error = true;
                        $timeout(function(){
                            s.update_pet_error = false;
                        }, 3000);
                    }
                })
            }
        };

        s.noMapPetCoordinates = function() {
            if (rs.pet_info && rs.pet_info.position) {
                return (!rs.pet_info.position.latitude || !rs.pet_info.position.longitude);
            }
            return false;
        }

    }
});