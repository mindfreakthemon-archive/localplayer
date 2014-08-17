var Album = Backbone.Model.extend({
	idAttribute: 'hash',

	_tracks: null,
	getTracks: function() {
		if(this._tracks === null)
			this._tracks = new Tracks(Library.getTracks(this));

		return this._tracks;
	},

	_view: null,
	getView: function() {
		if(this._view === null)
			this._view = Library.getView(this);

		return this._view;
	}
});

var Albums = Backbone.Collection.extend({
	model: Album,

	comparator: function(album) {
		return album.get('year');
	},

	_view: null,
	getView: function() {
		if(this._view === null)
			this._view = Library.getView(this);

		return this._view;
	}
});

/**
 * @uses TracksView, Library
 */
var AlbumView = Backbone.View.extend({
	_template: null,
	_expanded: false,

	initialize: function() {
		this._template = _.template(
			'<table>' +
				'<tr>' +
					'<td rowspan="2" class="album-cover"><img src="<%= cover %>" /></td>' +
					'<td class="album-title"><span><%- title %><span></td>' +
				'</tr>' +
				'<tr>' +
					'<td class="album-additional"><%= info %></td>' +
				'</tr>' +
			'</table>'
		);
	},
	render: function() {
		var album = this.model, info = [];

		if(album.has('year'))
			info.push('released: ' + album.get('year'));
		if(album.has('genre'))
			info.push('genre: ' + album.get('genre'));
		info.push('tracks: ' + album.get('count'));

		this.$el.html(this._template({
			title: album.get('title'),
			info: info.join(' | '),
			cover: album.has('cover') ? album.get('cover') : '/img/defacover.jpg'
		}));

		if(this._expanded)
			this.$el.after(this.model.getTracks().getView().render().$el);

		return this;
	},
	events: {
		'click .album-title > span': 'tracks'
	},
	tracks: function() {
		this._expanded = !this._expanded;
		this.render();
	}
});

var AlbumsView = Backbone.View.extend({
	initialize: function() {
		this.collection.on('change reset', this.render, this);
	},
	render: function() {
		var self = this;

		this.collection.each(function(album) {
			self.$el.append(album.getView().render().$el);
		});

		return this;
	}
});