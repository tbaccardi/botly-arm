(function() {
    'use strict'
    angular.module('botly', ['ngMaterial', 'ui.router', 'LocalStorageModule'])


    .run(function($rootScope, authFactory, $state) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            
            if(toState.authRequired === true) { 
                var creds = authFactory.verify('AuthorizationData');
                if(!!!creds) {
                    event.preventDefault();
                    $state.go('login');
                }
                       
                else {
                    console.log(creds.token);
                }
            }
        })
    })

    .config( function($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('home', {
                url: '/home',
                templateUrl: 'htmls/home.html',
                controller: 'homeController as homeCtrl',
                authRequired: true
            })

            .state('login', {
                url: '/login',
                templateUrl: 'htmls/login.html',
                controller: 'loginController as loginCtrl'
            });

        $urlRouterProvider.otherwise('/home');

    })
    
    .controller('homeController', function($state, authFactory) {
        this.logout = function() {
            authFactory.deauthenticate();
            $state.go('login');
        }
    })

})();
