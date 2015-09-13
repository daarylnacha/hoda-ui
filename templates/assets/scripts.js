$(document).ready(function() {

  var panelOptions = {
    fullSize: true,
  }
  $('#pc01').hodaPanel(panelOptions, function() {
    $('#pc02').hodaPanel(panelOptions);
  });

  $('#selectone').hodaDropdown({autoclose: true, onhover: false});

  $('#spinnerone').hodaSpinner({suffix: 'percent', prefix: 'Spinner Value : '});

  //buttons
  $('#button-one').hodaButton({color:'darkblue'});

  //button Group setups
  var group_options = {
    //onSelected handler
    onSelected: function(btn) {
      $(btn).html('Selected');
    },
    //lose selected handler
    onLostSelect: function(btn) {
      $(btn).html('Not Selected');
    }
  }
  $('#button-group-one').hodaButton(group_options);

  $('#button-wider').hodaButton({width: 300});
  $('#button-taller').hodaButton({height: 100, color:'blue'});

  var btnclick_options = {
    onClick: function(btn) {
      alert($(btn).html());
    }
  }
  $('#button-onclick').hodaButton(btnclick_options);

  $('#button-dropdown').hodaButton({type: 'button-dropdown'});
});
