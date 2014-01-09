'use strict';

//todo: for production try compiling templates on server, or on build
define(function (require) {
    var hogan = require('hogan/hogan-2.0.0.amd');
 //   var accountList =hogan.compile('{{#accounts}}<li><a href="#" class="account" id="{{_id}}">{{name}}</a></li>{{/accounts}}');
 var accountList = hogan.compile(
     '{{#accounts}}<div class="card row"><div class="col-sm-4 title"><a href="#" class="account" id="{{_id}}">{{name}}</a><br />'
            + '<span class="author">{{_type}}</span></div>'
        + '<div class="col-sm-2"><span class="pages">{{url}}</span></div>'
        + '<div class="col-sm-2">{{balance}}</div>'
        + '<div class="col-sm-2">{{confirmed}}</div>'
        + '<div class="col-sm-2">{{remaining}}</div>'
        + '</div>{{/accounts}}'
     );
    //''var transactionList =hogan.compile('{{#transactions}}<li><a href="#" class="trans" id="{{_id}}">{{date}}{{value}}</a></li>{{/transactions}}');
    
    var transactionList =hogan.compile('{{#transactions}}<tr><td><a class="btn btn-xs btn-primary"  href="#/trans/{{_id.toString()}}"><i class="glyphicon glyphicon-edit"></i></a></td>'
            +'<td>{{date}}</td><td>{{_type}}</td><td class="isNumber"d>{{value}}</td><td>' 
            +'<input type="checkbox" class="toggleConfirm" name="confirm{{_id.toString()}}" id="confirm{{_id.toString()}}" value="true" />'
            +'</td><td>{{note}}</td></tr>{{/transactions}}');
    

    return {
        accountList: accountList,
        transactionList: transactionList
    };
});