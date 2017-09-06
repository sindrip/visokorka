const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const path = require('path');
const crawl = require('./crawl');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = process.env.PORT || 3000;

// PARSE REQ
app.use(bodyParser.json());

// LOGGING
app.use(morgan('dev'));

// PUBLIC SERVE
app.use(express.static('public'));

var messageHladinn = [];
var clients = [];

function textFromHtmlString( arbitraryHtmlString ) {
    const temp = document.createElement('div');
    temp.innerHTML = arbitraryHtmlString;
    return temp.innerText;
}

io.on('connection', function(socket){
  clients.push(socket.id);
  // console.log(clients);

  console.log('a user connected');
  socket.emit('updateChat', messageHladinn);

  crawl.crawler((data) => {
    io.emit('updateSkraning', data)
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    var index = clients.indexOf(socket.id);
    clients.splice(index,1);
  });

  socket.on('chat message', function(msg){
    messageHladinn.unshift(msg.substring(0, 100).replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    if (messageHladinn.length > 15) {
      messageHladinn.pop();
    }

    io.emit('updateChat', messageHladinn)
  });
});

app.get('/', (req,res) => {
  //res.redirect('index2.html');
});

http.listen(port, () => {
  console.log(`Started on port ${port}`);
})
