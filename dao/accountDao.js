var mongoose = require('mongoose');
var accountTypes = require('../accountTypes');

var AccountSchema = new mongoose.Schema({
    name : String,
    _type : String,
    link : String,
    max : Number,
    priority : Number,
    balance : {type:Number,default:0},
    confirmed : {type:Number,default:0},
    
});
AccountSchema.index({"_type":1});
AccountSchema.virtual('type').get(function(){
    return accountTypes.find(this._type);
});
AccountSchema.virtual('isInvestment').get(function(){
    return (this._type == "retirement" || this._type == "investment");
});
AccountSchema.virtual('remaining').get(function(){
    if(this._type == "credit"  ){
        return (this.max - this.balance)*-1;
    }else{
        return this.balance;        
    }
});


function AccountDao(){
  return init(
        (this instanceof AccountDao) ? this : new AccountDao(),
        arguments
	);
}
function init(accountDao, args) {
    var db = require('../dao').db();
    var Account = accountDao.Account = db.model('Account',AccountSchema);
   
    accountDao.all = function(callback){
        var query =Account.find({});
        query.sort("-priority");
        query.sort("name");
        query.exec(callback);
    }

    accountDao.remove = function(id,callback){
        var cb;
        if(!callback){
            cb = function(err){if(err) throw err;}
        }else{
            cb = callback;
        }
        Account.remove({"_id":id},cb);
    };  
    accountDao.add = function(name,link,type,priority,callback){
      var a = new Account({"name":name,"link":link,"_type":type.name,"priority":priority});
      a.save(callback);
    };
    accountDao.update = function(id,name,link,type,priority,callback){
      Account.update({_id:id},{"name":name,"link":link,"_type":type.name,"priority":priority},callback);
    };
     accountDao.updateBalance = function(id,balance,confirmed,callback){
      Account.update({_id:id},{"balance":balance,"confirmed":confirmed},callback);
    };
    accountDao.findById = function(id,callback){
      Account.findById(id,callback);
    };
  return accountDao;
}


module.exports = AccountDao;

