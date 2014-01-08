'use strict';

//todo: for production try compiling templates on server, or on build
define(function (require) {
    var hogan = require('hogan/hogan-2.0.0.amd');
    var accountList =hogan.compile('{{#accounts}}<li><a href="#" class="account" id="{{_id}}">{{name}}</a></li>{{/accounts}}');
    var transactionList =hogan.compile('{{#transactions}}<li><a href="#" class="trans" id="{{_id}}">{{date}}{{value}}</a></li>{{/transactions}}');
    return {
        accountList: accountList,
        transactionList: transactionList
    };
});