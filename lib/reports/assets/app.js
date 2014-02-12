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
		this.subs = true;
		this.pubs = true;
		this.$el = {
			search: document.getElementById('events-search'),
			eventsWrapper: document.getElementById('events-wrapper'),
			subs: document.getElementById('sub-container'),
			pubs: document.getElementById('pub-container'),
			showAll: document.getElementById('events-show-all'),
			checkPubs: document.getElementById('pubs-check'),
			checkSubs: document.getElementById('subs-check')
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
			var eventContainer;
			if (target.className === 'event-container'){
				eventContainer = target
			} else if (target.parentNode.className === 'event-container'){
				eventContainer = target.parentNode;
			}
			if (eventContainer){
				this.filterCodeBlocks(eventContainer.querySelector('.event-name').innerText);
			}
		}.bind(this), true);

		this.$el.showAll.addEventListener('click', function(e){
			this.filterCodeBlocks();
			e.target.style.display = 'none';
		}.bind(this));

		this.$el.checkPubs.addEventListener('change', function(e){
			this.pubs = !this.pubs;
			this.updateRegions();
		}.bind(this));

		this.$el.checkSubs.addEventListener('change', function(e){
			this.subs = !this.subs;
			this.updateRegions();
		}.bind(this));
	};

	App.prototype.filterCodeBlocks = function(name) {
		var els = document.querySelectorAll('.code-block');;
		if (name){
			this.$el.showAll.style.display = 'inline-block';
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

	App.prototype.updateRegions = function() {
		this.$el.pubs.style.display = this.pubs ? 'block' : 'none';
		this.$el.subs.style.display = this.subs ? 'block' : 'none';
		if (this.pubs && this.subs){
			this.$el.subs.style.width = '40%';
			this.$el.pubs.style.width = '40%';
			this.$el.checkPubs.disabled = false;
			this.$el.checkSubs.disabled = false;
		} else if (this.pubs && !this.subs){
			this.$el.checkPubs.disabled = true;
			this.$el.checkSubs.disabled = false;
			this.$el.pubs.style.width = '80%';
		} else if (!this.pubs && this.subs){
			this.$el.checkSubs.disabled = true;
			this.$el.checkPubs.disabled = false;
			this.$el.subs.style.width = '80%';
		}
	};

	var app = new App();
	app.bindListeners();
	
})(this, document);