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
        service.getOrdersForClient = getOrdersForClient;
        service.changeOrderStatus = changeOrderStatus;
        
        function getOrdersForClient(clientId){
            return $http.get('order/' + clientId);
        }


        function placeOrder(data) {
            return $http.post('/order', data);
        }

        function getOrders() {
            return $http.get('/order/cook');
        }

        function changeOrderStatus(data) {
            return $http.put('/order/change-status', data);
        }

        return service;

    }
})();
/**
 * Created by HP on 1/14/2017.
 */
