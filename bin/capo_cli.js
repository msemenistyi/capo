#!/usr/bin/env node

var realist = require('realist'),
	capo_cli = require('../lib/cli/');

var aliases = {
	'event': ['e', 'event'],
	'object': ['o', 'object'],
	'type': ['t', 'type'],
	'silent': ['s', 'silent'],
	'report': ['r', 'report'],
	'verbose': ['v', 'verbose'],
	'help': ['h', 'help']
};

realist(function(options, path){
	capo_cli(options, path);
}, aliases);