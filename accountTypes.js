var AccountType = require('./accountType');

var accountTypes = exports;

var checking = accountTypes.checking = new AccountType(0,'checking',1);
var credit = accountTypes.credit = new AccountType(1,'credit',-1);
var mortgage = accountTypes.mortgage = new AccountType(2,'mortgage',1);
var investment = accountTypes.investment = new AccountType(3,'investment',1);
var retirement = accountTypes.retirement = new AccountType(4,'retirement',1);
var savings = accountTypes.savings = new AccountType(5,'savings',1);

var _list = [];
_list.push(checking);
_list.push(credit);
_list.push(mortgage);
_list.push(investment);
_list.push(retirement);
_list.push(savings);

accountTypes.list =  function (){
    return _list;
  };
accountTypes.find = function(typeName){
    for(var e in _list){
        if(_list[e].name == typeName) return _list[e];
    }
    return null;
};
  /*
// Export for Node.js
if (module.exports) {
    console.log('exported');
    module.exports = accountTypes;
}
*/