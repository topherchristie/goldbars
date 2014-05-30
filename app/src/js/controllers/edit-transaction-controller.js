angular.module('barsOfGold')
.controller('EditTransactionController',['$scope','$modal','$log','ModalInstanceCtrl',function($scope,$modal,$log,ModalInstanceCtrl){
  $scope.open = function (size) {
    var modalInstance = $modal.open({
      templateUrl: 'transaction_content.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
}]);

