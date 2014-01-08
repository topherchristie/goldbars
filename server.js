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

router.use('/bootstrap',express.static(path.resolve(__dirname, 'bower_components/bootstrap/dist')));
router.use('/jquery',express.static(path.resolve(__dirname, 'bower_components/jquery')));
router.use('/bower_components',express.static(path.resolve(__dirname, 'app/bower_components')));
router.use('/app',express.static(path.resolve(__dirname, 'app')));
//router.use(express.static(path.resolve(__dirname, 'app')));
var messages = [];
var sockets = [];

router.get("/", function(req,res){
    res.redirect('/app/index.html');
});

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
        
        var accounts = [{"__v":0,"_id":"50f88c2550de020200000002","_type":"checking","link":"http://www.simple.com","name":"Simple","priority":3,"confirmed":591.8000000000003,"balance":173.16000000000045},{"_id":"508ad4ebe4b0d0aee183c83d","_type":"checking","link":"http://www.chase.com","name":"Chase","priority":2,"confirmed":216.3999999999989,"balance":216.3999999999989},{"_id":"509001538389539539000001","__v":0,"_type":"credit","link":"http://eservice.bananarepublic.com","max":-6000,"name":"Banana","priority":1,"confirmed":-5930.619999999995,"balance":-5913.949999999995},{"__v":0,"_id":"50a50f4259b7930200000009","_type":"credit","link":"http://www.bestbuy.accountonline.com","max":-3400,"name":"Best Buy","priority":1,"confirmed":-3275.0799999999986,"balance":-3340.5799999999986},{"__v":0,"_id":"50b64e145af0090200000002","_type":"credit","link":"http://www.juniper.com","max":-13400,"name":"Frontier Cc","priority":1,"confirmed":-12732.44,"balance":-12882.44},{"__v":0,"_id":"5097f78d58ca8b5278000001","_type":"credit","link":"http://www.chase.com","max":-8000,"name":"Slate","priority":1,"confirmed":-7947.959999999996,"balance":-7849.959999999996},{"__v":0,"_id":"5122878da50ff7020000000d","_type":"retirement","link":"http://www.ohionational.com","name":"401k - Ohio National","priority":0,"confirmed":38561.07,"balance":38561.07},{"__v":0,"_id":"5092bc252fe5e6412b000001","_type":"checking","link":"http://www.bmoharris.com","name":"BMO Harris","priority":0,"confirmed":9.094947017729282e-13,"balance":9.094947017729282e-13},{"__v":0,"_id":"50c0b99bef16eae675000001","_type":"savings","link":"http://www.chase.com","name":"Chase Savings","priority":0,"confirmed":97.56999999999978,"balance":97.56999999999978},{"__v":0,"_id":"50c0b9b5ef16eae675000002","_type":"savings","link":"http://www.ingdirect.com","name":"ING","priority":0,"confirmed":60.540000000000006,"balance":75.54},{"__v":0,"_id":"5122858ea50ff70200000006","_type":"retirement","link":"http://www.tdameritrade.com","name":"Td IRA","priority":0,"confirmed":5445.72,"balance":5445.72},{"__v":0,"_id":"51228490a50ff70200000002","_type":"investment","link":"http://www.tdameritrade.com","name":"Td SEP","priority":0,"confirmed":37829.58,"balance":37829.58},{"__v":0,"_id":"50f04f281775e70200000014","_type":"checking","link":"http://www.tdameritrade.com","name":"Td0 Cash","priority":0,"confirmed":13.000000000000291,"balance":2161.0000000000005},{"__v":0,"_id":"51228653a50ff7020000000a","_type":"investment","link":"http://www.tdameritrade.com","name":"Td0 Investments","priority":0,"confirmed":5502,"balance":5502},{"__v":0,"_id":"509001b71b0a534c3b000001","_type":"mortgage","link":"http://www.wellsfargo.com","name":"Wells Fargo","priority":0,"confirmed":0,"balance":0}];
        broadcast('accounts', accounts);

    });
    
});
var dao = require('./dao');
dao.connect(function(error){
    console.log('connect returned(',error,')');
    if(error) throw error;
});

app.on('close',function(err){
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
