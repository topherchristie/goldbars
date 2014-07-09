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
    $scope.socket.emit('requestCandleData',{});
    
    $scope.socket.on('candleDataServed',function(result){
       console.log('candleDataServed',result);
    //   $scope.barchart = result;
        // var bar = [{label:'debit',values:[]}];
        // var previous=0;
        // for(var i=0;i<result.length;i++){
        //     previous += result[i].value;
        //     bar[0].values.push({x:i /*result[i]._id*/,y:previous /*result[i].value*/});
            
        // }
        //   console.log('bar',bar);
        // $scope.barchart = bar;
        $scope.candlechart = result;
       $scope.$apply();
    });
    $scope.candlechart = null;
    $scope.barchart = [
    //   // First bar series
    //   {
    //     label: 'Series 1',
    //     values: [
    //       { x: 'A', y: 55 },
    //     ]
    //   },
    
    //   // Second series
    //   {
    //     label: 'Series 2',
    //     values: [
    //       { x: 'A', y: 20 },
    //       { x: 'B', y: 55 },
    //       { x: 'C', y: 8 }
    //     ]
    //   }
    
     ];
}]);