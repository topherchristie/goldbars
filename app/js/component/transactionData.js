define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');
    var templates = require('js/templates.auto');
    var socketIo = require('socketIo/socket.io');
    var Moment = require('moment');
  /**
   * Module exports
   */

  return defineComponent(TransactionData);

  /**
   * Module function
   */
  

  function TransactionData() {
    this.defaultAttrs({

    });
     this.renderItems = function(items) {
       var viewItems = this.CreateViewItems(items);
        return templates.transactionList.render({transactions: viewItems});
      };
       
      this.CreateViewItems = function(items) {
        var resultItems = [];
        items.forEach(function(each){
            resultItems.push({
                id:each._id.toString(),
                date:Moment(each.date).format("YYYY.MM.DD"),
                type:each._type,
                value:each.value.toFixed(2),
                note:each.note
            });
        }) ;
        return resultItems;
      }
        this.transactionReturned = function(component,transactions){
               
           component.trigger("dataTransactionsServed", {markup: this.renderItems(transactions)});
        };
    this.getAccountTransactions = function(ev,data){
         this.trigger('waitingForTransactions');
         this.socket.emit('requestTransactions',{"id":data.account});
    }
    this.getLatestTransactions = function(ev,data){
        this.trigger('waitingForTransactions');
         this.socket.emit('requestTransactions',{});
    }
    this.after('initialize', function () {
        console.log('transactionData init',this);
        this.on("uiLatestTransactionsRequested", this.getLatestTransactions);
        
        this.on("uiAccountTransactionsRequested", this.getAccountTransactions);
      //  this.on('click', this.getAccountTrasactions);
  //      var component = this;
        this.socket = io.connect();
        var component = this;
        this.socket.on('transactions',function(transactions){
            component.transactionReturned(component,transactions);
        });
    });
  }

});
