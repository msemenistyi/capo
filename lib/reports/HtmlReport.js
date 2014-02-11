module.exports = HtmlReport;

var fs = require('fs'),
	async = require('async'),
	linePicker = require('pick-lines-from-file');

function HtmlReport (data) {
	this.data = data;
	this.files = {};
	this.createFilesHash_(data);
	this.amendReportFile_();
}

HtmlReport.prototype.amendReportFile_ = function() {
	fs.readFile(__dirname + '/assets/report.html', function(err, data){
		if (err) throw err; 

		this.html = String(data).replace(/\'\{\{HERE_BE_DATA\}\}\'/, JSON.stringify(this.data));
		this.html = this.html.
			replace(/\'\{\{HERE_BE_FILE_RELATED_DATA\}\}\'/, JSON.stringify(this.files));

		async.map(Object.keys(this.files), function(item, callback){
				linePicker(item).lineNumbers(this.files[item]).linesAround(4).fetch(function(err, data){
					if (err) callback(err);
					callback(null, data);
				})}.bind(this), 

				this.createReportFile_.bind(this));
	}.bind(this));
};

HtmlReport.prototype.createReportFile_ = function(err, results) {
	var data = this.generateCodeBlocks_(results);
	this.html.replace(/\'\{\{HERE_BE_CODE\}\}\'/, JSON.stringify(data));
	fs.writeFile('capo/report.html', this.html, function(err){
		if (err) throw err;
	});
	fs.createReadStream(__dirname + '/assets/app.js').
		pipe(fs.createWriteStream('capo/app.js'));
	fs.createReadStream(__dirname + '/assets/style.css').
		pipe(fs.createWriteStream('capo/style.css'));
};

HtmlReport.prototype.generateCodeBlocks_ = function(data) {
	var lineBlocks = data.map(function(item, i){
		return {
			file: Object.keys(this.files)[i],
			lines: item
		};
	}.bind(this));

	return data;
};

HtmlReport.prototype.createFilesHash_ = function(data) {
	var fileNames = [];
	for (var i in data.subscriptions){
		for (var j = 0, l = data.subscriptions[i].length; j < l; j++){
			this.upsertFile_(data.subscriptions[i][j]);
		}
	}
	for (i in data.triggers){
		for (j = 0, l = data.triggers[i].length; j < l; j++){
			this.upsertFile_(data.triggers[i][j]);
		}
	}
};

HtmlReport.prototype.upsertFile_ = function(record) {
	var fileName = record.file;
	if (typeof this.files[fileName] !== 'undefined'){
		this.files[fileName].push(record.line);
		return;
	}
	this.files[fileName] = [];
	this.files[fileName].push(record.line);
};