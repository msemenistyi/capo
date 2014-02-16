var capo = require('../'),
	fs = require('fs');

describe('HTML Reports: capo should', function(){
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

	it('create report file for one event', function(done){
		capo(__dirname + '/fixtures/one_event_file.js', 'bus').report('html').find(function(err, data){
			Object.keys(data.triggers).length.should.be.equal(1);
			fs.readFile('capo/report.html', function(err, data){
				if (err === null) err = false;
				err.should.be.not.ok;
				done();
			});
		});
	});
});