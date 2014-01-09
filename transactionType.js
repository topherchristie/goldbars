function TransactionType(){
  return init(
        (this instanceof TransactionType) ? this : new TransactionType(),
		arguments
	);
}
function init(transactionType, args) {
    var len = args.length;
    transactionType.id = args[0];
    transactionType.name = args[1];
    transactionType.transformer = args[2];
    transactionType.GetValue = function(amount){
        return amount * this.transformer;
    }
    transactionType.equal = function(t){
      return t === this;
    }
    return transactionType;
}

module.exports = TransactionType;