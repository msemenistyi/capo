var	table = require('text-table')

module.exports = table([
	['event',   '-e --event', ' event name to perform search on. Accepts string parameter.'],
	['object',  '-o --object', ' mediator object name (e.g. mediator, Backbone). Case sensitive.'],
	['silent',  '-s --silent', ' won\'t put anything into stdout. At all. Default `false`.'],
	['report',  '-r --report', ' type of report: `html`, `cli` (-r cli). Default `hmtl`.'],
	['verbose', '-v --verbose', ' log all the files processed and other info. Default `false`.'],
	['strict', '--strict', 'throw error on sub for event with 0 pubs. Default `false`.'],
	['generate', '-g --generate', 'generate file with listeners for all the triggers.'],
	['notExcludeGitignore', '-n --not-exclude-gitignore', 'specifies if capo should not exclude gitignored files. Default `false`.'],
	['ignore', '-g --ignore', 'specifies glob path which will be ignored by capo'],
	['help',    '-h --help', ' show help.']
]);