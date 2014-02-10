function onGameRemoved_(game){
	var index = _.findWhere(self.list, {id: game.id});
	if (typeof index !== 'undefined'){
		index = index.id;
		$('.join-button[data-id="' +  index + '"]').closest('.row').remove();
		self.list.splice(index, 1);
	}
}

function bindListeners_(){
	mediator.on('player-controller:player', function(name){
		self.playerName = name;
	});

	mediator.trigger('dasd', 'qwerty');
}

function triggerData_(){
	mediator.on('game-controller:mode', function(isLocalGame){
		el_.gamesListContainer.toggle();
	});

	mediator.trigger('asd:dasd', {asd: 5, 6});
}