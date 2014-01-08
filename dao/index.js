
var dashboardDatabase = exports.dashboardDatabase = require("./dashboardDatabase");

exports.connect = function() {
    console.log('db connect called');
    dashboardDatabase.connect();
}

exports.disconnect = function(callback){
    dashboardDatabase.disconnect(cb);
}


//exports.accountDao  = require("./accountDao");
exports.db = function(){
   return dashboardDatabase.db();
}
//exports.bookDao = require("./bookDao");
//exports.bookDao = require("./bookDao");
//exports.transactionDao = require("./transactionDao");