define([], function() {
    'use strict';
    return function ($http, $q, $rootScope, config) {

        var self = this,
            rs = $rootScope;

        //@Todo: replace with real request;

        this.get = function(method, data, headers, without_auth, local) {
            var deffered = $q.defer();
            headers = (headers || {});
            if (!without_auth) {
                headers.Authorization = "Basic " + btoa(rs.identity.username + ":" + rs.identity.password);
            }
            $http({method: 'GET', url: config.api_url + method, params: data, headers: headers})
                .success(function(data, status, headers){
                    deffered.resolve({
                        is_error: 0,
                        data: data,
                        headers: headers
                    });
                }).error(function(err){
                    deffered.resolve({
                        is_error: 1,
                        data: err
                    });
                });
            return deffered.promise;
        };

        this.post = function(method, data, headers, without_auth) {
            var deffered = $q.defer();
            headers = (headers || {});
            if (!without_auth) {
                headers.Authorization = "Basic " + btoa(rs.identity.username + ":" + rs.identity.password);
            }
            $http.post(config.api_url + method, data, {headers: headers}).then(function(res){
                deffered.resolve({
                    is_error: 0,
                    data: res.data
                });
            }, function(err, status){
                deffered.resolve({
                    is_error: 1,
                    data: err
                })
            });
            return deffered.promise;
        };

        this.Fpost = function(method, data, headers) {
            var deffered = $q.defer();
            deffered.resolve({
                is_error: 1,
                data: {}
            });
            return deffered.promise;
        }

    }
});