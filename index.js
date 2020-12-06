const cryptoRandomString = require('crypto-random-string');

var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('public'))
app.use('/overlay/:id', express.static('public'))

app.get('/overlay/:id', (req, res) => {
  res.sendFile(__dirname + '/controller.html');
});

app.get('/overlay/:id/viewer', (req, res) => {
  res.sendFile(__dirname + '/viewer.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const defaultPlayers = {
  p1Name: "Player 1",
  p1Score: "0",
  p2Name: "Player 2",
  p2Score: "0",
}

var roomData = {}
var showPlayers = true

io.on('connection', (socket) => {
  // New Connections
  socket.on('join room', function(room) {
    socket.join(room);
    if (!(room in roomData)) {
      io.sockets.in(room).emit('update players', {room: room, players: defaultPlayers, default: true});
    }
    else {
      io.sockets.in(room).emit('update players', roomData[room]); 
    }
    if (showPlayers) {
      io.sockets.in(room).emit('show players');
    }
    else {
      io.sockets.in(room).emit('hide players');
    }
    console.log('Join room:', socket.id, room);
  });


  // Exisiting connections
  socket.on('show players', (data) => {
    io.sockets.in(data.room).emit('show players');
    showPlayers = true;
  });
  socket.on('hide players', (data) => {
    io.sockets.in(data.room).emit('hide players');
    showPlayers = false;
  });
  socket.on('update players', (data) => {
    io.sockets.in(data.room).emit('update players', data);
    roomData[data.room] = data;
    console.log('update players: room ', data.room);
  });

  socket.on('generate room', (data) => {
    var id = cryptoRandomString({length: 10, type: 'url-safe'});
    socket.emit('generate room', { id: id });
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

