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
