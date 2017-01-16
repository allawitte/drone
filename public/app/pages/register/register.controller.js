(function () {
    'use strict';

    angular
        .module('app')
        .controller('registerController', registerController);

    registerController.$inject = ['userService'];

    function registerController(userService) {
        var vm = this;
        vm.isDidabled = isDidabled;
        vm.save = save;

        function isDidabled(err1, err2) {
            return !(JSON.stringify(err1) == "{}" && JSON.stringify(err2) == "{}")
        }

        function save(user) {
            userService.userCreate(user)
                .then(function (result) {
                        console.log('success', result);
                    }
                    , function (err) {
                        if(err.status == 403){
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
