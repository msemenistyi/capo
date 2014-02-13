#!/usr/bin/env node

var realist = require('realist'),
	capo = require('../lib/capo');

var aliases = {
	'event': ['e', 'event'],
	'object': ['o', 'object'],
	'type': ['t', 'type'],
	'silent': ['s', 'silent'],
	'report': ['r', 'report'],
	'verbose': ['v', 'verbose']
}
realist(function(options, path){
	var report = typeof options.report === 'string' ? options.report : 'html';
	var object = typeof options.object === 'string' ? options.object : undefined;
	var eventName = typeof options.event === 'string' ? options.event : false;
	if (path){
		capo(path, object).event(eventName).report(report).find(function(err, data){
			if (err && !options.silent){
				console.log('capo >>>', err.message);
			} else if (options.verbose){
				if (data.files){
					for (var i = 0, l = data.files.length; i < l; i++){
						console.log(data.files[i]);
					}
					console.log('=========');
					console.log('Search finished:');
					console.log(Object.keys(data.subscriptions).length + ' subs '); 
					console.log(Object.keys(data.triggers).length + ' pubs '); 
					console.log('Report can be found at ' + __dirname + '\\capo\\report directory');
				}
			}
		});
	} else {
		if (!options.silent){
			console.log('capo >>> Path to js file or folder to examine should be specified');
		}
	}
}, aliases);