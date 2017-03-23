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
