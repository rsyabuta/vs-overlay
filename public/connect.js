const url = new URL(window.location.href);
var pathArray = window.location.pathname.split('/');
var room = pathArray[2];
if (room == null) {
  room = "default"
}
var socket = io();
socket.on('connect', function () {
  socket.emit('join room', room);
});