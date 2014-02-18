var fs = require('fs');

module.exports = function(result, callback, mediatorName){
	return new SpyGenerator(result, callback, mediatorName);
}

function SpyGenerator(result, callback, mediatorName){
	this.result = result;
	this.mediatorName = mediatorName;
	this.capoCallback = callback;
	this.contents = this.generateCode();
	if (this.contents){
		this.run();
	}
}

SpyGenerator.prototype.run = function() {
	fs.mkdir('capo', function(err){
		if (err){ 
			if (!err.code === 'EEXIST'){ this.capoCallback(err); return;}
		} 
		fs.writeFile('capo/spy.js', this.contents, function(err){
			if (!err){ err = false; } 
				this.capoCallback(err, this.result);
		}.bind(this));
	}.bind(this));
};

SpyGenerator.prototype.generateCode = function() {
	var contents = [
		'function spyHandler(eventName, data){',
		'	console.log(eventName + \' triggered\');',
		'}',
		''
	];
	for (var i in this.result.triggers){
		contents.push(this.mediatorName + '.on(\'' + i + '\', spyHandler.bind(null, \'' + i + '\'));');
	}
	return contents.join('\n');
};