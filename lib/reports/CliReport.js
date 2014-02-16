module.exports = CliReport;

var fs = require('fs'),
	async = require('async'),
	Report = require('./Report'),
	colors = require('colors'),
	utils = require('../utils');
	linePicker = require('pick-lines-from-file');

function CliReport (data, callback) {
	Report.call(this, data, callback);
	this.resultData = {};
	this.createFilesHash_(data);
	this.aggregateFilesAcrossEvents_();
	this.outputReport_();
	this.capoCallback();
}

CliReport.prototype = new Report();

CliReport.prototype.aggregateFilesAcrossEvents_ = function(){
	this.aggregateCollection_(this.data.triggers, 'triggers');
	this.aggregateCollection_(this.data.subscriptions, 'subscriptions');
};

CliReport.prototype.aggregateCollection_ = function(collection, type) {
	var lines, i, currentFileName, currentEvent;
	for (var eventName in collection){
		currentFileName = undefined;
		lines = collection[eventName];
		if (typeof this.resultData[eventName] === 'undefined'){
			this.resultData[eventName] = {};
		}
		this.resultData[eventName][type] = {};
		for (i = 0, l = lines.length; i < l; i++){
			if (!currentFileName || currentFileName !== lines[i].file){
				currentFileName = lines[i].file;
				this.resultData[eventName][type][currentFileName] = [lines[i].line];
			} else {
				this.resultData[eventName][type][currentFileName].push(lines[i].line);
			}
		}
	}
};

CliReport.prototype.outputReport_ = function() {
	var fileName;
	for (var eventName in this.resultData){
		console.log('==========='.cyan);
		console.log(eventName.cyan.bold);
		console.log('==========='.cyan);
		var subs = [],
			subsCount = 0,
			pubs = [],
			pubsCount = 0;
		for (fileName in this.resultData[eventName]['subscriptions']){
			subs.push(fileName, this.resultData[eventName]['subscriptions'][fileName]);
			subsCount += this.resultData[eventName]['subscriptions'][fileName].length;
		}
		console.log((subsCount + ' ' + utils.formTitleString(subsCount, 'sub')).green);
		utils.logWithNewLineOdds(subs);
		for (fileName in this.resultData[eventName]['triggers']){
			pubs.push(fileName, this.resultData[eventName]['triggers'][fileName]);
			pubsCount += this.resultData[eventName]['triggers'][fileName].length;
		}
		console.log((pubsCount + ' ' + utils.formTitleString(pubsCount, 'pub')).red);
		utils.logWithNewLineOdds(pubs);
	}
};