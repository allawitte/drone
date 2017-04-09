(function () {
    'use strict';

    angular
        .module('app')
        .controller('menuController', menuController);

    menuController.$inject = ['MenuService', '$localStorage', 'orderService', '$scope', '$mdDialog', '$rootScope'];

    function menuController(MenuService, $localStorage, orderService, $scope, $mdDialog, $rootScope) {
        var vm = this;
        vm.makeOrder = makeOrder;
        MenuService.getMenu(function (data) {            
            vm.menu = data;
        });
        
        function makeOrder(dishId, price, ev) {
            var discount = $localStorage.discount;
            if(discount){
                price = price - price*discount;
            }
            orderService.placeOrder({
                userId: $localStorage.user,
                dishId: dishId,
                time: new Date(),
                payment: price
            })
                .then(function (res) {
                        if(res.status == 200){
                            $rootScope.success = true;
                            delete $localStorage.discount;
                            allert(ev);
                        }
                    }
                    , function (err) {
                        $rootScope.success = false;
                        allert(ev);
                    });
        }
        $scope.customFullscreen = false;
        
        function DialogController($scope, $mdDialog, $state) {
            $scope.success = function () {
                return $rootScope.success;
            };
            $scope.failed = function(){
                return !$rootScope.success;
            };
        
            $scope.goToAccount = function(){
                $scope.cancel();
                $state.go('account');
            }
        
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
        }
        function allert(ev) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: '/app/pages/menu/dialog1.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        };

    }
})();
/**
 * Created by HP on 1/12/2017.
 */
