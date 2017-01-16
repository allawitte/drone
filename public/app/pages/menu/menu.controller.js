(function () {
    'use strict';

    angular
        .module('app')
        .controller('menuController', menuController);

    menuController.$inject = ['MenuService', '$localStorage', 'orderService'];

    function menuController(MenuService, $localStorage, orderService) {
        var vm = this;
        vm.makeOrder = makeOrder;
        MenuService.getMenu(function (data) {
            vm.menu = data;
        });

        function makeOrder(dishId) {
            console.log(vm.menu);
            orderService.placeOrder({
                userId: $localStorage.user,
                dishId: dishId,
                time: new Date()
            })
                .then(function (res) {
                        console.log(res)
                    }
                    , function (err) {
                        console.log(err);
                    });
        }


    }
})();
/**
 * Created by HP on 1/12/2017.
 */
