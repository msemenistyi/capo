module.exports = HtmlReport;

var fs = require('fs'),
	async = require('async'),
	Report = require('./Report'),
	linePicker = require('pick-lines-from-file');

function HtmlReport (data, callback) {
	Report.call(this, data, callback);
	this.createFilesHash_(data);
	this.amendReportFile_();
}

HtmlReport.prototype = new Report();

HtmlReport.prototype.amendReportFile_ = function() {
	fs.readFile(__dirname + '/assets/report.html', function(err, data){
		if (err){ this.capoCallback(err); return;}

		this.html = String(data).replace(/\'\{\{HERE_BE_DATA\}\}\'/, JSON.stringify(this.data));
		this.html = this.html.
			replace(/\'\{\{HERE_BE_FILE_RELATED_DATA\}\}\'/, JSON.stringify(this.files));

		async.map(Object.keys(this.files), function(item, callback){
			linePicker(item).lineNumbers(this.files[item]).linesAround(4).fetch(function(err, data){
				if (err) {callback(err); return;}
				callback(null, data);
			})}.bind(this), 

			this.createReportFile_.bind(this));
	}.bind(this));
};

HtmlReport.prototype.createReportFile_ = function(err, results) {
	results = results.map(function(item){
		return (item instanceof Array) ? item : [item];
	});
	var cleanResults = this.removeRedundantTabs_(results);
	var data = this.generateCodeBlocks_(cleanResults);
	this.html = this.html.replace(/\{\{HERE_BE_CODE\}\}/, data);

	fs.mkdir('capo', function(err){
		if (err){ 
			if (!err.code === 'EEXIST'){
				this.capoCallback(err); 
				return;
			}
		}
		fs.writeFile('capo/report.html', this.html, function(fileErr){
			if (fileErr){ this.capoCallback(fileErr); return;}
			else {this.capoCallback();}
		}.bind(this));
		fs.createReadStream(__dirname + '/assets/app.js').
			pipe(fs.createWriteStream('capo/app.js'));
		fs.createReadStream(__dirname + '/assets/style.css').
			pipe(fs.createWriteStream('capo/style.css'));
	}.bind(this));
};

HtmlReport.prototype.removeRedundantTabs_ = function(lineBlocks) {
	var currentLines,
		minTabsCount, currentTabsCount,
		j, k, lineNum, linesCount;
	//loop on files
	for (var file = 0, fileLength = lineBlocks.length; file < fileLength; file++){
		//loop on events in file
		for (eventNum = 0, eventsLength = lineBlocks[file].length; eventNum < eventsLength; eventNum++){
			currentLines = lineBlocks[file][eventNum].lines;
			//loop on lines to determine min tabs count
			minTabsCount = undefined;
			for (lineNum = 0, linesCount = currentLines.length; lineNum < linesCount; lineNum++){
				currentTabsCount = this.getCountOfLeadingTabs_(currentLines[lineNum]);
				if (typeof minTabsCount === 'undefined' || currentTabsCount < minTabsCount){
					minTabsCount = currentTabsCount;
				}
			}
			//loop on lines to remove min tabs count
			for (lineNum = 0; lineNum < linesCount; lineNum++){
				currentLines[lineNum] = currentLines[lineNum].substr(minTabsCount);
				if (currentLines[lineNum] === ''){
					currentLines[lineNum] = '&nbsp;';
				}
			}

		}
	};
	return lineBlocks;
};

HtmlReport.prototype.getCountOfLeadingTabs_ = function(str) {
	var count = 0;
	// if line is just linefeed, skip it
	if (str === '')	return 100;

	for (var i = 0, l = str.length; i < l; i++){
		if (str[i] === '\t') count++;
		else break;
	}

	// if line consists of tabs only
	if (i === l) return 100;
	return count;
};

HtmlReport.prototype.generateCodeBlocks_ = function(data) {
	var lineBlocks = data.map(function(item, i){
		var fileName = Object.keys(this.files)[i];
		return {
			file: fileName,
			content: item, 
			types: this.eventTypes[fileName]
		};
	}.bind(this));
	var blocks = [], 
		options,
		file, j, k,
		block;
	for (var i = 0, l = lineBlocks.length; i < l; i++){
		for (j = 0, k = lineBlocks[i].content.length; j < k; j++){
			block = lineBlocks[i].content[j];
			options = {
				content: block.lines.join('\n'), 
				file: lineBlocks[i].file,
				type: lineBlocks[i].types[j].type,
				eventName: lineBlocks[i].types[j].eventName,
				lineNumber: block.lineNumber,
				startAt: block.startAt
			};
			blocks.push(this.generateCodeBlock_(options));
		}
	}
	return blocks.join('');
};

HtmlReport.prototype.generateCodeBlock_ = function(options) {
	return '<div class="code-block ' + options.type +'-cb ' + 
			options.eventName.replace(/:/g, '-n-') + '">' +
		'<div class="cb-filename">' + options.file + 
			':<span class="cb-line-number">' + (options.lineNumber + 1) + '</span>' +
		'</div>' + 
		'<pre class="prettyprint linenums:' + (options.startAt + 1) + '">' +
		options.content +
		'</pre></div>';
};
