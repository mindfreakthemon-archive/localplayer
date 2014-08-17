var Artist = Backbone.Model.extend({
	idAttribute: 'hash',

	_albums: null,
	getAlbums: function() {
		if(this._albums === null)
			this._albums = new Albums(Library.getAlbums(this));

		return this._albums;
	},

	_view: null,
	getView: function() {
		if(this._view === null)
			this._view = Library.getView(this);

		return this._view;
	}
});

var Artists = Backbone.Collection.extend({
	model: Artist,

	comparator: (function() {
		var regexp = new RegExp('^(The|A) ', 'i');

		return function(artist) {
			return artist.get('title').replace(regexp, '');
		};
	})(),

	_view: null,
	getView: function() {
		if(this._view === null)
			this._view = Library.getView(this);

		return this._view;
	}
});

var ArtistView = Backbone.View.extend({
	_template: null,
	_expanded: false,

	initialize: function() {
		this._template = _.template('<div class="artist-title"><span><%- title %></span></div>');
	},
	render: function() {
		this.$el.html(this._template(this.model.toJSON()));

		if(this._expanded)
			this.$el.after(this.model.getAlbums().getView().render().$el);
		else
			this.model.getAlbums().getView().remove();

		return this;
	},
	events: {
		'click .artist-title > span': 'albums'
	},
	albums: function() {
		this._expanded = !this._expanded;
		this.render();
	}
});

var ArtistsView = Backbone.View.extend({
	initialize: function() {
		this.collection.on('change reset', this.render, this);
	},
	render: function() {
		var self = this;

		this.$el.empty();
		this.collection.each(function(artist) {
			self.$el.append(artist.getView().render().$el);
		});

		return this;
	}
});