define([], function(){
    'use strict';
    return function($rootScope, $filter, $location) {
        var rs = $rootScope;

        // set initial
        rs.authenticated = JSON.parse(localStorage.getItem("authenticated"));
        rs.identity = JSON.parse(localStorage.getItem("identity"));

        // init identity
        rs.checkLoggedIn = function() {
            var auth_locations = ['#/login', '#/register'],
                is_auth_location = (auth_locations.indexOf(window.location.hash) != -1);
            if (!rs.authenticated && !is_auth_location) {
                $location.path('/');
            } else if (rs.authenticated && is_auth_location) {
                $location.path('/');
            }
        };

        rs.link = function(link) {
            window.location = '/#'+link;
        };

    }
});