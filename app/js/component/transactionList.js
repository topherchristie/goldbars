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
    this.clearTransactions = function(ev,data){
        this.$node.css('background-color','red').css('color','red');
    }
    this.renderItems = function(ev, data) {
      //  console.log('render trans list component', data.markup);
   //     console.log('html was',this.$node.html());
        this.$node.html(data.markup);
        
        $(document).ready(function(){
            var pH = //$("#trantable").parent().parent().parent().height();
            $('#accounts').parent().parent().height();
            console.log("ph",pH);
             $("#trantable").css('max-height',(pH+0));
        }); 
        //new items, so no selections
        //this.trigger('uiMailItemSelectionChanged', {selectedIds: []});
    };
    
    
    this.after('initialize', function () {
        console.log('transactionList init');
        this.on(document, 'dataTransactionsServed', this.renderItems);
        this.on('waitingForTransactions',this.clearTransactions)
        this.trigger('uiLatestTransactionsRequested');
    });
  }

});
