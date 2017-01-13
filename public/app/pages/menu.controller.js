(function () {
    'use strict';

    angular
        .module('app')
        .controller('menuController', menuController);

    menuController.$inject = ['MenuService'];

    function menuController(MenuService) {
        var vm = this;
        MenuService.getMenu(function(data){
           vm.menu = data;
        });
       

    }
})();
/**
 * Created by HP on 1/12/2017.
 */
