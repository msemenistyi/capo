var	table = require('text-table')

module.exports = table([
	['event',   '-e --event', ' event name to perform search on. Accepts string parameter.'],
	['object',  '-o --object', ' mediator object name (e.g. mediator, Backbone). Case sensitive.'],
	['type',    '-t --type', ' `pub` or `sub`. (-t pub)  Default - both.'],
	['silent',  '-s --silent', ' won\'t put anything into stdout. At all. Default `false`.'],
	['report',  '-r --report', ' type of report: `html`, `cli` (-r cli). Default `hmtl`.'],
	['verbose', '-v --verbose', ' log all the files processed and other info. Default `false`.'],
	['help',    '-h --help', ' show help.']
]);