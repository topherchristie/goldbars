angular.module('barsOfGold')
.controller('MainController',['$scope','$rootScope','$location',function($scope,$rootScope,$location){
    $scope.name='Hello world';
    $rootScope.socket = io.connect();
    
    $scope.accounts = [];    
    $scope.socket.on('accounts',function(accounts){
        $scope.accounts = accounts;
        console.log("accounts",accounts);
        $scope.$apply();
    });

    $scope.socket.emit('requestAccounts',{});
    
    $scope.socket.on('accountUpdated',function(account){
       console.log('accountUpdated',account);
       for(var i=0;i<$scope.accounts.length;i++){
           if($scope.accounts[i]._id == account._id){
                $scope.accounts[i].balance = account.balance;
                $scope.accounts[i].confirmed = account.confirmed;
                $scope.$apply();
                break;
           }
       }
    });
    
    $scope.viewAccount = function(account){
        console.log('requestTransactions',account.name);
        $location.url("/account/" + account._id);
        $scope.socket.emit('requestTransactions',{"id":account._id,'name':account.name});
    };
    $scope.socket.emit('requestTransactions',{});
}]);