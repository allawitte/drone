(function () {
    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('menu', {
                url: '/menu',
                controller: 'menuController',
                templateUrl: 'app/pages/menu/menu.html',
                controllerAs: 'vm',
                id: "menu"
            })
            .state('order', {
                url: '/order',
                controller: 'orderController',
                templateUrl: 'app/pages/order/order.html',
                controllerAs: 'vm',
                id: "order"
            })
            .state('view', {
                url: '/',
                controller: 'viewController',
                templateUrl: 'app/pages/view.html',
                controllerAs: 'vm',
                id: "view"
            })
            .state('login', {
                url: '/login',
                controller: 'loginController',
                templateUrl: 'app/pages/login/login.html',
                controllerAs: 'vm',
                id: "login"
            })
            .state('register', {
                url: '/register',
                controller: 'registerController',
                templateUrl: 'app/pages/register/register.html',
                controllerAs: 'vm',
                id: "register"
            })
            .state('cook', {
                url: '/cook',
                controller: 'cookController',
                templateUrl: 'app/pages/cook/cook.html',
                controllerAs: 'vm',
                id: "cook"
            })
            .state('account', {
            url: '/account',
            controller: 'accountController',
            templateUrl: 'app/pages/account/account.html',
            controllerAs: 'vm',
            id: "account"
        })

    }
})();
/**
 * Created by HP on 1/12/2017.
 */
