angular.module('barsOfGold')
.controller('TransactionListController',['$scope',function($scope){
    $scope.transactions = [];    
    $scope.socket.on('transactions',function(data){
        $scope.transactions = data.transactions;
        $scope.headerTitle = data.title;
        $scope.$apply();
    });
}])
.controller('TransactionController',['$scope',function($scope){
    $scope.init = function(t){
        $scope.transaction =t;
    };
    $scope.$watch('transaction.confirmed',function(newValue,oldValue){
        if(newValue != oldValue){
            var t = $scope.transaction;
           var message = 
            {
                "id":t._id,
                "newValue":t.confirmed,
                "accountId":t.account
            };
            console.log("toggleConfirm",t,message, newValue, oldValue);
            $scope.socket.emit('toggleConfirmTransaction',message);        
        }
    }) ;
}]);