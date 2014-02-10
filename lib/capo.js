var fs = require('fs');
var linefeed = process.platform === 'win32' ? '\r\n' : '\n';
var glob = require('glob');
var path = require('path');

module.exports = Capo;

function Capo(){
	this.subscriptions = {};
	this.triggers = {};
	this.callback = undefined;
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
		glob(filePath + '/*.js', this.readFiles_);
	} else if (extname === '.js'){
		this.readFile_(filePath);
	} else {
		this.callback(new Error('first parameter should be either a folder or a js file'));
	}
};

Capo.prototype.readFile_ = function(f) {
	fs.readFile(f, function(err, data){
		if (err) throw err;
		var lines = String(data).split(linefeed);
		this.walkThroughLines_(lines);
		this.callback(false, {
			subscriptions: this.subscriptions,
			triggers: this.triggers
		});
	}.bind(this));
};

Capo.prototype.readFiles_ = function(err, files) {
	files.forEach(function(f){
		this.readFile_(f);
	});
};

Capo.prototype.walkThroughLines_ = function(lines) {
	var subscribePattern = /mediator\.(subscribe|on)\(\'/,
		publishPattern = /mediator\.(trigger|publish)\(\'/,
		index,
		indexOfClosingQuote;
	if (typeof this.eventName === 'string'){
		subscribePattern += this.eventName;
		publishPattern += this.eventName;
	}
	for (var i = 0, l = lines.length; i < l; i++){
		index = lines[i].search(subscribePattern);
		if (index !== -1){
			this.searchSucceeded_('subscriptions', lines[i], index, i);
		}
		index = lines[i].search(publishPattern);
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
		this[collectionName][eventName].push(lineNumber);
	}
};