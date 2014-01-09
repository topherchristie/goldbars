var TransactionType = require("./transactionType.js");
var manager = exports;

manager.create = function(accountId,date,note,amount){
    var trans = {};
    trans.accountId = accountId;
    trans.note = note;
    trans.amount = parseFloat(amount);
    return trans;
}

var bill = manager.bill = new TransactionType(0,'bill',-1);
var deposit = manager.deposit = new TransactionType(1,'deposit',1);
var expense = manager.expense = new TransactionType(2,'expense',-1);
var payment = manager.payment = new TransactionType(3,'payment',1);
var interest =  manager.interest = new TransactionType(4,'interest',1);
var fee =  manager.fee = new TransactionType(5,'fee',-1);


var _list = [];
_list.push(bill);
_list.push(deposit);
_list.push(expense);
_list.push(payment);
_list.push(interest);
_list.push(fee);

manager.list =  function (){
    return _list;
  };

manager.isInterest = function(typeName){
    console.log("interesting!!!!!",typeName, interest.name);
    return true; //typeName === interest.name;
};
manager.findType = function(typeName){
    for(var e in _list){
        if(_list[e].name == typeName) return _list[e];
    }
    return null;
};
  