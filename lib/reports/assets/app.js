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

	function EventCollection(){
		this.$el = {
			container: document.getElementById('events-container')
		};
	}

	EventCollection.prototype.populateEvents = function() {
		var data = window.initialDataFromCapo;

			this.events = [];
			this.names = [];

			var eventItem,
				name;

			for (var i in data.subscriptions){
				this.names.push(i);
				eventItem = new EventItem(i);
				eventItem.defineSubscriptions(data.subscriptions[i]);
				this.events.push(eventItem);
			}

			for (i in data.triggers){
				var eventItem = this.findByName(i);
				if (eventItem){
					eventItem.defineTriggers(data.triggers[i]);
				} else {
					this.names.push(i);
					eventItem = new EventItem(i);
					eventItem.defineTriggers(data.triggers[i]);
					this.events.push(eventItem);			
				}
			}
	};

	EventCollection.prototype.clearContainer = function() {
		this.$el.cachedContaner = document.cloneNode(this.$el.container);
		this.$el.container.innerHTML = '';
	};

	EventCollection.prototype.renderEvents = function(eventList) {
		this.clearContainer();
		if (!eventList){
			for (i = 0, l = this.events.length; i < l; i++){
				this.events[i].renderToList();
			}		
		} else {
			for (i in eventList){
				eventList[i].renderToList();
			}			
		}
	};

	EventCollection.prototype.findByName = function(name) {
		var eventItem = false;
		if (this.names.indexOf(name) !== -1){
			for (var j = 0, k = this.events.length; j < k; j++){
				if (this.events[j].name === name){
					return this.events[j];
				}
			}
		} 
		return eventItem;
	};

	EventCollection.prototype.filterByName = function(arg) {
		var collection = [];
		for (var i = 0, l = this.names.length; i < l; i++){
			if (this.names[i].indexOf(arg) !== -1){
				collection.push(this.findByName(this.names[i]));
			}
		}
		return collection;
	};

	function App(){
		this.$el = {
			search: document.getElementById('events-search'),
			eventsWrapper: document.getElementById('events-wrapper'),
			subs: document.getElementById('sub-container'),
			pubs: document.getElementById('pub-container'),
			showAll: document.getElementById('events-show-all')
		};
		this.eventCollection = new EventCollection();
		this.eventCollection.populateEvents();
		this.eventCollection.renderEvents();
		this.gatherCodeBlocks();
	}

	App.prototype.bindListeners = function() {
		this.$el.search.addEventListener('keyup', function(e){
			this.filteredCollection = this.eventCollection.filterByName(this.$el.search.value);
			this.eventCollection.renderEvents(this.filteredCollection);
		}.bind(this));

		this.$el.eventsWrapper.addEventListener('click', function(e){
			var target = e.target;
			if (target.className === 'event-container'){
				this.filterCodeBlocks(target.querySelector('.event-name').innerText);
			}
		}.bind(this));

		this.$el.showAll.addEventListener('click', function(e){
				this.filterCodeBlocks();
		}.bind(this));
	};

	App.prototype.filterCodeBlocks = function(name) {
		var els = document.querySelectorAll('.code-block');;
		if (name){
			for (var i = 0, l = els.length; i < l; i++){
				els[i].style.display = 'none';
			}
			els = document.querySelectorAll('.' + name.replace(/:/g, '-n-'));
		}
		for (var i = 0, l = els.length; i < l; i++){
			els[i].style.display = 'block';
		}
	};

	App.prototype.gatherCodeBlocks = function() {
		var els = document.querySelectorAll('.sub-cb');
		for (var i = 0, l = els.length; i < l; i++){
			this.$el.subs.appendChild(els[i]);
		}
		els = document.querySelectorAll('.pub-cb');
		for (var i = 0, l = els.length; i < l; i++){
			this.$el.pubs.appendChild(els[i]);
		}
	};

	var app = new App();
	app.bindListeners();
	
})(this, document);