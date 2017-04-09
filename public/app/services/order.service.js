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
        service.getUndeliveredOrders = getUndeliveredOrders;
        service.changeOrderStatus = changeOrderStatus;
        service.disActivateRefund = disActivateRefund;
        
        function disActivateRefund(orderId){
            return $http.put('refund/'+ orderId);
        }
        
        function getUndeliveredOrders(clientId){
            return $http.get('discount/' + clientId);
        }
        
        function getOrdersForClient(clientId){
            return $http.get('order/' + clientId);
        }


        function placeOrder(data) {
            return $http.post('/order/', data);
        }

        function getOrders() {
            return $http.get('/cook/order');
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
