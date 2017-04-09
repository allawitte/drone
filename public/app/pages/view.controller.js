(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewController', viewController);

    viewController.$inject = ['$localStorage', '$state'];

    function viewController($localStorage, $state) {
        var vm = this;
        vm.user = $localStorage.user;
        


    }
})();
/**
 * Created by HP on 1/12/2017.
 */
