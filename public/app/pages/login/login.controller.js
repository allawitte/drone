(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['userService', '$state'];

    function loginController(userService, $state) {
        var vm = this;
        vm.login = login;

        function login(user){
            userService.userAuth(user)
                .then(function (res) {
                        console.log(res);
                        $state.go('view');
                    }
                    , function (err) {
                        console.log(err.message);
                        vm.userExists = true;
                    });
        }

    }
})();
/**
 * Created by HP on 1/13/2017.
 */
