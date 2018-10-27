var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var users = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  
  socket.on('user connected', function(msg) {
    if (!users[socket.id]) {
      socket.broadcast.emit('user connected', msg);
    } else {

      var text = users[socket.id].nick + ' now is ' + msg;
  
      socket.broadcast.emit('change nick', text);
    }
    users[socket.id] = {nick: msg};
    
  });
  
  socket.on('disconnect', function(msg){
    // This 'if' prevents crash errors when you reload the page in localhost
    if (users[socket.id]) {   
      msg = users[socket.id].nick;
      socket.broadcast.emit('user disconnected', msg);
      delete users[socket.id];
    }
  });

  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('typing', function(msg){
    msg = users[socket.id].nick;
    socket.broadcast.emit('typing', msg);
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
