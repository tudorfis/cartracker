define([
    './assets/ng/config/config',
    './assets/ng/config/routes',
    './assets/ng/services/api.service',
    './assets/ng/factory/googleMaps.factory',
    './assets/ng/factory/fileReader.factory',
    './assets/ng/directives/ngFileSelect.directive',
    './assets/ng/run/basic.run',
    './assets/ng/modules/home/HomeCtrl',
    './assets/ng/modules/auth/AuthCtrl',
    './assets/ng/modules/pet-tracker/PetTrackerCtrl'
], function(configConstant, configRoutes, Api, googleMaps, fileReader, ngFileSelect, basicRun, HomeCtrl, AuthCtrl, PetTrackerCtrl){
    'use strict';

    var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngMaterial', 'ngMessages', 'ngCookies']);

    // constant
    app.constant('config', configConstant);
    app.config(configRoutes);

    // cors request
    app.config(function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.post["Content-Type"] = "application/json";
    });

    // stuff
    app.service('Api', Api);
    app.factory('googleMaps', googleMaps);
    app.factory("fileReader", fileReader);
    app.directive('ngFileSelect', ngFileSelect);
    app.run(basicRun);
    app.controller('HomeCtrl', HomeCtrl);
    app.controller('AuthCtrl', AuthCtrl);
    app.controller('PetTrackerCtrl', PetTrackerCtrl);

    return app;
});