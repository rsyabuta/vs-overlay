$(function () {
  var socket = io();
  socket.on('show players', function (data) {
    showPlayers();
    console.log('show players');
  });
  socket.on('hide players', function (data) {
    hidePlayers();
    console.log('hide players');
  });
  socket.on('update players', function (data) {
    updatePlayers(data);
    console.log('update players:', data);
  });
});
function hidePlayers() {
  $('#players').css('top', '-41px');
}
function showPlayers() {
  $('#players').css('top', '0px');
}
function updatePlayers(data) {
  for (const element in data) {
    $('#' + element).text(data[element]);
  }
}