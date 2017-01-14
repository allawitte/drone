(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['userService', '$state', '$localStorage'];

    function loginController(userService, $state, $localStorage) {
        var vm = this;
        vm.login = login;

        function login(user){
            console.log('go to login');
            userService.userAuth(user)
                .then(function (res) {
                        console.log('res.data', res.data);
                        $localStorage.token = res.data.token;
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
