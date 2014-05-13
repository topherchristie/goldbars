angular.module('barsOfGold')
.controller('AccountController',['$scope',function($scope,$rootScope){
    //var socketIo = require('socketIo/socket.io');
   $scope.accounts = [];    
    

    $scope.socket.on('accounts',function(accounts){
        $scope.accounts = accounts;
        console.log("accounts",accounts);
        $scope.$apply();
    });

    $scope.socket.emit('requestAccounts',{});
    
    $scope.remaining = function(account){
        return account._type == "credit"? (account.max - account.balance)*-1 :  account.balance;
        
    };

}]);