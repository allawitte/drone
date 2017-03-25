(function () {
    'use strict';

    angular
        .module('app')
        .controller('cookController', cookController);

    cookController.$inject = ['orderService', '$scope'];

    function cookController(orderService, $scope) {
        var vm = this;
        vm.changeStatuse = changeStatuse;

        function changeStatuse(item) {
            console.log('item', item);
            orderService.changeOrderStatus(item)
                .then(function (res) {
                        console.log(res)
                    },
                    function (err) {
                        console.log(err);
                    });
        }

        orderService.getOrders()
            .then(function (res) {
                    console.log('res.data', res.data);
                    vm.dishes = res.data.map(function (item) {
                        return {
                            _id: item._id,
                            status: item.status,
                            dish: item.dishes[0],
                            userId: item.userId,
                            dishId: item.dishId,
                            time: item.time
                        }
                    });

                    console.log(vm.dishes);
                }
                , function (err) {
                    console.log(err);
                });



    }
})();


/**
 * Created by HP on 1/14/2017.
 */
