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
            console.log('on socket', data);
            if (Array.isArray($scope.dishes)) {
                var times = parseTime(data.time);
                $scope.dishes.forEach(function (item, index) {
                    if (item.userId == data.userId && item._id == data._id) {
                        $scope.progressReport[index].time = times;
                        $scope.dishes[index].progress = times;
                        $scope.dishes[index].status = data.status;
                        console.log('$scope.dishes', $scope.dishes);
                        $scope.$digest();
                    }
                });
            }
        });
        setInterval(function () {
            if (Array.isArray($scope.dishes)) {
                $scope.dishes.forEach(function (meal) {
                    if (meal.status < 3) {
                        changeTime(meal);
                    }
                });
                $scope.$apply();
            }
        }, 1000);
        orderService.getOrdersForClient(vm.user)
            .then(function (data) {
                console.log('data', data);
                    $scope.dishes = data.data.map(function (item) {
                        var times = parseTime(item.time);
                        return {
                            _id: item._id,
                            status: item.status,
                            dish: item.dishes[0],
                            userId: item.userId,
                            dishId: item.dishId,
                            time: item.time,
                            progress: times
                        }
                    });
                    $scope.dishes.forEach(function(item){
                        changeTime(item);
                        $scope.progressReport.push({time:item.progress});
                    });
                }
                , function (err) {
                    console.log('err', err);
                });

        function parseTime(times) {
            return times.map(function (item) {
                return {status: item.status, moment: moment(item.moment).format('MMMM Do, h:mm')};
            })
        }

        function changeTime(meal) {
            var now = moment();
            if (meal.status < 3) {
                meal.time.forEach(function (time) {
                    if (time.status == 0) {

                        var start = moment(time.moment, moment.ISO_8601);
                        meal.duration = {
                            seconds: now.diff(start, 'seconds') % 60,
                            minutes: now.diff(start, 'minutes') % 60,
                            hour: now.diff(start, 'hours') % 24,
                            days: now.diff(start, 'days')
                        };
                    }

                });
                return meal.duration;
            }
        }
    }
})();
/**
 * Created by HP on 1/12/2017.
 */
