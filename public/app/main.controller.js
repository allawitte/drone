(function () {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    MainController.$inject = [];

    function MainController() {
        var vm = this;
        console.log('Main Controller');

    }
})();
/**
 * Created by HP on 1/12/2017.
 */
