(function () {
    'use strict';

    angular
        .module('app')
        .controller('orderController', orderController);

    orderController.$inject = ['$localStorage', 'orderService'];

    function orderController($localStorage, orderService) {
        var vm = this;
        vm.user = $localStorage.user;
        orderService.getOrdersForClient(vm.user)
            .then(function (data) {

                    vm.dishes = data.data.map(function (item) {
                        return {
                            _id: item._id,
                            status: item.status,
                            dish: item.dishes[0],
                            userId: item.userId,
                            dishId: item.dishId
                        }
                    });
                    console.log('vm.dishes', vm.dishes);
                }
                , function (err) {
                    console.log('err', err);
                });
    }
})();
/**
 * Created by HP on 1/12/2017.
 */
