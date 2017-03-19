(function () {
    'use strict';

    angular
        .module('app')
        .factory('MenuService', MenuService);
    MenuService.$inject = ['$http', '$localStorage', 'authService', '$state'];

    function MenuService($http, $localStorage, authService, $state) {

        var service = {};

        service.getMenu = getMenu;
        return service;

        function getMenu(cb){
            if(!authService.checkAuth()) {
                $state.go('login');
            }
            $http.get('/menu/')
                .then(function(data, status){
                    cb(data.data);
                });
        }
    }
})();
/**
 * Created by HP on 1/12/2017.
 */
