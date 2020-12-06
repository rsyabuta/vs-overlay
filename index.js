var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

app.use(express.static('public'))

app.get('/controller', (req, res) => {
  res.sendFile(__dirname + '/controller.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/viewer.html');
});

const defaultPlayers = {
  p1Name: "Player 1",
  p1Score: "0",
  p2Name: "Player 2",
  p2Score: "0",
  default: true
}

var players = {}
var showPlayers = true

io.on('connection', (socket) => {
  if (isEmptyObject(players)) {
    io.emit('update players', defaultPlayers);
  }
  else {
    io.emit('update players', players); 
  }
  if (showPlayers) {
    io.emit('show players');
  }
  else {
    io.emit('hide players');
  }
  socket.on('show players', (msg) => {
    io.emit('show players');
    showPlayers = true;
  });
  socket.on('hide players', (msg) => {
    io.emit('hide players');
    showPlayers = false;
  });
  socket.on('update players', (data) => {
    io.emit('update players', data);
    players = data;
    console.log('update players:', data);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

