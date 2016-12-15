(function() {
  'use strict'
    angular.module('botly').factory('authFactory', 
        function($q, $http, localStorageService) {

            var authFactory = {};

            authFactory.authData = {
                username: '',
                token: ''
            }

            var clearAuthData = function() {
                authFactory.authData.username = '';
                authFactory.authData.token = '';
            }

            authFactory.authenticate = function(loginData) {
                var deferred = $q.defer();
                $http.post('http://localhost:3000/login', loginData).success(function(response) {
                    authFactory.authData.username = response.user;
                    authFactory.authData.token = response.token;
                    localStorageService.set('AuthorizationData', authFactory.authData);
                    deferred.resolve();
                }).error(function(error) {
                    authFactory.authData.username = '';
                    authFactory.authData.token = '';
                    deferred.reject(error);
                });
                return deferred.promise;
            };

            authFactory.verify = function() {
                var creds = localStorageService.get('AuthorizationData');
                return creds;
            }

            authFactory.deauthenticate = function() {
                localStorageService.remove('AuthorizationData');
                clearAuthData();
            }

            return authFactory;

        })
        
})();