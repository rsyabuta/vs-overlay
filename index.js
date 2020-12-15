// External modules
require('dotenv').config()

var express = require('express');
const { ENETRESET } = require('constants');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

// Internal modules
require('./socketio.js')(io);

// Static assests
app.use(express.static('public'))
app.use('/overlay/:id', express.static('public'))

// Routes
app.get('/overlay/:id', (req, res) => {
  res.sendFile(__dirname + '/controller.html');
});

app.get('/overlay/:id/viewer', (req, res) => {
  res.sendFile(__dirname + '/viewer.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Server start
http.listen(3000, () => {
  console.log('listening on *:3000');
});
