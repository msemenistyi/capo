var fs = require('fs');

module.exports.find = function(filePath){
	fs.readFile(__dirname + filePath, function(err, data){
		if (err) throw err;
		console.log(data);
	});
};