(function () {
    'use strict';

    angular
        .module('app')
        .controller('orderController', orderController);

    orderController.$inject = ['$localStorage', 'orderService'];

    function orderController($localStorage, orderService) {
        var vm = this;
        vm.user = $localStorage.user;
        vm.status = ['Ordered', 'In Progress', 'To Delivery', 'Delivered', 'Problems to Deliver'];
        orderService.getOrdersForClient(vm.user)
            .then(function (data) {
                    vm.dishes = data.data.map(function (item) {
                        var times = parseTime(item.time);
                        return {
                            _id: item._id,
                            status: item.status,
                            dish: item.dishes[0],
                            userId: item.userId,
                            dishId: item.dishId,
                            time: times
                        }
                    });
                }
                , function (err) {
                    console.log('err', err);
                });

        function parseTime(times){
            return times.map(function(item){
                return   moment(item).format('MMMM Do, h:mm');
            })
        }
    }
})();
/**
 * Created by HP on 1/12/2017.
 */
