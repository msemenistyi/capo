

function bindListeners_(){
	mediator.on('player-controller:player', function(name){
		self.playerName = name;
	});

	mediator.publish('player:initialize', {player: 2});

}
