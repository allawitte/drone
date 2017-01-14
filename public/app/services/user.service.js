(function () {
    'use strict';

    angular
        .module('app')
        .factory('userService', userService);
    userService.$inject = ['$http'];

    function userService($http) {

        var service = {};

        service.userCreate = userCreate;
        service.userAuth = userAuth;
        return service;

        function userCreate(user) {
            return $http.post('/register', user);                
        }
        
        function userAuth(user){           
            return $http.post('/auth', user);
        }

    }
})();
/**
 * Created by HP on 1/13/2017.
 */
