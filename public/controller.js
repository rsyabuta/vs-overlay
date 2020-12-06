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
    $('#changedInfo').removeClass('pending').addClass('applied');
    $('#changedInfo').text('✅ Applied');
    return false;
  });
  $('input').change(function () {
    $('#changedInfo').removeClass('applied').addClass('pending');
    $('#changedInfo').text('⭐ Pending');
  });
  $('#swap').click(function () {
    swap();
  });
  $('#viewer').text(url  + 'viewer');
});

function swap() {
  var p1Name = $('input#p1Name').val();
  var p1Score = $('input#p1Score').val();

  $('input#p1Name').val($('input#p2Name').val());
  $('input#p1Score').val($('input#p2Score').val());
  $('input#p2Name').val(p1Name);
  $('input#p2Score').val(p1Score);

  $('input#p1Score').change();
}