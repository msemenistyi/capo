(function(window, document){

	function EventItem(name){
		this.name = name;
		this.subscriptions = [];
		this.triggers = [];
		this.$el = {
			container: document.getElementById('events-container'),
			template: document.getElementById('event-template').innerHTML
		};
	}

	EventItem.prototype.defineSubscriptions = function(data) {
		this.subscriptions = data;
	};

	EventItem.prototype.defineTriggers = function(data) {
		this.triggers = data;
	};

	EventItem.prototype.renderToList = function() {
		var el = document.createElement('div'),
			content = this.$el.template; 
		el.className = 'event-container';
		content = content.replace(/\{\{name\}\}/, this.name);
		content = content.replace(/\{\{subs\}\}/, this.subscriptions.length);
		content = content.replace(/\{\{pubs\}\}/, this.triggers.length);
		el.innerHTML = content;
		this.$el.container.appendChild(el); 
	};

	function App(){}

	App.prototype.populateEvents = function() {
	var data = window.initialDataFromCapo;

		//to_be_removed
		data.subscriptions['game-started'] = [{
			file: "d:/projects/capo/test/fixtures/another_js_file.js",
			line: 19}
		];

		this.events = [];

		var eventItem,
			name,
			names = [];
		for (var i in data.subscriptions){
			names.push(i);
			eventItem = new EventItem(i);
			eventItem.defineSubscriptions(data.subscriptions[i]);
			this.events.push(eventItem);
		}

		for (i in data.triggers){
			if (names.indexOf(i) !== -1){
				for (var j = 0, k = this.events.length; j < k; j++){
					if (this.events[j].name === i){
						this.events[j].defineTriggers(data.triggers[i]);
						break;
					}
				}
			} else {
				names.push(i);
				eventItem = new EventItem(i);
				eventItem.defineTriggers(data.triggers[i]);
				this.events.push(eventItem);			
			}
		}
	};

	App.prototype.renderEvents = function() {
		for (i = 0, l = this.events.length; i < l; i++){
			this.events[i].renderToList();
		}		
	};

	var app = new App();
	app.populateEvents();
	app.renderEvents();
	
})(this, document);