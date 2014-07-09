angular.module('barsOfGold',['ui.bootstrap','ngRoute'])
.config(['$routeProvider',function($routeProvider){
    $routeProvider
        .when('/accounts', {
            templateUrl: '/app/src/templates/account-list.html'
        })
        .when('/account/:accountId', {
            templateUrl: '/app/src/templates/account.html'
        })
        .when('/transaction/:transactionId', {
            templateUrl: '/app/src/templates/transaction2.html'
        })
        .otherwise({'redirectTo':'/accounts'});
}]);