$(function () {
  socket.on('show overlay', function () {
    showOverlay();
  });
  socket.on('hide overlay', function () {
    hideOverlay();
  });
  socket.on('update overlay', function (data) {
    updateOverlay(data.overlay);
    console.log('update overlay:', data);
  });
});
function hideOverlay() {
  $('#overlay').css('top', '-41px');
}
function showOverlay() {
  $('#overlay').css('top', '0px');
}
function updateOverlay(data) {
  for (const element in data) {
    $('#' + element).text(data[element]);
    // Change font size on long player names
    if (element == "p1Name" || element == "p2Name") {
      if (data[element].length > 16 ) {
        $('#' + element).css('font-size', (30 -  0.45 * (data[element].length)) + 'px');
      } else {
        $('#' + element).css('font-size', '');
      }
    }
}
}