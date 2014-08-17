var PlayerSkeleton = Backbone.Model.extend({
	sound: {},

	defaults: {
		position: 0,
		duration: 0,
		loaded: 0,

		loading: false,
		playing: false,
		paused: false,

		muted: false,
		volume: 100
	},

	select: function(track) {
		if(this.sound._iO && !this.sound._autofinish)
			this.sound.stop(), this.sound.destruct();

		var self = this;

		this.set('track', track);
		this.sound = soundManager.createSound({
			id: track.get('hash'),
			url: track.get('audiofile'),
			whileloading: function() {
				self.set('duration', this.duration);
			},
			whileplaying: function() {
				self.set('position', this.position);
			},
			onload: function() {
				self.set('loaded', true);
			},
			onfinish: function() {
				self.stop();
				self.trigger('finish');
			}
		});

		if(this.sound.readyState == 0)
			this.sound.load();

		this.sound.setVolume(this.getVolume());

		if(this.isMuted())
			this.sound.mute();

		if(this.isPlaying())
			this.sound.play();
	},
	isSelected: function() {
		return !!this.get('track');
	},
	play: function() {
		if(!this.isSelected() || this.isPlaying())
			return;

		this.set({playing: true, paused: false});
		this.sound.play();
	},
	isPlaying: function() {
		return this.get('playing');
	},
	togglePause: function() {
		if(!this.isSelected() || !this.isPlaying())
			return;

		this.set('paused', !this.get('paused'));
		this.sound.togglePause();
	},
	isPaused: function() {
		return this.get('paused');
	},
	stop: function() {
		if(!this.isSelected() || !this.isPlaying())
			return;

		this.set({playing: false, paused: true, position: 0});
		this.sound.stop();
	},
	setVolume: function(volume) {
		if(volume < 0 || volume > 100)
			return;

		this.set('volume', volume);
		this.sound.setVolume && this.sound.setVolume(volume);
	},
	getVolume: function() {
		return this.get('volume');
	},
	toggleMute: function() {
		this.set('muted', !this.get('muted'));
		this.sound.toggleMute && this.sound.toggleMute();
	},
	isMuted: function() {
		return this.get('muted');
	},
	setPosition: function(msec) {
		this.set('position', msec);
		this.sound.setPosition(msec);
	},
	getPosition: function() {
		return this.get('position');
	},
	getDuration: function() {
		return this.get('duration');
	},
	isLoaded: function() {
		return this.get('loaded');
	},
	getPlayed: function() {
		return this.get('position') / this.get('duration');
	},
	getLoaded: function() {
		return this.sound.bytesLoaded / this.sound.bytesTotal;
	}
});

var PlayerView = Backbone.View.extend({
	_popup: null,
	_played: null,
	_loaded: null,
	_timeline: null,

	_playback: null,

	_nowplaying: null,

	_status_duration: null,
	_status_played: null,

	initialize: function() {
		this.setElement('#player');

		this._popup = $("#controls-popup");
		this._loaded = $("#controls-loaded");
		this._played = $("#controls-played");
		this._timeline = $("#controls-timeline");

		this._status_duration = $("#controls-status-duration");
		this._status_played = $("#controls-status-played");

		this._playback = $("#controls-playback");

		this._nowplaying = $("#player-nowplaying");

		Player.on('change:track', this.changetrack, this);
		Player.on('change:position', this.handlepos, this);
		Player.on('change:duration', this.handleload, this);
		Player.on('change:playing change:paused', this.handleplay, this);
		Player.on('change:volume', this.handlevolume, this)
		Player.on('change:muted', this.handlemute, this)
	},
	events: {
		'click #controls-seekbar.active': 'setposition',
		'mousemove #controls-seekbar.active': 'showposition',
		'mouseout #controls-seekbar.active': 'hideposition',
		'click #controls-visibility': 'changevisible',

		'click #controls-playback.active': 'toggleplayer',
		'click #controls-stop.active': 'stopplayer',

		'click #controls-volmute': 'togglemute',
		'change #controls-volslider': 'changevolume'
	},
	/* timeline */
	calcval: function(e) {
		return typeof e.offsetX == 'undefined' ? e.clientX - $(e.target).offset().left : e.offsetX;
	},
	setposition: function(e) {
		Player.setPosition(Player.getDuration() * this.calcval(e) / this._timeline.width());
	},
	showposition: function(e) {
		var offset = this.calcval(e), playtime = Math.ceil(Player.getDuration() / 1000 * offset / this._timeline.width());
		this._popup.css('left', offset - this._popup.width() / 2).show().text(_.str.sprintf('%d:%02d', playtime / 60, playtime % 60));
	},
	hideposition: function(e) {
		this._popup.hide();
	},
	toggleplayer: function(e) {
		if(Player.isPlaying())
			Player.togglePause();
		else
			Player.play();
	},
	stopplayer: function(e) {
		Player.stop();
	},
	togglemute: function(e) {
		Player.toggleMute();
	},
	changevolume: function(e) {
		Player.setVolume($(e.target).val());
	},
	changevisible: function(e) {
		var visibler = $("#controls-visibility");

		if(!visibler.hasClass('active') ^ this.$el.hasClass('shown'))
			this.$el.toggleClass('shown'), visibler.toggleClass('active');

		visibler.attr('title', 'Controls visibility: ' + (this.$el.hasClass('shown') ? 'always' : 'partly'));
	},

	changetrack: function() {
		var track = Player.get('track');

		if(track) {
			this.$('div.oninit').addClass('active');
			this._nowplaying.text(
					track.get('stream') ?
						_.str.sprintf('%s \u2014 %s', track.get('title'), track.get('audiofile')) :
						_.str.sprintf('%s \u2014 %s \u2014 %s', track.get('title'), track.get('album'), track.get('artist'))
			);

			if(track.get('stream'))
				$("#controls-seekbar").removeClass('active');
		} else {
			this.$('div.oninit').removeClass('active');
			this._nowplaying.text('');
		}
	},
	handleload: function() {
		var loadtime = Math.ceil(Player.getDuration() / 1000);
		this._status_duration.text(
				_.str.sprintf('%d:%02d', loadtime / 60, loadtime % 60)
		);
		this._loaded.width((100 * Player.getLoaded()) + '%');
	},
	handlepos: function() {
		var playtime = Math.ceil(Player.getPosition() / 1000);
		this._status_played.text(
				_.str.sprintf('%d:%02d', playtime / 60, playtime % 60)
		);
		this._played.width((100 * Player.getPlayed()) + '%');
	},
	handleplay: function() {
		if(Player.isPaused()) {
			this.$('div.onresume').removeClass('active');
			this._playback.removeClass('pause');
		} else {
			this._playback.addClass('pause');
			this.$('div.onresume').addClass('active');
		}

		if(Player.isPlaying())
			this.$('div.onplay').addClass('active');
		else
			this.$('div.onplay').removeClass('active');
	},
	handlevolume: function() {
		$("#controls-volslider").val(Player.getVolume());
	},
	handlemute: function() {
		var volmute = $("#controls-volmute");

		if(volmute.hasClass('muted') ^ Player.isMuted())
			volmute.toggleClass('muted')
					.attr('title', volmute.hasClass('muted') ? 'Unmute volume' : 'Mute volume');
	}
});


//this.onPosition(this.duration - 800, function() {
//	this._iO = {};
//	this._autofinish = true;
//	this._onfinish = function() {
//		this.destruct();
//	};
//}