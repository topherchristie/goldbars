

//exports.accountDao  = require("./accountDao");
exports.db = function(){
   return dashboardDatabase.db();
}

var mongoose = require('mongoose');
var config = require("../config");
var dbUrl = config.DashboardConnectionString; 
var _db;
exports.db = function(){
    if(!_db){
   //   throw 
    console.log("Dashboard Database not setup");
    }
  return _db;
};
exports.connect = function() {
    if(!_db){
        _db = mongoose.createConnection(dbUrl);
        _db.once('open', function () { });
    }
};
exports.disconnect = function(callback){
 //   console.log('closing connection to dashboard db');
    if(_db)
      _db.close(function(){
        _db = null;
        if(callback)
            callback();
        });
};