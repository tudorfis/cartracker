// dev_api_key - iddqd
define([], function(){
    'use strict';
    var isDev = (window.location.hostname.indexOf('localhost') != -1);
    return (!isDev ? {
        api_url: "http://localhost:8080",
        default_lat: 35.1740561,
        default_long: 33.385782800000015,
        default_address: 'Zappeiou, Nicosia, Cyprus'
    } : {
        api_url: "http://192.169.174.37:8080",
        default_lat: 35.1740561,
        default_long: 33.385782800000015,
        default_address: 'Zappeiou, Nicosia, Cyprus'
    });
});