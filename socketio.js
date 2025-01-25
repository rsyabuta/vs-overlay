const cryptoRandomString = require('crypto-random-string');
const { response } = require('express');

var startgg = require('./startgg.js');
var challonge = require('./challonge.js');

const defaultOverlay = {
  p1Name: "Player A",
  p1Score: "0",
  p2Name: "Player B",
  p2Score: "0",
  title: "Casuals"
}

var roomData = {}
var showOverlay = true

module.exports = function (io) {
  io.on('connection', (socket) => {
    // New Connections
    socket.on('join room', function (room) {
      socket.join(room);
      if (!(room in roomData)) {
        io.sockets.in(room).emit('update overlay', { room: room, overlay: defaultOverlay, default: true });
      }
      else {
        io.sockets.in(room).emit('update overlay', roomData[room]);
      }
      if (showOverlay) {
        io.sockets.in(room).emit('show overlay');
      }
      else {
        io.sockets.in(room).emit('hide overlay');
      }
      console.log('join room:', socket.id, room);
    });


    // Exisiting connections
    socket.on('show overlay', (data) => {
      io.sockets.in(data.room).emit('show overlay');
      showOverlay = true;
    });
    socket.on('hide overlay', (data) => {
      io.sockets.in(data.room).emit('hide overlay');
      showOverlay = false;
    });
    socket.on('update overlay', (data) => {
      io.sockets.in(data.room).emit('update overlay', data);
      roomData[data.room] = data;
      console.log('update overlay: room', data.room);
    });

    socket.on('get bracket', async (data) => {
      if (data.service == "start.gg") {
        var players = await startgg.getPlayersFromPhaseGroup(data.id);
      } else if (data.service == "challonge") {
        var players = await challonge.getParticipants(data.id);
      } else {
        console.log('invalid service: ' + data.service)
        return false;
      }
      var response = { list: players };
      io.sockets.in(data.room).emit('list', response);
      console.log('list bracket: room ', data.room);
    });

    socket.on('generate room', (data) => {
      var id = cryptoRandomString({ length: 10, type: 'url-safe' });
      socket.emit('generate room', { id: id });
    });
  });
}