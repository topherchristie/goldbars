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
router.use('/bootstrap',express.static(path.resolve(__dirname, 'bower_components/bootstrap/dist')));
router.use('/jquery',express.static(path.resolve(__dirname, 'bower_components/jquery')));
router.use('/moment',express.static(path.resolve(__dirname, 'node_modules/moment/min')));
router.use('/bower_components',express.static(path.resolve(__dirname, 'app/bower_components')));
router.use('/app',express.static(path.resolve(__dirname, 'app')));
//router.use(express.static(path.resolve(__dirname, 'app')));
var messages = [];
var sockets = [];

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
          var AccountDao = require('./dao/accountDao');
        accountDao = new AccountDao();
        
        accountDao.all(function(err,data){
            if(err){
                broadcast('error',err);
            }else{
                broadcast('accounts', data);    
            }
        })
    });
    socket.on('requestTransactions', function (data) {
      
        var TransactionDao = require('./dao/transactionDao');
         transDao = new TransactionDao();

        
       
         if(data && data.id){
            transDao.findLast100ByAccount(data.id,function(err,data){
                if(err){
                    broadcast('error',err);
                }else{
                    broadcast('transactions', data);    
                }
            });
        }else{
            transDao.findLast100(function(err,data){
                //broadcast('transactions',[{'date':'2013-12-25',"value":34,"_id":"fffff_ddddd_4"}]);
                
                if(err){
                    broadcast('error',err);
                }else{
                    broadcast('transactions', data);    
                }
            });
        }
        //broadcast('transactions',[{'date':'2013-12-25',"value":34,"_id":"fffff_ddddd_4"}])
    });
});

dao.connect(function(error){
    console.log('connect returned(',error,')');
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
