angular.module('barsOfGold')
.controller('TransactionController',['$scope',function($scope){
    $scope.transactions = [];    
    $scope.socket.on('transactions',function(transactions){
        $scope.transactions = transactions;
        $scope.$apply();
    });
}]);