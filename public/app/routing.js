(function () {
    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/view');

        $stateProvider
            .state('menu', {
                url: '/menu',
                controller: 'menuController',
                templateUrl: 'app/pages/menu.html',
                controllerAs: 'vm',
                id: "menu"
            })
            .state('order', {
                url: '/order',
                controller: 'orderController',
                templateUrl: 'app/pages/order.html',
                controllerAs: 'vm',
                id: "order"
            })
            .state('view', {
                url: '/view',
                controller: 'viewController',
                templateUrl: 'app/pages/view.html',
                controllerAs: 'vm',
                id: "view"
            })

    }
})();
/**
 * Created by HP on 1/12/2017.
 */
