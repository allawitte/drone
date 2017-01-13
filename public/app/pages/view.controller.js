(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewController', viewController);

    viewController.$inject = [];

    function viewController() {
        var vm = this;
        console.log('View');

    }
})();
/**
 * Created by HP on 1/12/2017.
 */
