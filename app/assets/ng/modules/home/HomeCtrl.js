define([], function() {
    return function ($scope, $rootScope) {

        var s = $scope,
            rs = $rootScope;

        rs.is_pet_tracker = false;



        requirejs(['assets/js/slider_revolution'], function(){
            loadRevolutionSlider();
        });
    }
});