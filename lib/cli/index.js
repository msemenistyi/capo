var capo = require('../capo'),
	colors = require('colors'),
	help = require('./help');

module.exports = function(options, path){
	if (options.help){
		console.log(help);
		process.exit(0);
	}
	var report = typeof options.report === 'string' ? options.report : 'html';
	var object = typeof options.object === 'string' ? options.object : undefined;
	var eventName = typeof options.event === 'string' ? options.event : false;
	if (path){
		capo(path, object, options).event(eventName).report(report).find(function(err, data){
			if (err && !options.silent){
				console.log('capo >>>'.red, err.message);
				process.exit(1);
			} else if (options.verbose){
				if (data.files){
					for (var i = 0, l = data.files.length; i < l; i++){
						console.log(data.files[i]);
					}
					console.log('=========');
					console.log('Search finished:');
					console.log(Object.keys(data.subscriptions).length + ' subs '); 
					console.log(Object.keys(data.triggers).length + ' pubs '); 
					console.log('Report can be found at .\\capo\\report directory');
					process.exit(0);
				}
			}
		});
	} else {
		if (!options.silent){
			console.log('capo >>>'.red + ' Path to js file or folder to examine should be specified');
			process.exit(0);
		}
	}
};