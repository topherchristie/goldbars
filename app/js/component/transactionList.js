define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */

  return defineComponent(transactionList);

  /**
   * Module function
   */

  function transactionList() {
    this.defaultAttrs({

    });

    this.renderItems = function(ev, data) {
      //  console.log('render trans list component', data.markup);
   //     console.log('html was',this.$node.html());
        this.$node.html(data.markup);
        //new items, so no selections
        //this.trigger('uiMailItemSelectionChanged', {selectedIds: []});
    };
    
    
    this.after('initialize', function () {
        console.log('transactionList init');
        this.on(document, 'dataTransactionsServed', this.renderItems);
        this.trigger('uiLatestTransactionsRequested');
    });
  }

});
