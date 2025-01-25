$(function () {
  socket.on('generate room', function (data) {
    joinOverlay(data['id']);
  });
  $('#generate').click(function () {
    socket.emit('generate room');
  });
  $('form').submit(function (e) {
    joinOverlay($('#overlayID').val())
    return false;
  });
});

function joinOverlay(id) {
  window.location.href = "/overlay/" + id;
}