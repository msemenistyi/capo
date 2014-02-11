var capo = require('../'),
	fs = require('fs');

describe('One file: capo should', function(){

	it('return subscriptions and triggers properly', function(done){
		var filePath = __dirname + '/fixtures/initial.js';
		capo(filePath).find(function(err, data){
			err.should.be.not.ok;

			data.subscriptions.should.be.Object;
			data.triggers.should.be.Object;

			data.subscriptions['player-controller:player'].should.be.instanceOf(Array);
			data.triggers['game-started'].should.be.instanceOf(Object);

			data.subscriptions['player-controller:player'][0].line.should.be.equal(10);
			data.triggers['game-started'][0].line.should.be.equal(20);

			done();
		});
	});

	it('return subscriptions and triggers properly for provided eventName', function(done){
		capo(__dirname + '/fixtures/initial.js').event('game-started').find(function(err, data){
			err.should.be.not.ok;

			data.triggers['game-started'][0].line.should.be.equal(20);

			done();

		});
	});

	it('return subscriptions properly for Backbone listenTo '  + 
			'method', function(done){
		capo(__dirname + '/fixtures/backbone_listen_to.js', 'Backbone').find(function(err, data){
			err.should.be.not.ok;

			data.subscriptions['scoreboard:minutes'][0].line.should.be.equal(13);
			data.subscriptions['match:ticker-state'][0].line.should.be.equal(15);

			done();
		});
	});

	it('return subscriptions properly for Backbone listenTo method and defined'  + 
			' event', function(done){
		capo(__dirname + '/fixtures/backbone_listen_to.js', 'Backbone').
				event('match:ticker-state').find(function(err, data){
			err.should.be.not.ok;

			data.subscriptions['match:ticker-state'][0].line.should.be.equal(15);

			done();
		});
	});

	it('return error for not js file', function(done){
		capo(__dirname + '/fixtures/wrong_file_ext.jk').find(function(err, data){
			err.should.be.ok;
			done();
		});
	});

	it('return error for not existing js file', function(done){
		capo(__dirname + '/fixtures/wrong_file_ext.js').find(function(err, data){
			err.should.be.ok;
			done();
		});
	});

	it('return valid data for custom mediator object name', function(done){
		var filePath = __dirname + '/fixtures/backbone_mediator.js';
		capo(filePath, 'Backbone').find(function(err, data){
			err.should.be.not.ok;
			Object.keys(data.subscriptions).length.should.be.equal(3);
			Object.keys(data.triggers).length.should.be.equal(1);

			Object.keys(data.subscriptions)[1].should.be.equal('match:period-end');
			Object.keys(data.triggers)[0].should.be.equal('game:half-time');

			Object.keys(data.subscriptions)[2].should.be.equal('match:ticker-state');
			done();
		});
	});
	
});

describe('Folder: capo should', function(){

	it('return subscriptions and triggers properly for provided eventName', function(done){
		capo(__dirname + '/fixtures').event('game-started').find(function(err, data){
			err.should.be.not.ok;

			data.triggers['game-started'][0].line.should.be.equal(19);
			data.triggers['game-started'][1].line.should.be.equal(20);

			done();

		});
	});

	it('return empty subscriptions and triggers for missing eventName', function(done){
		capo(__dirname + '/fixtures').event('app:restart').find(function(err, data){
			err.should.be.not.ok;

			data.triggers.should.be.empty;
			data.subscriptions.should.be.empty;

			done();

		});
	});

});

describe('Reports: capo should', function(){
	it('create \'capo\' folder', function(done){
		var dirname = __dirname; 
		capo(__dirname + '/fixtures').report('html').find(function(err, data){
			fs.readdir('capo', function(err, files){
				if (err === null) err = false;
				err.should.be.not.ok;
				done();
			});
		});
	});
});