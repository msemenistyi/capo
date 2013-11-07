var esprima = require('esprima');

module.exports.find = function(src){
	var result = esprima.parse(src);
	return result;
};