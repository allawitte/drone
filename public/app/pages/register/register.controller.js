(function () {
    'use strict';

    angular
        .module('app')
        .controller('registerController', registerController);

    registerController.$inject = ['userService', '$state', '$localStorage'];

    function registerController(userService, $state, $localStorage) {
        var vm = this;
        vm.isDidabled = isDidabled;
        vm.save = save;

        function isDidabled(err1, err2) {
            return !(JSON.stringify(err1) == "{}" && JSON.stringify(err2) == "{}")
        }

        function save(user) {
            user.account = 0;
            userService.userCreate(user)
                .then(function (res) {
                        console.log('success', res);
                        $localStorage.user = res.data.user._id;
                        $state.go('view');
                    }
                    , function (err) {
                        if (err.status == 433) {
                            vm.userExists = true;
                            console.log('User already exists');
                        }
                        console.log(err);
                    })
        }

    }
})();
/**
 * Created by HP on 1/13/2017.
 */
