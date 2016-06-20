'use strict';
require.config({
    baseUrl: '',
    paths: {
        'app': './assets/ng/app',
        'angular': './lib/angular/angular.min',
        'angular-route': './lib/angular-route/angular-route.min',
        'angular-animate': './lib/angular-animate/angular-animate.min',
        'angular-messages': './lib/angular-messages/angular-messages.min',
        'angular-cookies': './lib/angular-cookies/angular-cookies.min',
        'angular-aria': './lib/angular-aria/angular-aria.min',
        'angular-material': './lib/angular-material/angular-material.min'
    },
    shim: {
        'app': {
            deps: ['angular', 'angular-route', 'angular-material', 'angular-animate', 'angular-cookies']
        },
        'angular-route': {
            deps: ['angular'],
            ref: 'ngRoute'
        },
        'angular-aria': {
            deps: ['angular']
        },
        'angular-messages': {
            deps: ['angular'],
            ref: 'ngMessages'
        },
        'angular-cookies': {
            deps: ['angular'],
            ref: 'ngCookies'
        },
        'angular-animate': {
            deps: ['angular'],
            ref: 'ngAnimate'
        },
        'angular-material': {
            deps: ['angular', 'angular-aria', 'angular-messages', 'angular-animate'],
            ref: 'ngMaterial'
        }
    }
});

require(['app'], function(app){
    angular.bootstrap(document, ['app']);
});

