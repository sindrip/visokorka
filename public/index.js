document.addEventListener("DOMContentLoaded", function(event) {
  var socket = io();

  socket.on('updateChat', function(messages) {
    $("#chatlist").html('');
    messages.forEach((msg) => {
      var chatItem = document.createElement("li");
      chatItem.className += "bot__output bot__output--standard";
      chatItem.innerHTML = msg;
      $("#chatlist").append(chatItem);
    });



  });

  function processForm(e) {
      if (e.preventDefault) e.preventDefault();

      console.log($(".chatbox")[0].value)
      socket.emit('chat message', $(".chatbox")[0].value);

      $(".chatbox")[0].value = '';

      return false;
  }

  var form = document.getElementById('chatform');
  if (form.attachEvent) {
      form.attachEvent("submit", processForm);
  } else {
      form.addEventListener("submit", processForm);
  }
});
