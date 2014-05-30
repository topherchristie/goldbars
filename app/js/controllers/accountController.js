/*global moment */
angular.module('barsOfGold')
.controller('AccountController',['$scope','$rootScope','$modal','$log','$routeParams','$location',function($scope,$rootScope,$modal,$log,$routeParams,$location){
    $scope.format = 'yyyy-MM-dd';
    var found = false;
    for(var i = 0;i< $scope.accounts.length;i++){
        if($scope.accounts[i]._id ==  $routeParams.accountId){
            $scope.account = $scope.accounts[i];
            found = true;
        }
    }
    if(!found){
        $location.url("/accounts");
    }
    $scope.transaction = {};
    $scope.transaction.transType='Expense';
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.transaction.date = moment().add('days', -1).format('YYYY-MM-DD');
    $scope.today = function(){
        $scope.transaction.date = moment().format('YYYY-MM-DD');
    };
    $scope.isYesterday = function(){
        return moment().add('days', -1).isSame($scope.transaction.date,'day'); 
    };
    $scope.isToday = function(){
        return moment().isSame($scope.transaction.date,'day'); 
    };
    $scope.yesterday = function(){
        $scope.transaction.date = moment().add('days', -1).format('YYYY-MM-DD');
    };
    $scope.backToList = function(){
        $location.url("/accounts");
    };
    $scope.remaining = function(){
        if($scope.account){
            var account = $scope.account;
            return account._type == "credit"? (account.max - account.balance)*-1 :  account.balance;
        }else{
            return 0;
        }
    };
}]);