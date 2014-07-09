angular.module('barsOfGold',['ui.bootstrap','ngRoute'])
.config(['$routeProvider',function($routeProvider){
    $routeProvider
        .when('/accounts', {
            templateUrl: '/app/src/templates/account-list.html'
        })
        .when('/account/:accountId', {
            templateUrl: '/app/src/templates/account.html'
        })
        .when('/transaction/:transactionId', {
            templateUrl: '/app/src/templates/transaction2.html'
        })
        .otherwise({'redirectTo':'/accounts'});
}]);;/*global moment */
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
}]);;angular.module('barsOfGold')
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
}]);;angular.module('barsOfGold')
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

;angular.module('barsOfGold')
.controller('GraphCtrl',['$scope',function ($scope) {
	console.log('moneyApp,GraphCtrl');
  
}]);
;angular.module('barsOfGold')
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
}]);;angular.module('barsOfGold')
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
}]);;window.accounts = [
{
    "_id": {
        "$oid": "508ad4ebe4b0d0aee183c83d"
    },
    "_type": "checking",
    "balance": 1440.4399999999987,
    "confirmed": 1440.4399999999987,
    "link": "http://www.chase.com",
    "name": "Chase",
    "priority": 2
},
{
    "__v": 0,
    "_id": {
        "$oid": "509001538389539539000001"
    },
    "_type": "credit",
    "balance": -4157.089999999998,
    "confirmed": -4179.819999999997,
    "link": "http://eservice.bananarepublic.com",
    "max": -4300,
    "name": "Banana",
    "priority": 1
},
{
    "__v": 0,
    "_id": {
        "$oid": "5097f78d58ca8b5278000001"
    },
    "_type": "credit",
    "balance": -7646.6299999999965,
    "confirmed": -7646.6299999999965,
    "link": "http://www.chase.com",
    "max": -8000,
    "name": "Slate",
    "priority": 1
},
{
    "__v": 0,
    "_id": {
        "$oid": "50a50f4259b7930200000009"
    },
    "_type": "credit",
    "balance": -3280.4899999999984,
    "confirmed": -3280.4899999999984,
    "link": "http://www.bestbuy.accountonline.com",
    "max": -3400,
    "name": "Best Buy",
    "priority": 1
},
{
    "__v": 0,
    "_id": {
        "$oid": "50b64e145af0090200000002"
    },
    "_type": "credit",
    "balance": -12815.95,
    "confirmed": -12954.550000000001,
    "link": "www.juniper.com",
    "max": -13400,
    "name": "Frontier Cc",
    "priority": 1
},
{
    "__v": 0,
    "_id": {
        "$oid": "50f88c2550de020200000002"
    },
    "_type": "checking",
    "balance": 713.5100000000009,
    "confirmed": 1033.120000000001,
    "link": "http://www.simple.com",
    "name": "Simple",
    "priority": 3
},
{
    "__v": 0,
    "_id": {
        "$oid": "5122878da50ff7020000000d"
    },
    "_type": "retirement",
    "balance": 37721.64,
    "confirmed": 37721.64,
    "link": "http://www.ohionational.com",
    "name": "401k - Ohio National",
    "priority": 0
}];;angular.module('barsOfGold')
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
}]);;(function ( $ ) {
"use strict";
function createPoints(data,months) {
  var points = [];
  var runningBalance = 0;
  var maxDate = d3.max(data, function(d) { return d.date;});
	var minDate = d3.min(data, function(d) { return d.date;});
	var pointdate = (moment(minDate));
	 var sumFunction = function(d){
        var diff = d.date.diff(pointdate); //diffMilliseconds(pointdate);
        if(diff === 0){
            runningBalance +=-1*d.value;
        }
  };
  while(pointdate <= maxDate){
      var point = {};
      point.date = (moment(pointdate)); 
      point.label= point.date.format("MMM-YY") ;
      point.startBalance = runningBalance;
       data.forEach(sumFunction);
       point.endBalance = runningBalance;
      points.push(point);
      pointdate.add('months',1);
  }
	points.splice(0,1);
	console.log(points.length, months);
	if(months && months > 0&& points.length > months){
		
		points.splice(0,points.length -months);
	}
  return points;
}
String.prototype.format = function () {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function (match, number) {
	    return typeof args[number] != 'undefined'? args[number] : match;
	});
};
function setY(y,datum,index) {
  if (y(datum.startBalance) < y(datum.endBalance)) {
    return y(datum.startBalance) ;//+ topMargin;
  } else {
    return y(datum.endBalance) ;//+ topMargin;
  }
}
function  setHeight(y,datum, index) {
  if (y(datum.endBalance) > y(datum.startBalance)) {
    return y(datum.endBalance) - y(datum.startBalance);
  } else{
    return y(datum.startBalance) - y(datum.endBalance);
  }
}
function buildTitle(datum) {
  var diff = datum.startBalance - datum.endBalance;
  var percent = 0;
  if (datum.startBalance !== 0) {
      percent = diff / datum.startBalance;
  }
  var endb = (parseFloat(datum.endBalance)).toFixed(2);
  var lbl = "{0}, {1} to {2}, {3} ${4} {5} %".format(datum.label, datum.startBalance.toFixed(2), endb, (diff > 0 ? "up" : "down"), diff.toFixed(2), (percent * 100).toFixed(2));
  return lbl;/* datum.label + " from " + ((datum.startBalance).toFixed(2)) + " to2 " + endb
     + " " + (diff > 0 ? "up" : "down") + " $" + diff.toFixed(2) + " " + (percent*100).toFixed(2) + "%"; */
 }
$.fn.MonthProgress = function(baseData,showXAxis,height,rollingMonths){
	var canvas,x,y,data,maxDebit,minDebit,xAxis,yAxis,w,barwidth,h,
		leftMargin=65,
		rightMargin=10,
		topMargin=10,
		bottomMargin=5
		;
	if(showXAxis){
		bottomMargin = 60;
	}
	if(!d3){
		throw 'd3 is required for this plugin';
	}
	//convert boring date objects to moment objects
	baseData.forEach(function(d){
    d.date = moment(d._id);
   // d.date.clearTime();
  });
  // convert data to monthly totals with start, end and label
  console.log("rollingMonths",baseData,showXAxis,height,rollingMonths);
  data= createPoints(baseData,rollingMonths);
  //get the max and min for x and y
	
	maxDebit = d3.max(data, function(d) { return d.startBalance > d.endBalance?d.startBalance : d.endBalance;});
  minDebit = d3.min(data, function(d) { return d.startBalance < d.endBalance?d.startBalance : d.endBalance;});

    var $el = $(this).get(0);
  var parentWidth = $( $el).parent().width();
  
	//create canvas to full space
	canvas = d3.select($el).append("svg:svg")
				.attr("width", parentWidth)// '100%') //w + 40)
				.attr("height",  height) // h + (topMargin + margin))
       // .attr("transform", "translate(" + margin + "," + topMargin + ")")
       .classed("graph",true);

  //set height,width and scales
  w = $(canvas[0]).width() - (leftMargin + rightMargin);
  h = $(canvas[0]).height() - (bottomMargin+ topMargin);
	x = d3.scale.linear().domain([0, data.length]).range([leftMargin,w+leftMargin]);
  y = d3.scale.linear().domain([minDebit, maxDebit]).range([topMargin,h+topMargin]);

  // calculate bar width, width divided by data points
	barwidth = Math.ceil(w/(data.length));
  var reds = [];
  reds.push("#BD33A4");
  reds.push ("#AA98A9");
  reds.push("#CC0000"); //boston
//  reds.push("#D70A53");//debianXX
//  reds.push("#FF2400");//debian
  reds.push("#65000B");//debian
  reds.push("#A40000");//debian
  reds.push("#E30022");//debian
  reds.push("#A32638");//debian
  reds.push("#9B111E");//debian
  reds.push("#66424D");//debian
  reds.push("#800020");//debian
  reds.push("#CE2029");
//  reds.push("#E30B5D");
  reds.push("#CC3333");
  reds.push("#C80815");
  reds.push('#50404D');
  reds.push('#808080');
  
  //reds[14] =reds[15] = "Red";//debian

  var redIndex = Math.floor(reds.length * Math.random());
  console.log("redIndex",redIndex,reds[redIndex]);

  var getRed = function(index){
  	return reds[1];//redIndex];  //--0,
  };
  var blues = [];
  // blues.push('#23297A');
  // blues.push('#4169E1');
  // blues.push('#4166F5');
  // blues.push('#003153');
  // blues.push('#779ECB');
  blues.push('#007AA5');
  // blues.push('#002395');
  // blues.push('#273BE2');
  // blues.push('#006994');
  // blues.push('#1DACD6');
  // blues.push('#2A52BE');
  // blues.push('#1560BD');
  blues.push('#4682B4');
  // blues.push('#1C1CF0');
  // blues.push('#318CE7');
  // blues.push('#5B92E5');
  // blues.push('#002147');
  // blues.push('#062A78');
  // blues.push('#73C2FB');
  // blues.push('#191970');
  // blues.push('#0F4D92');
  // blues.push('#6F00FF');
  blues.push('#666699');
  blues.push('#50404D');
blues.push('#708090');

  


  	var blueIndex = Math.floor(blues.length * Math.random());
  	console.log("blueIndex",blueIndex,blues[blueIndex]);
  var getBlue = function(){
  		//return blues[7]; //--0,
  	return blues[blueIndex]; //--0,
  
  };
  // create candlestick rectangles
  canvas.selectAll("rect").data(data).enter().append("svg:rect")
       .attr("x", function (datum, index) { return x(index); })
       .attr("y", function (datum, index) { return setY(y,datum, index); })
      .attr("height", function (datum, index) { return setHeight(y,datum, index); })
      .attr("width", barwidth)
      .attr("title", function (datum) { 
      	return buildTitle(datum); 
      })
      .attr("data-toggle","tooltip")
      .attr("data-trigger","hover focus click")
      .attr("fill", function (datum,index) { 	
      	return datum.startBalance > datum.endBalance ? getBlue() : getRed(index);
      })
  	  // .on("touchstart",function(){   $(this).tooltip('show'); setTimeout(function() {
     //        $(this).tooltip('hide');
     //  }, 4000);})
   ;

  // create and set xaxis
  xAxis = d3.svg.axis().scale(x).ticks(data.length).tickSize(-h);
  canvas.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + (0) +"," + (h+topMargin) + ")")
    .call(xAxis);
  if(showXAxis){
	canvas.selectAll(".x text")
    .attr('style',"writing-mode: tb")
		.attr("transform","translate(" + (barwidth/2) + ",-10)")
    .attr("title", function (datum,i ) { 
        if (data.length > i)
            return  buildTitle(data[i]);
        else
            return "";
    })
    .attr("data-toggle","tooltip")
  	.attr("data-trigger","hover focus click")     
   // .on("touchstart",function(){   $(this).tooltip('show');})
    .text(function (d, i) {
        if (data.length > i)
            return data[i].label;
        else
            return "";
    })   
    ;
  }else{
  	canvas.selectAll(".x text").text("");
  }
  // set and create y axis
  yAxis = d3.svg.axis().scale(y).ticks(7).orient("left");
	canvas.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate( " + x(0) + "," + 0 + ")")
      .call(yAxis);

  // set tooltips to be in body, they won't show if included in the svg which is default
	$("rect").tooltip({
    'container': 'body',
    'placement':'auto top'
  	});
  $(".x text").tooltip({
    'container': 'body'}); 		
};

}( jQuery ));;;