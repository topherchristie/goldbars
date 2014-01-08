define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');
    var templates = require('js/templates')
  /**
   * Module exports
   */

  return defineComponent(AccountToTransaction);

  /**
   * Module function
   */
  

  function AccountToTransaction() {
    this.defaultAttrs({

    });
     this.renderItems = function(items) {
        return templates.transactionList.render({transactions: items});
      };
      

      this.assembleItems = function() {
        var items = [];
        items.push({'name':'Simple',"_id":"asdfasd_asdfasdfa_simple"});
        items.push({'name':'Chase',"_id":"fffff_ddddd_chase"});
        return items;
      };
    
    
    this.getAccountTransactions = function(ev,data){
        console.log('getAccountTransactions',data);
         var items = [];
        items.push({'date':'2014-01-01',"value":101, "_id":"asdfasd_asdfasdfa_3"});
        items.push({'date':'2013-12-25',"value":34,"_id":"fffff_ddddd_4"});
        this.trigger("dataTransactionsServed", {markup: this.renderItems(items)})
        
    }
    this.getLatestTransactions = function(ev,data){
        console.log('getLatestTransactions',data);
        var items = [];
        items.push({'date':'2014-01-01',"value":1000, "_id":"asdfasd_asdfasdfa_1"});
        items.push({'date':'2014-01-03',"value":77,"_id":"fffff_ddddd_2"});
        this.trigger("dataTransactionsServed", {markup: this.renderItems(items)})
    }
    this.after('initialize', function () {
        console.log('transactionData init');
        this.on("uiLatestTransactionsRequested", this.getLatestTransactions);
        
        this.on("uiAccountTransactionsRequested", this.getAccountTransactions);
      //  this.on('click', this.getAccountTrasactions);
    });
  }

});
