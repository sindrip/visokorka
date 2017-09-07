document.addEventListener("DOMContentLoaded", function(event) {
  var socket = io();

  // Gets updated messages from chat
  socket.on('updateChat', function(messages) {
    $("#chatlist").html('');
    messages.forEach((msg) => {
      var chatItem = document.createElement("li");
      chatItem.className += "bot__output bot__output--standard";
      chatItem.innerHTML = msg;
      $("#chatlist").append(chatItem);
    });



  });

  // Send the message the server and update list
  function processForm(e) {
      if (e.preventDefault) e.preventDefault();
      addMessage();
      return false;
  }
  function addMessage() {
    socket.emit('chat message', $(".chatbox")[0].value.toString());

    $(".chatbox")[0].value = '';
  }
  // On submit or enter add the message
  var form = document.getElementById('chatform');
  if (form.attachEvent) {
      form.attachEvent("submit", processForm);
  } else {
      form.addEventListener("submit", processForm);
  }
  var input = document.getElementById('chatInput');
  input.addEventListener("keypress",  function (e) {
    if(e.keyCode === 13) {
      addMessage();
    }
  });
  socket.on('updateSkraning', function(data) {
    updateData(data);
  })
  // Updates html with new data
  function updateData(data) {
    // Updates text
    console.log(data.bidlisti);
    $(".mainTextP")[0].innerHTML = data.message;
    if(data.message.indexOf('J') !== -1) {
     console.log('test3')
     $(".noMessage").hide();
     $(".mbyMessage").hide();
     $(".yesMessage").show();
   }
    else if(!data.bidlisti) {
      console.log('test1')
      $(".noMessage").hide();
      $(".mbyMessage").show();
      $(".yesMessage").hide();
    }
    else if(data.message === 'NEI') {
      console.log('test2');
      $(".queueNumber")[0].innerHTML = data.bidlisti;
      $(".noMessage").show();
      $(".mbyMessage").hide();
      $(".yesMessage").hide();
    }

  }
});
