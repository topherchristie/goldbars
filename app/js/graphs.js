"use strict";
(function ( $ ) {

function createPoints(data,months) {
  var points = [];
  var runningBalance = 0;
  var maxDate = d3.max(data, function(d) { return d.date;});
	var minDate = d3.min(data, function(d) { return d.date;});
	var pointdate = (moment(minDate));
  while(pointdate <= maxDate){
      var point = {};
      point.date = (moment(pointdate)); 
      point.label= point.date.format("MMM-YY") ;
      point.startBalance = runningBalance;
        data.forEach(function(d){
            var diff = d.date.diff(pointdate); //diffMilliseconds(pointdate);
            if(diff === 0){
                runningBalance +=-1*d.value;
            }
        });
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
  if (datum.startBalance != 0) {
      percent = diff / datum.startBalance;
  }
  var endb = (eval(datum.endBalance)).toFixed(2);
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

  var parentWidth = $( this.selector).parent().width();
  
	//create canvas to full space
	canvas = d3.select( this.selector).append("svg:svg")
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
  var reds = []
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
  console.log("redIndex",redIndex,reds[redIndex])

  var getRed = function(index){
  	return reds[1];//redIndex];  //--0,
  }
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
  	console.log("blueIndex",blueIndex,blues[blueIndex])
  var getBlue = function(){
  		//return blues[7]; //--0,
  	return blues[blueIndex]; //--0,
  
  }
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
  yAxis = d3.svg.axis().scale(y).ticks(7).orient("left")
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

}( jQuery ));