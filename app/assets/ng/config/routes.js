define([], function(){
    'use strict';
    return function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './assets/ng/modules/home/home.html',
                controller: 'HomeCtrl'
            })
            .when('/contact', {
                templateUrl: '../assets/ng/modules/home/contact.html',
                controller: 'HomeCtrl'
            })
            .when('/login', {
                templateUrl: './assets/ng/modules/auth/login.html',
                controller: 'AuthCtrl'
            })
            .when('/register', {
                templateUrl: './assets/ng/modules/auth/register.html',
                controller: 'AuthCtrl'
            })
            .when('/pet-tracker', {
                templateUrl: './assets/ng/modules/pet-tracker/pet-tracker.html',
                controller: 'PetTrackerCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    };
});