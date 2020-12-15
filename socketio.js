const cryptoRandomString = require('crypto-random-string');
const { response } = require('express');

var smashgg = require('./smashgg.js');
var challonge = require('./challonge.js');

const defaultPlayers = {
  p1Name: "Player 1",
  p1Score: "0",
  p2Name: "Player 2",
  p2Score: "0",
}

var roomData = {}
var showPlayers = true

module.exports = function (io) {
  io.on('connection', (socket) => {
    // New Connections
    socket.on('join room', function (room) {
      socket.join(room);
      if (!(room in roomData)) {
        io.sockets.in(room).emit('update players', { room: room, players: defaultPlayers, default: true });
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

    socket.on('get bracket', async (data) => {
      if (data.service == "smash.gg") {
        var players = await smashgg.getPlayersFromPhaseGroup(data.id);
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