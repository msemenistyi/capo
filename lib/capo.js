var fs = require('fs'),
	globule = require('globule'),
	path = require('path'),
	async = require('async'),
	HtmlReport =  require('./reports/HtmlReport'),
	CliReport =  require('./reports/CliReport');

module.exports = function(filePath, mediatorObjectName, options){
	return new Capo(filePath, mediatorObjectName, options);
}

function Capo(filePath, mediatorObjectName, options){
	this.options = options || {};
	this.filePath = filePath;
	this.excludePath = typeof this.options.excludePath === 'string' ? '!' + this.options.excludePath : '';
	this.subscriptions = {};
	this.triggers = {};
	this.callback = undefined;
	this.currentFileName = undefined;
	this.reportType = undefined;
	this.mediatorObjectName = mediatorObjectName || 'mediator';
	this.reportTypes_ = {
		'html': HtmlReport,
		'cli': CliReport
	};
}

Capo.prototype.event = function(eventName) {
	this.eventName = eventName;
	return this;
};

Capo.prototype.report = function(format) {
	this.reportType = format;
	return this;
};

Capo.prototype.find = function(callback){
	this.callback = callback;
	if (typeof this.filePath === 'string'){
		var patterns = [];
		var filePath = path.normalize(this.filePath);
		var extname = path.extname(filePath);
		if (!extname){
			patterns.push(filePath + '/**/*.js');
			if (this.excludePath) patterns.push(this.excludePath);
			this.readFiles_(globule.find(patterns));
		} else if (extname === '.js'){
			this.readFiles_([filePath]);
		} else {
			this.callback(new Error('first parameter should be a folder, js file or ' + 
				'array of js files'));
		} 
	} else if (this.filePath instanceof Array){
		var files = this.filePath.filter(function(file){
			var filePath = path.normalize(file);
			var extname = path.extname(filePath);
			return extname === '.js';
		});
		this.readFiles_(files);
	} else {
		this.callback(new Error('first parameter should be a folder, js file or ' + 
				'array of js files'));
		return;
	}
};

Capo.prototype.readFiles_ = function(files) {
	if (files.length === 0){ this.callback(new Error('No files were found by provided route. ' +
		'Report was not built')); return;}
	async.map(files, fs.readFile, function(err, data){
		if (err === null){ err = false;}
		else {this.callback(err); return;}
		var linefeed;
		for (var i = 0, l = files.length; i < l; i++){
			this.currentFileName = files[i];
			var contents = String(data[i]);
			linefeed = contents.indexOf('\r\n') !== -1 ? '\r\n' : '\n';
			var lines = contents.split(linefeed);
			this.walkThroughLines_(lines);
		}

		if (this.options.strict){
			var strangeEvents = this.checkEventsForStrictMode_();
			if (strangeEvents.length){
				this.callback(new Error('These events have subs but not pubs->' + strangeEvents));
				return;
			}
		}

		this.result = {
			subscriptions: this.subscriptions,
			triggers: this.triggers,
			files: files
		};

		if (typeof this.reportType === 'string'){
			if (typeof this.reportTypes_[this.reportType] !== 'undefined'){
				var report = new this.reportTypes_[this.reportType](this.result,
					this.handleReportCallback_.bind(this));
			} else {
				this.callback(new Error(this.reportType + ' is not known as reporter. ' + 
					'Refer help to see available ones.')); return;
			}
		} else {
			if (this.options.generate) {
				this.generateSpy_();
			}	else { 
				this.callback(err, this.result);
			}
		}

	}.bind(this));
};

Capo.prototype.handleReportCallback_ = function(err) {
	this.err = err || false;
	if (this.err){
		this.callback(err);
	}

	if (this.options.generate){
		this.generateSpy_();
	} else {
		this.callback(false, this.result);
	}
};

Capo.prototype.generateSpy_ = function() {
	this.spy = require('./spyGenerator')(this.result, this.callback, this.mediatorObjectName);
};

Capo.prototype.walkThroughLines_ = function(lines) {
	var subscribePattern = this.mediatorObjectName + "\\.(subscribe|on|once)\\(\[\'\"]",
		subscribePatternMemorySafe = "listen.*" + this.mediatorObjectName + '.*[\'\"]',
		triggerPattern = this.mediatorObjectName + "\\.(trigger|publish|emit)\\(\[\'\"]",
		index,
		indexOfClosingQuote;
	if (typeof this.eventName === 'string'){
		subscribePattern += this.eventName;
		subscribePatternMemorySafe += this.eventName;
		triggerPattern += this.eventName;
	}
	var subscribeRegex = new RegExp(subscribePattern, 'i'),
		subscribeRegexMemorySafe = new RegExp(subscribePatternMemorySafe, 'i'),
		triggerRegex = new RegExp(triggerPattern, 'i');
	for (var i = 0, l = lines.length; i < l; i++){
		if (lines[i].length > 200) break;
		index = lines[i].search(subscribeRegex);
		if (index !== -1){
			this.searchSucceeded_('subscriptions', lines[i], index, i);
		}
		index = lines[i].search(subscribeRegexMemorySafe);
		if (index !== -1){
			this.searchSucceeded_('subscriptions', lines[i], index, i);
		}
		index = lines[i].search(triggerRegex);
		if (index !== -1){
			this.searchSucceeded_('triggers', lines[i], index, i);
		}
	}
};

Capo.prototype.searchSucceeded_ = function(collectionName, line, index, lineNumber) {
	var indexOfOpeningQuote = line.indexOf('\'', index),
		quoteType = '\'';
	if (indexOfOpeningQuote === -1){
		indexOfOpeningQuote = line.indexOf('\"', index);
		quoteType = '\"';
	}
	var indexOfClosingQuote = line.indexOf(quoteType, indexOfOpeningQuote + 1);
	if (indexOfClosingQuote !== -1){
		eventName = line.substring(indexOfOpeningQuote + 1, indexOfClosingQuote);
		if (!this[collectionName][eventName]) this[collectionName][eventName] = [];
		this[collectionName][eventName].push({file: this.currentFileName, line: lineNumber});
	}
};

Capo.prototype.checkEventsForStrictMode_ = function() {
	var strangeEvents = [];
	for (var eventName in this.subscriptions){
		if (typeof this.triggers[eventName] === 'undefined' || 
				this.triggers[eventName].length === 0){
			strangeEvents.push(eventName);
		}
	}
	return strangeEvents;
};