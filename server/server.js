const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const path = require('path');

var app = express();
const port = process.env.PORT || 3000;

// PARSE REQ
app.use(bodyParser.json());

// LOGGING
app.use(morgan('dev'));

// PUBLIC SERVE
app.use(express.static('public'));

app.get('/', (req,res) => {
  res.redirect('/public/index.html');
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
})
