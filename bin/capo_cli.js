#!/usr/bin/env node

var realist = require('realist'),
	fs = require('fs'),
	capo_cli = require('../lib/cli/');

var aliases = {
	'event': ['e', 'event'],
	'object': ['o', 'object'],
	'type': ['t', 'type'],
	'silent': ['s', 'silent'],
	'report': ['r', 'report'],
	'verbose': ['v', 'verbose'],
	'strict': ['strict'],
	'generate': ['g', 'generate'],
	'notExcludeGitignore': ['n', 'not-exclude-gitignore'],
	'ignore': ['i', 'ignore'],
	'help': ['h', 'help']
};

try {
	var opts = fs.readFileSync('capo.opts', 'utf8')
		.trim()
		.split(/\s+/);

	process.argv = process.argv.concat(opts);
} catch (err) {}

realist(function(options, path){
	for (var i in options){
		if (options[i] instanceof Array){
			options[i] = options[i][0];
		}
	}
	capo_cli(options, path);
}, aliases);