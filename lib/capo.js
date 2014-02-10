var fs = require('fs'),
	glob = require('glob'),
	path = require('path'),
	async = require('async'),
	linefeed = process.platform === 'win32' ? '\r\n' : '\n';

module.exports = Capo;

function Capo(){
	this.subscriptions = {};
	this.triggers = {};
	this.callback = undefined;
	this.currentFileName = undefined;
}

Capo.prototype.find = function(filePath, eventName, callback){
	if (!callback){
		this.callback = eventName;
	} else {
		this.eventName = eventName;
		this.callback = callback;
	}
	var filePath = path.normalize(filePath);
	var extname = path.extname(filePath);
	if (!extname){
		glob(filePath + '/*.js', this.readFiles_.bind(this));
	} else if (extname === '.js'){
		this.readFiles_(false, [filePath]);
	} else {
		this.callback(new Error('first parameter should be either a folder or a js file'));
	}
};

Capo.prototype.readFiles_ = function(err, files) {
	async.map(files, fs.readFile, function(err, data){
		if (err === null){ err = false;}
		else {this.callback(err); return;}
		for (var i = 0, l = files.length; i < l; i++){
			this.currentFileName = files[i];
			var lines = String(data[i]).split(linefeed);
			this.walkThroughLines_(lines);
		}
		this.callback(err, {
			subscriptions: this.subscriptions,
			triggers: this.triggers
		});
	}.bind(this));
};

Capo.prototype.walkThroughLines_ = function(lines) {
	var subscribePattern = "mediator\\.(subscribe|on)\\(\\'",
		triggerPattern = "mediator\\.(trigger|publish)\\(\\'",
		index,
		indexOfClosingQuote;
	if (typeof this.eventName === 'string'){
		subscribePattern += this.eventName;
		triggerPattern += this.eventName;
	}
	var subscribeRegex = new RegExp(subscribePattern, 'i'),
		triggerRegex = new RegExp(triggerPattern, 'i');
	for (var i = 0, l = lines.length; i < l; i++){
		index = lines[i].search(subscribeRegex);
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
		indexOfClosingQuote = line.indexOf('\'', indexOfOpeningQuote + 1);
	if (indexOfClosingQuote !== -1){
		if (!this.eventName) {
			eventName = line.substring(indexOfOpeningQuote + 1, indexOfClosingQuote);
		} else {
			eventName = this.eventName;
		}
		if (!this[collectionName][eventName]) this[collectionName][eventName] = [];
		this[collectionName][eventName].push({file: this.currentFileName, line: lineNumber});
	}
};