(function () {
    'use strict';

    angular
        .module('app')
        .controller('menuController', menuController);

    menuController.$inject = [];

    function menuController() {
        var vm = this;
        console.log('Menu');

    }
})();
/**
 * Created by HP on 1/12/2017.
 */
