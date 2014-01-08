define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');
  var withSelect = require('./with_select');
  var templates = require('js/templates');
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
        return templates.accountList.render({accounts: items});
      };
      
    this.fetchAccountTransactions = function(ev, data) {
          this.trigger('uiAccountTransactionsRequested', {folder: data.selectedIds[0]});
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
        this.socket = io.connect();
        this.socket.on('accounts',function(accounts){
           component.trigger("dataAccountsServed", {markup: component.renderItems(accounts)});
        });
    });     
  }

});
