define(function (require) {
	'use strict';

	var Backbone = require('backbone'),
		Measures = require('timeline/timelineMeasures'),
		enums = require('shared/enums');

	var Timeline = Backbone.Model.extend({
		defaults:{
			afterHalfTime:false
		},

		initialize: function(){
			this.measures = {
				container:{
					width: Measures.timeline.containerWidth,
					height: Measures.timeline.containerHeight
				}
			};
			this.bindListeners();

			this.countPosition();
			this.on('change:width', 'change:height', this.countPosition);
		},

		bindListeners: function(){
			Backbone.on('scoreboard:minutes', this.onMinutesChanged);
			Backbone.on('match:period-end', this.onHalfTime);
			Backbone.on('match:ticker-state', this.currentPeriod);
		},

		currentPeriod: function (period) {
			if(period && period === enums.TickerStates.SecondHalf) {
				this.set('afterHalfTime', true);
			}
		},
		onHalfTime: function(options){
			Backbone.trigger('game:half-time');
		}

	});

	return Timeline;
});