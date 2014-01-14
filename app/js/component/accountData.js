define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');
  var withSelect = require('./with_select');
  var templates = require('js/templates.auto');
  var socketIo = require('socketIo/socket.io');
  /**
   * Module exports
   */

  return defineComponent(accountData ,withSelect);

  /**
   * Module function
   */

  function accountData() {
    this.defaultAttrs({
        selectedClass: 'selected',
        selectionChangedEvent: 'uiAccountSelectionChanged',

        //selectors
        itemSelector: '.account',
        selectedItemSelector: '.account.selected',
        
        
    });
    this.serveAccounts = function(ev, data ) {
        this.socket.emit('requestAccounts',{});
    };
    
    
    this.renderItems = function(items) {
        var context = {accounts: this.CreateViewItems(items)}
        //context.partials = {"part":"<td>name</td>"};
        return templates.accountList.render(
            context,{"part": templates.accountOne});
    };
    this.renderItem = function(items) {
        var context = this.CreateViewItem(items);
        
        
        return templates.accountOne.render(context );
    };
     this.CreateViewItem = function(each) {
      return {
                id:each._id.toString(),
                link:each.link,
                name:each.name,
                type:each._type,
                balance:each.balance.toFixed(2),
                confirmed:each.confirmed.toFixed(2),
                //remaining:each.remaining.toFixed(2)
                remaining: (each._type == "credit"? (each.max - each.balance)*-1 :  each.balance).toFixed(2)
            };
      }
    this.CreateViewItems = function(items) {
        var resultItems = [];

        items.forEach(function(each){
            resultItems.push({
                id:each._id.toString(),
                link:each.link,
                name:each.name,
                type:each._type,
                balance:each.balance.toFixed(2),
                confirmed:each.confirmed.toFixed(2),
                //remaining:each.remaining.toFixed(2)
                remaining: (each._type == "credit"? (each.max - each.balance)*-1 :  each.balance).toFixed(2)
            });
        }) ;
        return resultItems;
      }
    this.fetchAccountTransactions = function(ev, data) {
        console.log('fetching account Trasactions',data);
          this.trigger('uiAccountTransactionsRequested', {account: data.selectedIds[0]});
      }
      this.assembleItems = function() {
     //     $.ajax('/api/accounts',)
        var items = [];
        items.push({'name':'Simple',"_id":"asdfasd_asdfasdfa_simple"});
        items.push({'name':'Chase',"_id":"fffff_ddddd_chase"});
        return items;
      };
    this.after('initialize', function () {
        console.log('accountData init');
        this.on("uiAccountsRequested", this.serveAccounts);
        this.on('uiAccountSelectionChanged', this.fetchAccountTransactions);

        var component = this;
        var s = this.socket = io.connect();
        this.socket.on('accounts',function(accounts){
           component.trigger("dataAccountsServed", {markup: component.renderItems(accounts)});
        });
        this.socket.on('accountUpdated',function(account){
            console.log("dataAccountUpdated", {id:account._id,markup: component.renderItem(account)});
           component.trigger("dataAccountUpdated", {id:account._id,markup: component.renderItem(account)});
        });
        var callAddTransaction= function(){
             s.emit('addTransaction',{account:{_id:"50f88c2550de020200000002"}});
             console.log('addTransaction emitted');
        };
        setTimeout(callAddTransaction,10000)
    });     
  }

});
