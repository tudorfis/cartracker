define([], function() {
    return function ($scope, $rootScope, $location, $timeout, $mdToast, $http, Api) {

        var s = $scope,
            rs = $rootScope;

        rs.checkLoggedIn();

        s.login = function() {
            rs.identity = {
                username: s.login_info.username,
                password: s.login_info.password
            };
            localStorage.setItem("identity", JSON.stringify(rs.identity));
            Api.get('/details').then(function(res){
                rs.authenticated = (!res.is_error && res.data.user !== undefined && res.data.user !== null);
                localStorage.setItem("authenticated", JSON.stringify(rs.authenticated));
                if (rs.authenticated) {
                    $location.path('/pet-tracker');
                    if ($('#signin-menu').is(':visible')) {
                        $('#quick_sign_in').trigger('click');
                    }
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Successfully signed in')
                            .theme('success-toast')
                            .position('top right')
                            .hideDelay(1500)
                    );
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Invalid credentials !')
                            .theme('error-toast')
                            .position('top right')
                            .hideDelay(1500)
                    );
                    s.invalid_login = true;
                    $timeout(function(){
                        s.invalid_login = true;
                    }, 3000);
                }
            });
        };

        s.register = function() {
            if (s.register_info.password != s.register_info.c_password) {
                s.password_dont_match = true;
                $timeout(function(){
                    s.password_dont_match = false;
                }, 3000);
            } else {
                Api.post('/users/register', s.register_info, {}, true).then(function(res){
                    if (!res.is_error && res.data) {
                        s.register_complete = true;
                    } else {
                        s.something_went_wrong = true;
                        $timeout(function(){
                            s.something_went_wrong = false;
                        }, 3000);
                    }
                });
            }
        };

        s.forgotPassword = function() {
            Api.post('/users/forgot-password', s.forgot_password_info).then(function(res){
                if (!res.is_error && res.data) {
                    s.email_sent = true;
                } else {
                    s.email_not_sent = true;
                    $timeout(function(){
                        s.email_not_sent = false;
                    }, 3000);
                }
            });
        };

        s.logout = function() {
            rs.authenticated = false;
            rs.identity = {};
            localStorage.setItem("authenticated", JSON.stringify(rs.authenticated));
            localStorage.setItem("identity", JSON.stringify(rs.identity));
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Logged out !')
                    .theme('success-toast')
                    .position('top right')
                    .hideDelay(1500)
            );
            $location.path('/');
        }

    }
});