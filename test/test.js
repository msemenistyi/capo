var Capo = require('../');

describe('One file: capo should', function(){

	var capo,
		filePath;

	beforeEach(function(){
		capo = new Capo();
		filePath = __dirname + '/fixtures/initial.js';
	});

	it('return subscriptions and triggers properly', function(done){
		capo.find(filePath, function(err, data){
			err.should.be.not.ok;

			data.subscriptions.should.be.Object;
			data.triggers.should.be.Object;

			data.subscriptions['player-controller:player'].should.be.instanceOf(Array);
			data.triggers['dasd'].should.be.instanceOf(Object);

			data.subscriptions['player-controller:player'][0].line.should.be.equal(10);
			data.triggers['dasd'][0].line.should.be.equal(20);

			done();
		});
	});

	it('return subscriptions and triggers properly for provided eventName', function(done){
		capo.find(__dirname + '/fixtures/initial.js', 'dasd', function(err, data){
			err.should.be.not.ok;

			data.triggers['dasd'][0].line.should.be.equal(20);

			done();

		});
	});

	it('return error for not js file', function(done){
		capo.find(__dirname + '/fixtures/wrong_file_ext.jk', function(err, data){
			err.should.be.ok;
			done();
		});
	});

	it('return error for not existing js file', function(done){
		capo.find(__dirname + '/fixtures/wrong_file_ext.js', function(err, data){
			err.should.be.ok;
			done();
		});
	});
	
});

describe('Folder: capo should', function(){

	var capo;

	beforeEach(function(){
		capo = new Capo();
	});

	it('return subscriptions and triggers properly for provided eventName', function(done){
		capo.find(__dirname + '/fixtures', 'dasd', function(err, data){
			err.should.be.not.ok;

			data.triggers['dasd'][0].line.should.be.equal(14);
			data.triggers['dasd'][1].line.should.be.equal(20);

			done();

		});
	});

	it('return empty subscriptions and triggers for missing eventName', function(done){
		capo.find(__dirname + '/fixtures', 'taras', function(err, data){
			err.should.be.not.ok;

			data.triggers.should.be.empty;
			data.subscriptions.should.be.empty;

			done();

		});
	});

});