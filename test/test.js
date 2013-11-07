var capo = require('../');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/fixtures/initial.js');

var result = capo.find(src);
console.log(result);