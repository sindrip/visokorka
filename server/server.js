const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');
const cheerio = require('cheerio');

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

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('updateChat', messageHladinn);

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    messageHladinn.unshift(msg.substring(0, 100));
    if (messageHladinn.length > 15) {
      messageHladinn.pop();
    }

    socket.emit('updateChat', messageHladinn)
  });
});

app.get('/', (req,res) => {
  //res.redirect('index2.html');
});

app.get('/scrape', (req, res) => {
    url = 'https://nord.is/';

    request(url, (error, response, html) => {
        if(error) {
          res.status(400).send();
        }
        var $ = cheerio.load(html);
        const x = $('h2 a').attr('href');
        if (x) {

          request(url+x, (error, response, html) => {
            if (error) {
              res.status(400).send();
            }
              $ = cheerio.load(html);
              var queue = [];

              const y = $('.registered-members li');

              var bidlisti = 0;
              var mSkrad = false;

              for(var i = 0; i < y.length; i++) {
                console.log(i)
                if (y[i].attribs.class) {
                  bidlisti++;
                }
                if (y[i].children[0].data.indexOf('Melkorka Mjöll') !== -1) {
                  mSkrad = true;
                  break;
                }
              }

              if (!mSkrad) {
                return res.send({message: 'Gleymdi að skrá sig :('})
              }
              if (bidlisti === 0) {
                return res.send({message: 'JÁ!', bidlisti});
              } else {
                return res.send({message: 'NEI', bidlisti})
              }

          });
        } else {
          return res.status(400).send();
        }
    });
});

http.listen(port, () => {
  console.log(`Started on port ${port}`);
})
