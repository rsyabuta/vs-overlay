$(function () {
  socket.on('update players', function (data) {
    if (!data["default"]) {
      for (const element in data["players"]) {
        $('input#' + element).val(data["players"][element]);
      }
    }
  });
  $('#show').click(function () {
    socket.emit('show players', { room: room });
    $('#controlButtons>button').removeClass("selected");
    $('#show').addClass("selected");
  });
  $('#hide').click(function () {
    socket.emit('hide players', { room: room });
    $('#controlButtons>button').removeClass("selected");
    $('#hide').addClass("selected");
  });
  $('form').submit(function () {
    var data = {}
    data["room"] = room;
    data["default"] = false;
    data["players"] = {};
    $('form input[type=text]').each(function (i) {
      var input = $(this)
      data["players"][input.attr('id')] = input.val();
    });
    socket.emit('update players', data);
    return false;
  });
});