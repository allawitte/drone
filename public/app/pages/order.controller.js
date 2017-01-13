(function () {
    'use strict';

    angular
        .module('app')
        .controller('orderController', orderController);

    orderController.$inject = [];

    function orderController() {
        var vm = this;
        console.log('Order');
    }
})();
/**
 * Created by HP on 1/12/2017.
 */
