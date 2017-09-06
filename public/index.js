document.addEventListener("DOMContentLoaded", function(event) {
  function processForm(e) {
      if (e.preventDefault) e.preventDefault();

      var chatItem = document.createElement("li");
      chatItem.className += "bot__output bot__output--standard";
      chatItem.innerHTML = $(".chatbox")[0].value;
      $("#chatlist").prepend(chatItem);
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
