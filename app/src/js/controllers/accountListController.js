angular.module('barsOfGold')
.controller('AccountListController',['$scope','$rootScope','$modal','$log',function($scope,$rootScope,$modal,$log){
//   var ModalInstanceCtrl  = function($scope,$modalInstance){
// // Please note that $modalInstance represents a modal window (instance) dependency.
// // It is not the same as the $modal service used above.
// //   $scope.items = items;
// //   $scope.selected = {
// //     item: $scope.items[0]
// //   };

//   $scope.ok = function () {
//     $modalInstance.close('$scope.selected.item');
//   };

//   $scope.cancel = function () {
//     $modalInstance.dismiss('cancel');
//   };
//};
    //var socketIo = require('socketIo/socket.io');
  
    
    $scope.remaining = function(account){
        return account._type == "credit"? (account.max - account.balance)*-1 :  account.balance;
    };
   
    
    
    // $scope.open = function (size) {
    //     var modalInstance = $modal.open({
    //       templateUrl: 'transaction_content.html',
    //       controller: ModalInstanceCtrl,
    //       size: size,
    //       resolve: {
    //         items: function () {
    //           return $scope.items;
    //         }
    //       }
    //     });
    
    //     modalInstance.result.then(function (selectedItem) {
    //       $scope.selected = selectedItem;
    //     }, function () {
    //       $log.info('Modal dismissed at: ' + new Date());
    //     });
    //};
}]);