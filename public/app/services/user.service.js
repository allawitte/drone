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
        service.getUser = getUser;
        service.topUp = topUp;
        return service;

        function topUp(user, data) {
            return $http.put('/user/topup/' + user, data);
        }

        function userCreate(user) {
            return $http.post('/register', user);
        }

        function userAuth(user) {
            return $http.post('/auth', user);
        }

        function getUser(user) {
            return $http.get('/user/' + user);
        }

    }
})();
/**
 * Created by HP on 1/13/2017.
 */
