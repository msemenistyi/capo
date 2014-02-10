define(function (require) {
	'use strict';

	var Backbone = require('backbone'),
		Measures = require('timeline/timelineMeasures'),
		enums = require('shared/enums');

	var Timeline = Backbone.Model.extend({
		defaults:{
			afterHalfTime:false
		},

		bindListeners: function(){
			this.listenTo(Backbone, 'scoreboard:minutes', this.onMinutesChanged);
			this.listenTo(Backbone, 'match:period-end', this.onHalfTime);
			this.listenToOnce(Backbone, 'match:ticker-state', this.currentPeriod);
		}

	});

	return Timeline;
});