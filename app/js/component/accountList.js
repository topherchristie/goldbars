define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */

  var defineComponent = require('flight/lib/component');

  /**
   * Module exports
   */

  return defineComponent(accountList);

  /**
   * Module function
   */

  function accountList() {
    this.defaultAttrs({

    });
    this.renderItems = function(ev, data) {
        console.log('render account list component', data.markup);
        console.log('html was',this.$node.html());
        this.$node.html(data.markup);
        //new items, so no selections
        //this.trigger('uiMailItemSelectionChanged', {selectedIds: []});
    };
    
    this.after('initialize', function () {
        this.on(document, 'dataAccountsServed', this.renderItems);
     //   this.on(".account",'click',function(ev,data){ console.log('clicked',ev,data)})
        this.trigger('uiAccountsRequested');
    });
  }

});
