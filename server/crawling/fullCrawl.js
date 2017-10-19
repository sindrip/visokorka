const request = require('request-promise-native');
const cheerio = require('cheerio');
const fs = require('fs');

const express = require('express');

var getNewsIdList = (url, idArray) => {
  return new Promise((resolve, reject) => {
    request(url).then((html) => {
      var $ = cheerio.load(html);
      var newsList = $('h2 a')
      newsList.each(function(i,elem) {
        var tmp = $(this).attr('href');
        idArray.push(tmp.substring(tmp.lastIndexOf('/') + 1));
      });
      console.log(url)
      resolve();
    }).catch(() => reject());
  })
}

var getVisoInfo = (newsUrl, uniqueNafn, visoList) => {
  return new Promise((resolve, reject) => {
    request(newsUrl).then((html) => {
      var $ = cheerio.load(html);
      const visoName = $('h2.news-header').first().text();
      var visoDate = $('span.news-info').text();
      visoDate = visoDate.substring(10, visoDate.indexOf('-')-1)
      var dateObject = dateStringToDate(visoDate)

      var viso = {
        visoName,
        dateString: dateObject.dateString,
        date: dateObject.date,
        users: []
      }

      const y = $('.registered-members li');

      y.each(function(i, elem) {
        var inQueue = $(this).attr('class') ? true : false;
        var nafn = $(this).text();
        if (nafn.indexOf('-') !== -1) {
          nafn = nafn.substring(0, nafn.lastIndexOf('-'));
        }
        uniqueNafn.add(nafn.trim());
        viso.users.push({
          nafn,
          inQueue,
        });
      });
      visoList.push(viso);
      resolve();
    });
  }).catch(() => reject());
}

var dateStringToDate = (dateString) => {
  var day = dateString.substring(0, dateString.indexOf('.'));
  var month = dateString.substring(dateString.indexOf('.')+2, dateString.lastIndexOf('.'));
  var year = dateString.substring(dateString.lastIndexOf('.')+2);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maí', 'Jún', 'Júl', 'Ágú', 'Sept', 'Okt', 'Nóv', 'Des'];

  var date = (months.indexOf(month)+1) + '/' + day + '/' + year;
  return {
    dateString: date,
    date: new Date(date),
  };
}

var crawler = (callback) => {
    var baseUrl = 'https://nord.is/';

    // news/:id listi
    var idList = [];
    var uniqueNafn = new Set();
    var visoList = [];

    // Sækjum blaðsíðna fjölda á heimasíðu nörd
    request(baseUrl).then((html) => {
      var $ = cheerio.load(html);
      var pagesList = [];
      var pages = $('.paginator li a')
      pages.each(function(i, elem) {
        pagesList.push($(this).attr('href'));
      })
      var lastPageString = pagesList[pagesList.length-2];
      var lastPage = parseInt(lastPageString.substring(lastPageString.lastIndexOf('/') + 1))

      return Promise.resolve(lastPage);
    }).then((lastPage) => {
      // Breytum blaðsíðufjölda í fylkið [1,2, ... ,lastPage]
      function range(i){return i?range(i-1).concat(i):[]}
      pageRange = range(lastPage);

      // Populate idList fyrir hverja blaðsíðu
      return Promise.all(pageRange.map((pageNum) => {
        return getNewsIdList(baseUrl + pageNum, idList)
      }));
    }).then(() => {
      // Sækjum gögn um hverja einstaka vísó
      return Promise.all(idList.map((visoId) => {
        return getVisoInfo(baseUrl + 'news/' + visoId, uniqueNafn, visoList)
      }));
    }).then(() => {
      var ret = {
        nafnList: Array.from(uniqueNafn),
        visoList,
      }
      console.log(ret.uniqueNafn)
      fs.writeFile('visoListi.json', JSON.stringify(ret), () => {
        console.log('fin')
      });
    }).catch((e) => console.log('error', e));
}

crawler();
