'use strict';
(function () {
    'use strict';

    angular
        .module('app')
        .controller('accountController', accountController);

    accountController.$inject = ['userService', '$localStorage', '$state', 'orderService'];

    function accountController(userService, $localStorage, $state, orderService) {
        var vm = this;
        vm.topUp = topUp;
        vm.user = $localStorage.user;
        vm.faledOrders = [];
        vm.refund = refund;
        if (vm.user == undefined) {
            $state.go('login');
        }
        else {
            userService.getUser(vm.user)
                .then(function (data) {
                        console.log('got user');
                        vm.userData = data.data;
                        orderService.getUndeliveredOrders(vm.user)
                            .then(function (data) {
                                    console.log('data', data.data);
                                    vm.faledOrders = data.data;
                                }
                                , function (err) {
                                    console.log('err', err);
                                });
                    }
                    , function (err) {
                        console.log(err);
                    });
        }

        function refund(orderId, payment, discount) {
            orderService.disActivateRefund(orderId)
                .then(function (data) {
                        userService.refundPayment(vm.user, {payment: payment})
                            .then(function (data) {
                                    vm.userData.account = data.data.account;
                                    vm.faledOrders.forEach(function(item){
                                        if(item._id == orderId){
                                            item.discount = false;
                                        }
                                        if(discount){
                                            $localStorage.discount = 0.05;
                                            $state.go('menu');
                                        }
                                    });
                                }
                                , function (err) {
                                    console.log(err);
                                });
                    }
                    , function (err) {
                        console.log(err);
                    })
        }


        function topUp() {
            userService.topUp(vm.user, {account: 100})
                .then(function (data) {
                        vm.userData = data.data;
                    }
                    , function (err) {
                        console.log(err);
                    });
        }


    }
})();
/**
 * Created by HP on 4/7/2017.
 */
