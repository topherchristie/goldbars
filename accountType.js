function AccountType(){
  return init(
    	(this instanceof AccountType) ? this : new AccountType(),
		arguments
	);
}
function init(accountType, args) {
    var len = args.length;
    accountType.id = args[0];
    accountType.name = args[1];
    accountType.transformer = args[2];
    accountType.equal = function(t){
      return t === this;
    }
    return accountType;
}

module.exports = AccountType;