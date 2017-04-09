(function () {
    'use strict';

    angular
        .module('app')
        .factory('authService', authService);
    authService.$inject = ['$localStorage'];

    function authService($localStorage) {

        var service = {};
        service.checkAuth = checkAuth;
        service.cancelAuth = cancelAuth;

        function cancelAuth(){
            delete $localStorage.token;
            delete $localStorage.user;
        }
         function checkAuth(){
             return $localStorage.token != undefined;
         }
        return service;
        
    }
})();
/**
 * Created by HP on 1/14/2017.
 */
