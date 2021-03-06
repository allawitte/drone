(function () {
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
        .run(run)
        .controller('MainController', MainController);

    run.$inject = ['$localStorage', '$state', '$rootScope'];
    function run($localStorage, $state, $rootScope) {
        console.log('function run');
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            if (notLoggedIn() && notAuthPage(toState.url)) {
                event.preventDefault();
                return $state.go('login');
            }
            return;
        });

        function notAuthPage(url) {
            if (url != '/login' && url != '/register') {
                return true;
            }
            return false;
        }

        function notLoggedIn() {
            if ($localStorage.user) {
                return false
            }
            else return true;
        }

    }

    MainController.$inject = ['$scope', 'authService', '$rootScope', '$state'];

    function MainController($scope, authService, $rootScope, $state) {
        var vm = this;
        vm.goTo = goTo;
        $scope.logOut = logOut;
        console.log('main menu');
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.bg = toState.id;
            if(fromState.url === '/login'){
                $rootScope.isLogged = true;
            }
            $scope.currentNavItem = toState.id;
        });

        if (authService.checkAuth()) {
            $rootScope.isLogged = true;
        }


        function logOut() {
            authService.cancelAuth();
            $rootScope.isLogged = false;
            $state.go('view');
        }

        function goTo(location){
            $state.go(location);
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

(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewController', viewController);

    viewController.$inject = ['$localStorage', '$state'];

    function viewController($localStorage, $state) {
        var vm = this;
        vm.user = $localStorage.user;
        


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
})();
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
            $http.get('/menu/')
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

(function () {
    'use strict';

    angular
        .module('app')
        .factory('socketService', socketService);
    socketService.$inject = [];

    function socketService() {
        return io.connect('http://localhost:8000');
    }
})();
/**
 * Created by HP on 3/20/2017.
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
        service.getUser = getUser;
        service.topUp = topUp;
        service.refundPayment = refundPayment;
        return service;
        
        function refundPayment(user, data){
            return $http.put('/user/refund/' + user, data);
        }

        function topUp(user, data) {
            return $http.put('/user/topup/' + user, data);
        }

        function userCreate(user) {
            return $http.post('/register', user);
        }

        function userAuth(user) {
            return $http.post('/auth', user);
        }

        function getUser(user) {
            return $http.get('/user/' + user);
        }

    }
})();
/**
 * Created by HP on 1/13/2017.
 */

'use strict';
(function () {
    'use strict';

    angular
        .module('app')
        .controller('accountController', accountController);

    accountController.$inject = ['userService', '$localStorage', '$state', 'orderService'];

    function accountController(userService, $localStorage, $state, orderService) {
        var vm = this;
        vm.topUp = topUp;
        vm.user = $localStorage.user;
        vm.faledOrders = [];
        vm.refund = refund;
        if (vm.user == undefined) {
            $state.go('login');
        }
        else {
            userService.getUser(vm.user)
                .then(function (data) {
                        console.log('got user');
                        vm.userData = data.data;
                        orderService.getUndeliveredOrders(vm.user)
                            .then(function (data) {
                                    console.log('data', data.data);
                                    vm.faledOrders = data.data;
                                }
                                , function (err) {
                                    console.log('err', err);
                                });
                    }
                    , function (err) {
                        console.log(err);
                    });
        }

        function refund(orderId, payment, discount) {
            orderService.disActivateRefund(orderId)
                .then(function (data) {
                        userService.refundPayment(vm.user, {payment: payment})
                            .then(function (data) {
                                    vm.userData.account = data.data.account;
                                    vm.faledOrders.forEach(function(item){
                                        if(item._id == orderId){
                                            item.discount = false;
                                        }
                                        if(discount){
                                            $localStorage.discount = 0.05;
                                            $state.go('menu');
                                        }
                                    });
                                }
                                , function (err) {
                                    console.log(err);
                                });
                    }
                    , function (err) {
                        console.log(err);
                    })
        }


        function topUp() {
            userService.topUp(vm.user, {account: 100})
                .then(function (data) {
                        vm.userData = data.data;
                    }
                    , function (err) {
                        console.log(err);
                    });
        }


    }
})();
/**
 * Created by HP on 4/7/2017.
 */

(function () {
    'use strict';

    angular
        .module('app')
        .controller('cookController', cookController);

    cookController.$inject = ['orderService', '$scope', '$timeout'];

    function cookController(orderService, $scope, $timeout) {
        var vm = this;
        vm.changeStatus = changeStatus;
        setInterval(function () {
            if (Array.isArray($scope.proceedDishes)) {
                $scope.proceedDishes.forEach(function (meal) {
                    if ('duration' in meal) {
                        changeTime(meal);
                    }
                });
                $scope.$apply();
            }
        }, 1000);


        function changeTime(meal) {
            var now = moment();
            if (meal.status == 1) {
                meal.time.forEach(function (time) {
                    if (time.status == 1) {
                        var start = moment(time.moment);
                        meal.duration = {
                            seconds: now.diff(start, 'seconds') % 60,
                            minutes: now.diff(start, 'minutes') % 60,
                            hour: now.diff(start, 'hours') % 24,
                            days: now.diff(start, 'days')
                        };
                    }

                });
                return meal.duration;
            }
        }

        function changeStatus(item, status) {
            item.status = status;
            item.time.push({status: status, moment: new Date()});
            orderService.changeOrderStatus(item)
                .then(function (res) {
                        if (status == 1) {
                            splitMeals(vm.dishes);
                        }
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
                            dishId: item.dishId,
                            time: item.time
                        }
                    });
                    splitMeals(vm.dishes);

                }
                , function (err) {
                    console.log(err);
                });

        function splitMeals(meals) {
            vm.orderedDishes = [];
            $scope.proceedDishes = [];
            meals.forEach(function (meal) {
                if (meal.status == 0) {
                    vm.orderedDishes.push(meal);
                }
                else {
                    if (meal.status == 1) {
                        meal.time.forEach(function (time) {
                            if (time.status == 1) {
                                if (!('duration' in meal)) {
                                    changeTime(meal);
                                }
                            }
                        });
                    }
                    $scope.proceedDishes.push(meal);

                }
            });

        }

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

(function () {
    'use strict';

    angular
        .module('app')
        .controller('orderController', orderController);

    orderController.$inject = ['$localStorage', 'orderService', 'socketService', '$scope'];

    function orderController($localStorage, orderService, socketService, $scope) {
        var vm = this;
        $scope.progressReport = [];
        vm.user = $localStorage.user;
        vm.status = ['Ordered', 'In Progress', 'To Delivery', 'Delivered', 'Problems to Deliver'];
        socketService.on('order', function (data) {
            console.log('on socket', data);
            if (Array.isArray($scope.dishes)) {
                var times = parseTime(data.time);
                $scope.dishes.forEach(function (item, index) {
                    if (item.userId == data.userId && item._id == data._id) {
                        $scope.progressReport[index].time = times;
                        $scope.dishes[index].progress = times;
                        $scope.dishes[index].status = data.status;
                        console.log('$scope.dishes', $scope.dishes);
                        $scope.$digest();
                    }
                });
            }
        });
        setInterval(function () {
            if (Array.isArray($scope.dishes)) {
                $scope.dishes.forEach(function (meal) {
                    if (meal.status < 3) {
                        changeTime(meal);
                    }
                });
                $scope.$apply();
            }
        }, 1000);
        orderService.getOrdersForClient(vm.user)
            .then(function (data) {
                console.log('data', data);
                    $scope.dishes = data.data.map(function (item) {
                        var times = parseTime(item.time);
                        return {
                            _id: item._id,
                            status: item.status,
                            dish: item.dishes[0],
                            userId: item.userId,
                            dishId: item.dishId,
                            time: item.time,
                            progress: times
                        }
                    });
                    $scope.dishes.forEach(function(item){
                        changeTime(item);
                        $scope.progressReport.push({time:item.progress});
                    });
                }
                , function (err) {
                    console.log('err', err);
                });

        function parseTime(times) {
            return times.map(function (item) {
                return {status: item.status, moment: moment(item.moment).format('MMMM Do, h:mm')};
            })
        }

        function changeTime(meal) {
            var now = moment();
            if (meal.status < 3) {
                meal.time.forEach(function (time) {
                    if (time.status == 0) {

                        var start = moment(time.moment, moment.ISO_8601);
                        meal.duration = {
                            seconds: now.diff(start, 'seconds') % 60,
                            minutes: now.diff(start, 'minutes') % 60,
                            hour: now.diff(start, 'hours') % 24,
                            days: now.diff(start, 'days')
                        };
                    }

                });
                return meal.duration;
            }
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
        .controller('registerController', registerController);

    registerController.$inject = ['userService', '$state', '$localStorage'];

    function registerController(userService, $state, $localStorage) {
        var vm = this;
        vm.isDidabled = isDidabled;
        vm.save = save;

        function isDidabled(err1, err2) {
            return !(JSON.stringify(err1) == "{}" && JSON.stringify(err2) == "{}")
        }

        function save(user) {
            user.account = 0;
            userService.userCreate(user)
                .then(function (res) {
                        console.log('success', res);
                        $localStorage.user = res.data.user._id;
                        $state.go('view');
                    }
                    , function (err) {
                        if (err.status == 433) {
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
