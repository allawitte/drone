(function () {
    'use strict';

    angular
        .module('app')
        .controller('orderController', orderController);

    orderController.$inject = ['$localStorage', 'orderService', 'socketService', '$scope'];

    function orderController($localStorage, orderService, socketService, $scope) {
        var vm = this;
        $scope.progressReport = [];
        vm.user = $localStorage.user;
        vm.status = ['Ordered', 'In Progress', 'To Delivery', 'Delivered', 'Problems to Deliver'];
        socketService.on('order', function (data) {
            if (Array.isArray(vm.dishes)) {
                var times = parseTime(data.time);
                vm.dishes.forEach(function (item, index) {
                    if (item.userId == data.userId && item._id == data._id) {
                        $scope.progressReport[index].time = times;
                        console.log('index', index);
                        $scope.$digest();
                    }
                });
            }
            console.log('data:', data);
        });
        orderService.getOrdersForClient(vm.user)
            .then(function (data) {
                console.log('data', data);
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
                    console.log('vm.dishes', vm.dishes);
                    vm.dishes.forEach(function(item){
                        $scope.progressReport.push({time:item.time});
                    });
                    console.log('$scope.progressReport', $scope.progressReport);
                }
                , function (err) {
                    console.log('err', err);
                });

        function parseTime(times) {
            return times.map(function (item) {
                return {status: item.status, moment: moment(item.moment).format('MMMM Do, h:mm')};
            })
        }
    }
})();
/**
 * Created by HP on 1/12/2017.
 */
