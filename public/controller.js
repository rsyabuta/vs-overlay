$(function () {
  var socket = io();
  socket.on('update players', function (data) {
    if (!data["default"]) {
      for (const element in data) {
        $('input#' + element).val(data[element]);
      }
    }
  });
  $('#show').click(function () {
    socket.emit('show players');
    $('#controlButtons>button').removeClass("selected");
    $('#show').addClass("selected");
    return false;
  });
  $('#hide').click(function () {
    socket.emit('hide players');
    $('#controlButtons>button').removeClass("selected");
    $('#hide').addClass("selected");
    return false;
  });
  $('form').submit(function () {
    var players = {}
    $('form input[type=text]').each(function (i) {
      var input = $(this)
      players[input.attr('id')] = input.val();
    });
    players["default"] = false;
    socket.emit('update players', players);
    return false;
  });
});