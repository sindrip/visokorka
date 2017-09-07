const request = require('request');
const cheerio = require('cheerio');

var crawler = (callback) => {
    url = 'https://nord.is/';

    request(url, (error, response, html) => {
        if(error) {
          return callback(null);
        }
        var $ = cheerio.load(html);
        const x = $('h2 a').attr('href');
        if (x) {

          request(url+x, (error, response, html) => {
            if (error) {
              return callback(null);
            }
              $ = cheerio.load(html);
              var queue = [];

              const y = $('.registered-members li');

              var bidlisti = 0;
              var mSkrad = false;

              for(var i = 0; i < y.length; i++) {
                if (y[i].attribs.class) {
                  bidlisti++;
                }
                if (y[i].children[0].data.indexOf('Melkorka Mjöll') !== -1) {
                  mSkrad = true;
                  break;
                }
              }
              
              if (!mSkrad) {
                return callback({message: 'Nei', extra: 'Gleymdi að skrá sig :('});
              }
              if (bidlisti === 0) {
                return callback({message: 'JÁ!', extra: 'Áfram Melkorka !!!'});
              } else {
                return callback({message: 'NEI', extra: 'Hún er númer ' + bidlisti + ' á biðlista :('});
              }

          });
        } else {
          return callback(null);
        }
    });
};

module.exports = {crawler};
