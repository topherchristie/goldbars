define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

   var Accounts = require('component/accountList');
   var AccountData = require('component/accountData');
   var Transactions = require('component/transactionList');
   var TransactionData = require('component/transactionData');
   var DataApi = require('component/DataApi');

  
    
  /**
   * Module exports
   */

  return initialize;

  /**
   * Module function
   */

  function initialize() {
    // myComponent.attachTo(document);
    AccountData.attachTo(document);
    TransactionData.attachTo(document);
    Accounts.attachTo("#accounts");
    Transactions.attachTo("#transactions");
    DataApi.attachTo(document);
    
    console.log('default page initialized',Accounts);
  }

});
