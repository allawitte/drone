(function () {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', 'authService'];

    function MainController($scope, authService) {
        var vm = this;
        $scope.logOut = logOut;

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $scope.currentNavItem = toState.id;
        });
        if(authService.checkAuth()){
            $scope.isLogged = true;
        }
        
        function logOut(){
            console.log('log out');
            authService.cancelAuth();
            $scope.isLogged = false;
        }


    }
})();
/**
 * Created by HP on 1/12/2017.
 */
