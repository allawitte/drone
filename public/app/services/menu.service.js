(function () {
    'use strict';

    angular
        .module('app')
        .factory('MenuService', MenuService);
    MenuService.$inject = ['$http'];

    function MenuService($http) {

        var service = {};

        service.getMenu = getMenu;
        return service;

        function getMenu(cb){
            $http.get('/menu')
                .then(function(data, status){
                    cb(data.data);
                });
        }


    }
})();
/**
 * Created by HP on 1/12/2017.
 */
