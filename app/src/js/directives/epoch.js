angular.module('barsOfGold')
.directive('epochCandle',['$parse',function($parse){
      return {
      restrict: "E",
      replace: true,
      transclude: false,
      compile: function (element, attrs) {
         var modelAccessor = $parse(attrs.ngModel);
        var html = '<div id="'+ attrs.id +'" class="epoch category20b col-lg-6" style="'+ (attrs.id || 'height:120px;width:780px;') + '"></div>';
         var newElem = $(html);
         element.replaceWith(newElem);
        

         return function (scope, element, attrs, controller) {
            console.log('epoch on',element);
            var chartInstance;
            scope.$watch(modelAccessor, function (val) {
                if(val)   
                    element.MonthProgress(val,false,120,12);
            });
         };

      }
   };
}])
.directive('epochBar',['$parse',function ($parse) {
   return {
      restrict: "E",
      replace: true,
      transclude: false,
      compile: function (element, attrs) {
         var modelAccessor = $parse(attrs.ngModel);
        var html = '<div id="+ attrs.id +" class="epoch category20b col-lg-6" style="height:120px;width:600px;"></div>';
         var newElem = $(html);
         element.replaceWith(newElem);
       // console.log('model',modelAccessor());

         return function (scope, element, attrs, controller) {
            var chartInstance;
            scope.$watch(modelAccessor, function (val) {
                console.log('model',val,chartInstance);
            //   element.datepicker("setDate", date);
                if(chartInstance){
                    chartInstance.update(val);
                }else{
                chartInstance =    element.epoch({
                    type: 'line',
                    data: val
                });
                }
            });

         };

      }
   };
}]);