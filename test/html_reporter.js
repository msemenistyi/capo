var capo = require('../'),
	fs = require('fs');

describe('Reports: capo should', function(){
	it('create \'capo\' folder', function(done){
		capo(__dirname + '/fixtures').report('html').find(function(err, data){
			fs.readdir('capo', function(err, files){
				if (err === null) err = false;
				err.should.be.not.ok;
				done();
			});
		});
	});

	it('create report file', function(done){
		capo(__dirname + '/fixtures').report('html').find(function(err, data){
			fs.readFile('capo/report.html', function(err, data){
				if (err === null) err = false;
				err.should.be.not.ok;
				done();
			});
		});
	});
});