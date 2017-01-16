(function () {
    'use strict';

    angular
        .module('app')
        .factory('orderService', orderService);
    orderService.$inject = ['$http'];

    function orderService($http) {

        var service = {};

        service.placeOrder = placeOrder;
        service.getOrders = getOrders;

        function placeOrder(data){
            return $http.post('/order', data);
        }

        function getOrders(){
            return $http.get('/order/cook');
        }
        return service;

    }
})();
/**
 * Created by HP on 1/14/2017.
 */
