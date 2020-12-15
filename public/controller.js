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

  $('form input').change(function () {
    $('#changedInfo').removeClass('applied').addClass('pending');
    $('#changedInfo').text('⚠️ Pending');
  });

  $('#swap').click(function () {
    swap('input#p1Score', 'input#p2Score');
    swap('input#p1Name', 'input#p2Name');
  });

  $('#viewer').text(url + 'viewer');

  $('.increment').click(function () {
    $(this).siblings('.score').val(function (index, currentvalue) {
      return (parseInt(currentvalue) || 0) + 1;
    });
    $(this).siblings('.score').change()
  });

  $('.decrement').click(function () {
    $(this).siblings('.score').val(function (index, currentvalue) {
      return (parseInt(currentvalue) || 0) - 1;
    });
    $(this).siblings('.score').change()
  });

  $('.zero').click(function () {
    $(this).siblings('.score').val(0);
    $(this).siblings('.score').change()
  });

  $('.urlSubmit').click(function () {
    var data = {}
    var {service, id} = parseBracketURL($('#urlInput').val());
    data['id'] = id;
    data['service'] = service
    data['room'] = room;
    socket.emit('get bracket', data);
    console.log('bracket request: ' + service);
  });

  socket.on('list', function (data) {
    $('tbody').empty();
    data['list'].forEach(element => {
      appendRow(element);
    });
  });

  $('#listFilter').on('keyup', function () {
    var value = $(this).val().toLowerCase();
    $('#list .listName').filter(function () {
      $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  $('tbody').on('click', '.listEntry', function () {
    $('#listPlayers').find('.listButtons').removeClass('listSelected');
    $(this).find('.listButtons').addClass('listSelected');
  });

  $('tbody').on('click', '.listFill', function () {
    var target = $(this).data('fill-target');
    $(target).val($(this).closest('.listEntry').find('.listName').text());
    $(target).change();
  });

  $('tbody').on('click', '.remove', function () {
    $(this).closest('.listEntry').remove();
  });

  $(".listName").keypress(function (e) {
    return e.which != 13;
  });

  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 450,
    gutter: 10
  });
  
  $('#list .add').click(function () {
    appendRow("New Player");
  });

});

function appendRow(name) {
  $('tbody').append(`
  <tr class="listEntry">
  <td class="listName" spellcheck="false" contenteditable="true">` + name + `</td>
  <td>
    <div class="listButtons">
      <button data-fill-target="input#p1Name" class="btn btn-primary btn-sm listFill"
        type="button">P1</button>
      <button data-fill-target="input#p2Name" class="btn btn-secondary btn-sm listFill"
        type="button">P2</button>
      <button class="btn btn-danger btn-sm remove" type="button">Remove</button>
    </div>
  </td>
</tr>
  `)
}

function swap(a, b) {
  var original = $(a).val();

  $(a).val($(b).val());
  $(b).val(original);

  $(a).change();
  $(b).change();
}

function parseBracketURL(url) {
  const bracket = new URL(url);
  const pathArray = bracket.pathname.split('/');
  var id = pathArray[pathArray.length - 1];
  const hostArray = bracket.hostname.split('.');
  const subdomain = hostArray[0];
  const domain = hostArray.slice(-2).join('.')
  
  var service = "invalid";
  if (domain == "smash.gg") {
    service = "smash.gg";
  } else if (domain == "challonge.com") {
    service = "challonge";
    if (subdomain != "challonge") {
      id = subdomain + '-' + id;
    }
  }
  return {service, id};
}