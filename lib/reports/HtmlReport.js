module.exports = HtmlReport;

var fs = require('fs');

function HtmlReport (data) {
	this.data = data;
	this.createReportFile_();
}

HtmlReport.prototype.createReportFile_ = function() {
	fs.readFile(__dirname + '/assets/report.html', function(err, data){
		if (err) throw err; 
		var dataToBeWritten = String(data).replace(/\'HERE_BE_DATA\'/, JSON.stringify(this.data));
		fs.writeFile('capo/report.html', dataToBeWritten, function(err){
			if (err) throw err;
		});
		fs.createReadStream(__dirname + '/assets/app.js').pipe(fs.createWriteStream('capo/app.js'));
		fs.createReadStream(__dirname + '/assets/style.css').pipe(fs.createWriteStream('capo/style.css'));
	}.bind(this));
};