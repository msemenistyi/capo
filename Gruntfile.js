module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		javascripts: ['*.js'],
		
		jshint: {
			client: ['<%= javascripts %>'],
			options: {
				sub: true,
				smarttabs: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint']);
};