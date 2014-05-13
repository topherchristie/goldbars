angular.module('barsOfGold')
.controller('MainController',['$scope','$rootScope',function($scope,$rootScope){
    $scope.name='Hello world';
    $rootScope.socket = io.connect();
    $scope.viewAccount = function(id){
        console.log('requestTransactions',id);
        $scope.socket.emit('requestTransactions',{"id":id});
    }
    $scope.socket.emit('requestTransactions',{});
}]);