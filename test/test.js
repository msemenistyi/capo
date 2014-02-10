var Capo = require('../');

describe('One file: capo should', function(){

	var capo;

	beforeEach(function(){
		capo = new Capo();
	});

	it('return supscriptions and triggers properly', function(done){
		capo.find(__dirname + '/fixtures/initial.js', function(err, data){
			err.should.be.not.ok;

			data.subscriptions.should.be.Object;
			data.triggers.should.be.Object;

			data.subscriptions['player-controller:player'].should.be.instanceOf(Array);
			data.triggers['dasd'].should.be.instanceOf(Object);

			data.subscriptions['player-controller:player'][0].should.be.equal(10);
			data.triggers['dasd'][0].should.be.equal(20);

			done();
		});

	});
});