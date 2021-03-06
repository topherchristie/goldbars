//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var TransactionDao = require('./dao/transactionDao');
var AccountDao = require('./dao/accountDao');
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

io.set('browser client minification', true);  // send minified client
io.set('browser client etag', true);          // apply etag caching logic based on version number
router.use('/app/lib',express.static(path.resolve(__dirname, 'app/bower_components')));
router.use('/lib',express.static(path.resolve(__dirname, 'node_modules')));
router.use('/app',express.static(path.resolve(__dirname, 'app')));
var messages = [];
var sockets = [];
var accountTypes = require('./accountTypes');
function isOfDataType(dataType, account){
    if(dataType === "debit"){
        return account.type.equal(accountTypes.credit);
    }else if(dataType === "interest"){
        return account.type.equal(accountTypes.credit);
    }else{
        return true;  
    }
}
router.get("/", function(req,res){
    res.redirect('/app/index.html');
});
var dao = require('./dao');

//Socket io stuff, hook this up in a few more steps
io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('addAccount', data);
    });
    sockets.push(socket);
    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
    
    });
      
    socket.on('requestAccounts', function () {
        
        var accountDao = new AccountDao();
        
        accountDao.all(function(err,data){
            if(err){
                broadcast('error',err);
            }else{
                broadcast('accounts', data);    
            }
        })
    });
    socket.on('toggleConfirmTransaction',function(request){
        var transDao = new TransactionDao(); 
        transDao.setConfirmed(request.id,request.newValue?request.newValue:false,function(err){
            transDao.updateAccount(request.accountId,function(err,data){
                if(err){
                    broadcast('error',err);
                }else{
                    data._id = request.accountId;
                    broadcast('accountUpdated', data);  
                }
            });
        });
    });
    socket.on('addTransaction',function(data){
        var accountDao = new AccountDao();
        accountDao.findById(data.account._id,function(err,data){
            
            var account = data;
            //account._id = data.account._id ;//'50c0b9b5ef16eae675000002';
            //account.link = "http://www.simple.com";
            account.name += "2";
        //    account._type = "checking";
            account.balance = 5555;
            account.confirmed = 5575;
      //  account.max  = 0;
        
        broadcast('accountUpdated', account);  
        
        });
    });
    socket.on('requestCandleData',function(data){
        var accountDao = new AccountDao();
        var transDao = new TransactionDao();
        accountDao.all(function(err,accounts){
            var accountIds = [];
            accounts.forEach(function(a){
                if(isOfDataType('debit',a)){
                    accountIds[accountIds.length] = a._id.toString();
                }
            });
            transDao.reduceForAccount(accountIds,function(err,result){
                if(err){
                    broadcast('error',err);
                }else{
                    broadcast('candleDataServed', result);    
                }
            });
       });
    });
    socket.on('requestTransactions', function (data) {
        var transDao = new TransactionDao();
        var name = data.name;
         if(data && data.id){
            transDao.findLast100ByAccount(data.id,function(err,data){
                if(err){
                    broadcast('error',err);
                }else{
                    broadcast('transactions', {'transactions':data,'title':'Last 100 transactions for ' + name});    
                }
            });
        }else{
            transDao.findLast100(function(err,data){
                if(err){
                    broadcast('error',err);
                }else{
                    broadcast('transactions', {'transactions':data,'title':'Last 100 transactions for all accounts'});    
                }
            });
        }
    });
});

dao.connect(function(error){
    if(error) throw error;
});

router.on('close',function(err){
    dao.disconnect(function(err){console.log('error closing:' + err);});
});
function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}
// end socket io demo code

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log('webserver on server',process.env.PORT);
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
