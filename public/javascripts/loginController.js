(function() {
  'use strict'
    angular.module('botly').controller('loginController',
        function($scope, $state, $q, $http, localStorageService, authFactory) {

            this.loginModel = {
                username: '',
                password: ''
            }

            this.login = function(loginData) {
                return authFactory.authenticate(loginData).then(function() {
                    
                    $state.go('home');
                }, function(error) {
                    authFactory.authData.username = '';
                    authFactory.authData.token = '';
                    alert('Authentication failed');
                })
            }
                        
        })
})();
