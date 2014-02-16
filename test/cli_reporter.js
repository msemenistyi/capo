var capo = require('../');

describe('Cli Reports: capo should', function(){

	it('create \'capo\' folder', function(done){
		capo('d:/javascripts', 'Backbone').report('cli').find(function(err, data){
			err.should.not.be.ok;
			done();
		});
	});

});