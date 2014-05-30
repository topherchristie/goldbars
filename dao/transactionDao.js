var mongoose = require('mongoose'),
 Schema = mongoose.Schema, xdate = require('xdate');
var transactionManager = require("../transactionManager");
var _isDisabled;
//var db = 

var TransactionSchema = new mongoose.Schema({
    account : { type: Schema.Types.ObjectId, ref: 'Account' },
    date :{type:Date,required:true,forms: {new: {},edit: {}}},
    amount:{type:Number,required:true,forms: {new: {},edit: {}}},
    note:{type:String,required:false,forms: {new: {},edit: {}}},
    value:{type:Number},
    month: String,
    _type : String,
    confirmed : {type:Boolean,default:false},
});

TransactionSchema.index({"account":1});

var ad = require('./accountDao');



TransactionSchema.pre('save',function(next){
    if(this.type == null)
        throw "type cannot be null for a transaction";
    this.value = this.type.GetValue(this.amount);
    this.month = (new xdate(this.date)).toString("yyyy-MM");
    next();
});


TransactionSchema.post('save',function(){
    if(!_isDisabled){
    var accountId = this.account;
    //accountDao.d
    // console.log("post:save",accountId);
    var td = new TransactionDao();
    td.SumForAccount(accountId,function(err,result){
        if(err) throw err; 
        console.log(accountId,result);
         var accountDao = new ad();
        accountDao.updateBalance(accountId,result.balance,result.confirmed,function(err,result){
            if(err) throw err;
            //console.log("balance saved",result);
            });
    });
    }
   // next();
});

TransactionSchema.virtual('type').get(function(){
    return transactionManager.findType(this._type);
});


/*
TransactionSchema.virtual('account').get(function(){
    return accountDao.findById(this.accountId);
});
*/



function TransactionDao(){
  return init(
        (this instanceof TransactionDao) ? this : new TransactionDao(),
        arguments
	);
}
function init(transactionDao, args) {
    var len = args.length;
    if(len > 0){
      transactionDao._db = args[0];
    }else{
      transactionDao._db = require('../dao').db();    
    }
    var Transaction = transactionDao.Transaction = transactionDao._db.model('Transaction',TransactionSchema);
    transactionDao.close = function(){
        transactionDao._db.close();
    }
    
    transactionDao.isDisabled = function(){
        var value;
        if(arguments.length == 1){
            value = arguments[0];
        }
       if(value){
           _isDisabled   = value;
       }else{
         return _isDisabled ;   
       }
    };
    transactionDao.remove = function(id,callback){
        var cb;
        if(!callback){
            cb = function(err){if(err) throw err;}
        }else{
            cb = callback;
        }
       Transaction.remove({"_id":id},cb);
    };  
    transactionDao.add = function(account,type,date,amount,note,confirmed,callback){
      var a = new Transaction({"account":account,"date":date,"note":note,"amount":amount,"_type":type.name,"confirmed":confirmed});
      a.save(callback);
    };
    transactionDao.update = function(id,account,type,date,amount,note,callback){
//      Transaction.update({_id:id},{"account":account,"date":date,"note":note,"amount":amount,"_type":type.name},callback);
	Transaction.findById(id,function(err,result){
		if(err) throw err;
		if(result){
			result.account = account;
			result.amount = amount;
			result._type = type.name;
			result.date = date;
			result.note = note;
			result.save(callback);
		}else{
			throw "result is null";
		}
	});
    };
    
    transactionDao.findById = function(id,callback){
      Transaction.findById(id).populate("account").exec(callback);
    };
    transactionDao.findMonth = function(month,callback){
        Transaction.find({"month":month}).populate("account").sort("-date").exec(callback);
    }
    
    transactionDao.findUnconfirmed = function(callback){
        Transaction.find({"confirmed":false}).populate("account").sort("date").exec(callback);
    }
    transactionDao.findLast100 = function(callback){
        Transaction.find({}).limit(100).sort("-date").exec(callback);
    }
    transactionDao.findLast100ByAccount = function(account,callback){
        Transaction.find({"account":account}).limit(100).sort("-date").exec(callback);
    }
    transactionDao.findAll = function(callback){
        Transaction.find().exec(callback);
    }
     transactionDao.findAccountAll = function(account,callback){
        Transaction.find({"account":account}).sort("-date").exec(callback);
    }
    var SumForAccount = transactionDao.SumForAccount = function(account,callback){
        Transaction.find({"account":account},function(err,trans){
            var sum = 0;
            var confirmed = 0;
            trans.forEach(function(e,i){
                sum += e.value?e.value:e.amount;
                if(e.confirmed)
                  confirmed += e.value?e.value:e.amount;
            });
            callback(null,{"balance":sum,"confirmed":confirmed});
        });
    };
    transactionDao.updateAccount = function(accountId,callback){
        SumForAccount(accountId,function(err,result){
            if(err) throw err; 
            console.log(accountId,result);
            var accountDao = new ad();
            accountDao.updateBalance(accountId,result.balance,result.confirmed,function(err,doc){
                callback(err,result);
            });
        });
    };

    transactionDao.setConfirmed = function(transactionId,newValue,callback){
        Transaction.update({_id:transactionId }, { confirmed: newValue }, callback);
    };
    transactionDao.removeAllForAccount = function(accountId,callback){
        Transaction.remove({"account":accountId},
            function(err){
                if(err) 
                    throw err;
                if(callback) 
                    callback();
            }
        );
    };  
    transactionDao.reduceInterestForAccount = function(accounts,callback){
         console.log("interesting!!!!!","reduceInterestForAccount",transactionManager.isInterest('blah blah'));
       var o = {map: function(){
                if(this._type === "interest")
                  {
                        if(this.month > '2012-10')
                            emit("" + this.month +"-15",this.value);
                        else
                            emit("2012-10-15",this.value);
                    }
            },
            reduce: function(key,vals){
                var total = 0;
                vals.forEach(function(v){
                    total += v;
                });
                return total;
            },
            query:{account:{$in :accounts}}
        };
        Transaction.mapReduce(o,callback);
    };
    transactionDao.reduceForAccount = function(accounts,callback){
       var o = {map: function(){
                if(this.month > '2012-10')
                    emit("" + this.month +"-15",this.value);
                else
                    emit("2012-10-15",this.value);
            },
            reduce: function(key,vals){
                var total = 0;
                vals.forEach(function(v){
                    total += v;
                });
                return total;
            },
            query:{account:{$in :accounts}}
        };
    
        Transaction.mapReduce(o,callback);
    };
  /*  transactionDao.reduce = function(callback){
       var o = {map: function(){
            emit("" + this.month +"-15",{value :this.value});
            },
            reduce: function(key,vals){
                var total = 0;
                vals.forEach(function(v){
                    total += v['value'];
                });
                return total;
            },
            finalize: function(obj){
                obj.date = new xdate(obj.month + "-15");
            }
        };
    
        Transaction.mapReduce(o,callback);
    };*/
    return transactionDao;
}
/*
var map = function(){
    emit(this.
};
*/

module.exports = TransactionDao;
  
