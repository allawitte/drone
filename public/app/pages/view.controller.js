(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewController', viewController);

    viewController.$inject = ['userService', '$localStorage'];

    function viewController(userService, $localStorage) {
        var vm = this;
        vm.topUp = topUp;
        vm.user = $localStorage.user;
        userService.getUser(vm.user)
            .then(function (data) {
                    vm.userData = data.data[0];
                }
                , function (err) {
                    console.log(err);
                });

        function topUp() {
            userService.topUp(vm.user, {account: 100})
                .then(function (data) {
                        console.log(data)
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
