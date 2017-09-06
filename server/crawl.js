const request = require('request');

var test = () => {
  request
    .get('https://www.nord.is/')
    .on('response', (response) => {
      console.log(response.body);
    });
}

module.exports = {test};
