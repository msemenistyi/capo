var capo = require('../'),
	fs = require('fs');

describe('HTML Reports: capo should', function(){
	
	it('create \'capo\' folder', function(done){
		capo(__dirname + '/fixtures', false, {generate: true}).report('html').find(function(err, data){
			fs.readdir('capo', function(err, files){
				if (err === null) err = false;
				err.should.be.not.ok;
				done();
			});
		});
	});

	it('create \'spy\' file', function(done){
		capo(__dirname + '/fixtures', false, {generate: true}).report('html').find(function(err, data){
			fs.readFile('capo/spy.js', function(err, files){
				if (err === null) err = false;
				err.should.be.not.ok;
				done();
			});
		});
	});

});