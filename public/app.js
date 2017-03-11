(function(){
    'use strict';
    angular.module('app', ['ui.router', 'ngMaterial', 'ngMdIcons', 'ngMessages', 'ngStorage']);
})();


/**
 * Created by HP on 12/19/2016.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', 'authService', '$localStorage'];

    function MainController($scope, authService, $localStorage) {
        var vm = this;
        $scope.logOut = logOut;

        vm.userId = $localStorage.user;

        console.log('vm.userId', vm.userId);

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $scope.currentNavItem = toState.id;
        });
        if(authService.checkAuth()){
            $scope.isLogged = true;
        }
        
        function logOut(){
            console.log('log out');
            authService.cancelAuth();
            $scope.isLogged = false;
        }


    }
})();
/**
 * Created by HP on 1/12/2017.
 */

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
                id: "view"
            })
            .state('register', {
                url: '/register',
                controller: 'registerController',
                templateUrl: 'app/pages/register/register.html',
                controllerAs: 'vm',
                id: "view"
            })
            .state('cook', {
                url: '/cook',
                controller: 'cookController',
                templateUrl: 'app/pages/cook/cook.html',
                controllerAs: 'vm',
                id: "cook"
            })

    }
})();
/**
 * Created by HP on 1/12/2017.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .factory('authService', authService);
    authService.$inject = ['$localStorage'];

    function authService($localStorage) {

        var service = {};
        service.checkAuth = checkAuth;
        service.cancelAuth = cancelAuth;

        function cancelAuth(){
            delete $localStorage.token;
            delete $localStorage.user;
        }
         function checkAuth(){
             return $localStorage.token != undefined;
         }
        return service;
        
    }
})();;
/**
 * Created by HP on 1/14/2017.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .factory('MenuService', MenuService);
    MenuService.$inject = ['$http', '$localStorage', 'authService', '$state'];

    function MenuService($http, $localStorage, authService, $state) {

        var service = {};

        service.getMenu = getMenu;
        return service;

        function getMenu(cb){
            if(!authService.checkAuth()) {
                $state.go('login');
            }
            $http.get('/menu')
                .then(function(data, status){
                    cb(data.data);
                });
        }
    }
})();
/**
 * Created by HP on 1/12/2017.
 */

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

(function () {
    'use strict';

    angular
        .module('app')
        .factory('userService', userService);
    userService.$inject = ['$http'];

    function userService($http) {

        var service = {};

        service.userCreate = userCreate;
        service.userAuth = userAuth;
        return service;

        function userCreate(user) {
            return $http.post('/register', user);                
        }
        
        function userAuth(user){           
            return $http.post('/auth', user);
        }

    }
})();
/**
 * Created by HP on 1/13/2017.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewController', viewController);

    viewController.$inject = [];

    function viewController() {
        var vm = this;
        

    }
})();
/**
 * Created by HP on 1/12/2017.
 */

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
                        $localStorage.user = res.data.user;
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

(function () {
    'use strict';

    angular
        .module('app')
        .controller('cookController', cookController);

    cookController.$inject = ['orderService', '$scope'];

    function cookController(orderService, $scope) {
        var vm = this;
        vm.changeStatuse = changeStatuse;

        function changeStatuse(item) {
            console.log('item', item);
            orderService.changeOrderStatus(item)
                .then(function (res) {
                        console.log(res)
                    },
                    function (err) {
                        console.log(err);
                    });
        }

        orderService.getOrders()
            .then(function (res) {
                    console.log('res.data', res.data);
                    vm.dishes = res.data.map(function (item) {
                        return {
                            _id: item._id,
                            status: item.status,
                            dish: item.dishes[0],
                            userId: item.userId,
                            dishId: item.dishId
                        }
                    });

                    console.log(vm.dishes);
                }
                , function (err) {
                    console.log(err);
                });



    }
})();


/**
 * Created by HP on 1/14/2017.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('ingredientsListController', ingredientsListController);

    ingredientsListController.$inject = ['$timeout'];

    function ingredientsListController($timeout) {
        var vm = this;       

    }
})();
/**
 * Created by HP on 1/16/2017.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .component('ingredientsList', {
            bindings: {
                ingredients: '=ingredients'
            },
            templateUrl: 'app/pages/cook/ingredients.list.html',
            controller: 'ingredientsListController'
        });
})();
/* Created by HP on 1/16/2017.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('menuController', menuController);

    menuController.$inject = ['MenuService', '$localStorage', 'orderService'];

    function menuController(MenuService, $localStorage, orderService) {
        var vm = this;
        vm.makeOrder = makeOrder;
        MenuService.getMenu(function (data) {
            vm.menu = data;
        });

        function makeOrder(dishId) {
            console.log(vm.menu);
            orderService.placeOrder({
                userId: $localStorage.user,
                dishId: dishId,
                time: new Date()
            })
                .then(function (res) {
                        console.log(res)
                    }
                    , function (err) {
                        console.log(err);
                    });
        }


    }
})();
/**
 * Created by HP on 1/12/2017.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('orderController', orderController);

    orderController.$inject = ['$localStorage', 'orderService'];

    function orderController($localStorage, orderService) {
        var vm = this;
        vm.user = $localStorage.user;
        orderService.getOrdersForClient(vm.user)
            .then(function (data) {

                    vm.dishes = data.data.map(function (item) {
                        return {
                            _id: item._id,
                            status: item.status,
                            dish: item.dishes[0],
                            userId: item.userId,
                            dishId: item.dishId
                        }
                    });
                    console.log('vm.dishes', vm.dishes);
                }
                , function (err) {
                    console.log('err', err);
                });
    }
})();
/**
 * Created by HP on 1/12/2017.
 */

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
