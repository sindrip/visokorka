const fs = require('fs');

const data = require('./../../visoListi.json');

console.log(data.nafnList.length);

var x = [];
// data.nafnList.forEach((nafn) => {
  data.visoList.forEach((viso) => {
    viso.users.forEach((person) => {
        if (!x[person.nafn]) {
          x[person.nafn] = 1;
        } else {
          x[person.nafn]++;
        }
      });
    });
  // });
// });

console.log(x)
