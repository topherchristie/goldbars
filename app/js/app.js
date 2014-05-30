angular.module('barsOfGold',['ui.bootstrap','ngRoute'])
.config(function($routeProvider){
    $routeProvider
        .when('/accounts', {
            templateUrl: '/app/js/templates/account-list.html'
        })
        .when('/account/:accountId', {
            templateUrl: '/app/js/templates/account.html'
        })
        .otherwise({'redirectTo':'/accounts'});
});