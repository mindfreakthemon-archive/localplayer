var Track = Backbone.Model.extend({
	idAttribute: 'hash',

	_view: null,
	getView: function() {
		if(this._view === null)
			this._view = Library.getView(this);

		return this._view;
	}
});

var Tracks = Backbone.Collection.extend({
	model: Track,
	comparator: function(track) {
		return track.get('track_number');
	},
	url: function() {
		return '/';
	},

	_view: null,
	getView: function() {
		if(this._view === null)
			this._view = Library.getView(this);

		return this._view;
	}
});

var TrackView = Backbone.View.extend({
	initialize: function() {
		this._template = _.template(
			'<table>' +
				'<tr>' +
					'<td class="track-number"><%= number %></td>' +
					'<td class="track-title"><span><%= title %></span></td>' +
					'<td class="track-stream"><%= stream %></td>' +
					'<td class="track-rating <%= rating %>"><div></div><div></div></td>' +
					'<td class="track-options">' +
						'<div class="persistent-button editor-track-edit" title="Edit"></div>' +
					'</td>' +
				'</tr>' +
			'</table>'
		);

		this.model.on('change:title', this.render, this);
		this.model.on('destroy', this.remove, this);
	},
	render: function() {
		var track = this.model, info = [];

		this.$el.html(this._template({
			title: track.get('title'),
			number: track.has('track_number') ? track.get('track_number') : '',
			stream: track.get('stream') ? 'stream' : track.get('playtime_string') + ' @ ' + track.get('bitrate_string'),
			rating: 'rating-' + track.get('rating')
		}));

		return this;
	},
	events: {
		'click .track-title > span': 'playTrack'
	},
	playTrack: function() {
		Player.select(this.model);
	}
});

var TracksView = Backbone.View.extend({
	initialize: function() {
		this.collection.on('change reset', this.render, this);
	},
	render: function() {
		var self = this;

		this.collection.each(function(track) {
			self.$el.append(track.getView().render().$el);
		});

		return this;
	}
});