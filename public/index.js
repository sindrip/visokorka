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
    $(".mainTextP")[0].innerHTML = data.message;
    $(".supportText")[0].innerHTML = data.extra;
  }
});
