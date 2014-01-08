   
   define(function (require) {

  'use strict';

  /**
   * Module dependencies
   */
  var defineComponent = require('flight/lib/component');
  var socketIo = require('socketIo/socket.io');
   
  /**
   * Module exports
   */
  return defineComponent(dataApi);

  /**
   * Module function
   */
  function dataApi() {
    this.defaultAttrs({

    });
    this.renderItems = function(ev, data) {
        console.log('render account list component', data.markup);
        console.log('html was',this.$node.html());
        this.$node.html(data.markup);
    };
    this.after('initialize', function () {
        //console.log('dataApi',socketIo);
        //this.on('requestAcc')
      
    });
  }

});
