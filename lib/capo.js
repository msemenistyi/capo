var fs = require('fs'),
	glob = require('glob'),
	path = require('path'),
	async = require('async'),
	linefeed = process.platform === 'win32' ? '\r\n' : '\n';

module.exports = function(filePath, mediatorObjectName){
	return new Capo(filePath, mediatorObjectName);
}

function Capo(filePath, mediatorObjectName){
	this.filePath = filePath;
	this.subscriptions = {};
	this.triggers = {};
	this.callback = undefined;
	this.currentFileName = undefined;
	this.mediatorObjectName = mediatorObjectName || 'mediator';
}

Capo.prototype.find = function(eventName, callback){
	if (!callback){
		this.callback = eventName;
	} else {
		this.eventName = eventName;
		this.callback = callback;
	}
	var filePath = path.normalize(this.filePath);
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
	var subscribePattern = this.mediatorObjectName + "\\.(subscribe|on)\\(\\'",
		triggerPattern = this.mediatorObjectName + "\\.(trigger|publish)\\(\\'",
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