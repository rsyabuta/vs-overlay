$(function () {
  socket.on('show players', function () {
    showPlayers();
  });
  socket.on('hide players', function () {
    hidePlayers();
  });
  socket.on('update players', function (data) {
    updatePlayers(data.players);
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
    // Shift score to center on multi-digit scores
    if (element == "p1Score") {
      $('#' + element).css('left', (525 - 6 * (data[element].length - 1)) + 'px');
    }
    if (element == "p2Score") {
      $('#' + element).css('right', (525 - 6 * (data[element].length - 1)) + 'px');
    }
}
}