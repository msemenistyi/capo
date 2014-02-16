module.exports = Report;

function Report (data, callback) {
	this.capoCallback = callback;
	this.data = data;
	this.files = {};
	this.eventTypes = {};
}

Report.prototype.createFilesHash_ = function(data) {
	var fileNames = [];
	for (var i in data.subscriptions){
		for (var j = 0, l = data.subscriptions[i].length; j < l; j++){
			this.upsertFileHash_(data.subscriptions[i][j], 'sub', i);
		}
	}
	for (i in data.triggers){
		for (j = 0, l = data.triggers[i].length; j < l; j++){
			this.upsertFileHash_(data.triggers[i][j], 'pub', i);
		}
	}
};

Report.prototype.upsertFileHash_ = function(record, type, eventName) {
	var fileName = record.file;
	if (typeof this.files[fileName] !== 'undefined'){
		this.files[fileName].push(record.line);
		this.eventTypes[fileName].push({
			type: type,
			eventName: eventName
		});
		return;
	}
	this.files[fileName] = [];
	this.files[fileName].push(record.line);
	this.eventTypes[fileName] = [];
	this.eventTypes[fileName].push({
		type: type,
		eventName: eventName
	});
};