(function () {
    'use strict';

    angular
        .module('app')
        .controller('cookController', cookController);

    cookController.$inject = ['orderService', '$scope', '$timeout'];

    function cookController(orderService, $scope, $timeout) {
        var vm = this;
        vm.changeStatus = changeStatus;
        setInterval(function () {
            if (Array.isArray($scope.proceedDishes)) {
                $scope.proceedDishes.forEach(function (meal) {
                    if ('duration' in meal) {
                        changeTime(meal);
                    }
                });
                $scope.$apply();
            }
        }, 1000);


        function changeTime(meal) {
            var now = moment();
            if (meal.status == 1) {
                meal.time.forEach(function (time) {
                    if (time.status == 1) {
                        var start = moment(time.moment);
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

        function changeStatus(item, status) {
            item.status = status;
            item.time.push({status: status, moment: new Date()});
            orderService.changeOrderStatus(item)
                .then(function (res) {
                        if (status == 1) {
                            splitMeals(vm.dishes);
                        }
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
                    splitMeals(vm.dishes);

                }
                , function (err) {
                    console.log(err);
                });

        function splitMeals(meals) {
            vm.orderedDishes = [];
            $scope.proceedDishes = [];
            meals.forEach(function (meal) {
                if (meal.status == 0) {
                    vm.orderedDishes.push(meal);
                }
                else {
                    if (meal.status == 1) {
                        meal.time.forEach(function (time) {
                            if (time.status == 1) {
                                if (!('duration' in meal)) {
                                    changeTime(meal);
                                }
                            }
                        });
                    }
                    $scope.proceedDishes.push(meal);

                }
            });

        }

    }
})();


/**
 * Created by HP on 1/14/2017.
 */
