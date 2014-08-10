var fs = require('fs');

function GitIgnoreHelper(options){
	this.path = options.path
}

GitIgnoreHelper.prototype.parse = function() {
	try{
		var content = String(fs.readFileSync(this.path + '/.gitignore'));
		var globs = content.split(/\s+/);
		var results = globs.map(function(el){
			if (el.split('.').length === 1 && el.indexOf('*') === -1){
				return '!**/' + el + '/**/*.js';
			} else {
				return '!**/' + el;
			}
		});
		return results;
	} catch(e){
		return null;
	}
};

module.exports = GitIgnoreHelper;
