var player = {
	sound: {},
	data: null,

	muted: false,
	stopped: false,
	volume: 10,

	next: function() {
		var track = modules.history.next();

		if(!track)
		{
			track = modules.order.next();

			if(!track)
				return;

			modules.history.push(track);
		}

		this.select(track);
	},
	prev: function() {
		var track = modules.history.prev();

		if(!track)
		{
			track = modules.order.prev();

			if(!track)
				return;

			modules.history.unshift(track);
		}

		this.select(track);
	},
	select: function(track) {

		var stopped = this.stopped, muted = this.muted, volume = this.volume;

		if(this.sound._iO)
		{
			stopped = this.sound.playState == 0 && (this.sound.position != this.sound.duration);
			muted = this.sound.muted;
			volume = this.sound.volume;

			$.event.trigger('Player-destruct');

			if(!this.sound._autofinish)
			{
				this.sound.stop();
				this.sound.destruct();
			}
		}

		this.data = track;
		this.sound = soundManager.createSound(track.hash, track.audiofile);

		if(this.sound.readyState == 0)
			this.sound.load();

		$.event.trigger('Player-construct');

		if(volume)
			this.setVolume(volume);

		if(muted)
			this.sound.mute();

		if(!stopped)
			this.play();
	},
	isSelected: function() {
		return !!this.sound.play;
	},
	play: function() {
		if(!this.sound.play)
			return;

		this.sound.play();

		$.event.trigger('Player-play');
	},
	isPlaying: function() {
		return this.sound.playState == 1;
	},
	togglePause: function() {
		if(!this.sound.togglePause)
			return;

		this.sound.togglePause();

		$.event.trigger('Player-togglePause');
		if(this.isPaused())
			$.event.trigger('Player-pause');
		else
			$.event.trigger('Player-unpause');
	},
	isPaused: function() {
		return this.sound.paused;
	},
	stop: function() {
		if(!this.sound.stop)
			return;

		this.sound.stop();

		$.event.trigger('Player-stop');
	},
	isStopped: function() {
		return this.sound.playState == 0;
	},
	setVolume: function(volume) {
		if(!this.sound.setVolume)
			return;

		this.sound.setVolume(volume);
	},
	getVolume: function() {
		return this.sound.volume;
	},
	toggleMute: function() {
		if(!this.sound.toggleMute)
			return;

		this.sound.toggleMute();

		$.event.trigger('Player-toggleMute');
		if(this.isMuted())
			$.event.trigger('Player-mute');
		else
			$.event.trigger('Player-unmute');
	},
	isMuted: function() {
		return this.sound.muted;
	},
	setPosition: function(msec) {
		if(!this.sound.setPosition)
			return;

		this.sound.setPosition(msec);
	},
	getPosition: function() {
		return this.sound.position;
	},
	getDuration: function() {
		return this.sound.duration;
	},
	getBytesLoaded: function() {
		return this.sound.bytesLoaded;
	},
	getBytesTotal: function() {
		return this.sound.bytesTotal;
	},
	getContainer: function() {
		return $("#player");
	}
};



$(function() {
	var playerDiv = player.getContainer();

	/* Timeline */
	playerDiv.on({
		'click': function(e) {
			player.setPosition(player.getDuration() * e.data.val(e) / e.data.loaded.width());
		},
		'mousemove': function(e) {
			var offset = e.data.val(e), playtime = Math.ceil(player.getDuration() / 1000 * offset / e.data.timeline.width());
			e.data.popup.css('left', offset - e.data.popup.width() / 2).show().text(stringifyTime(playtime));
		},
		'mouseout': function(e) {
			e.data.popup.hide();
		}

	}, '#controls-seekbar.active', {
		popup: $("#controls-popup"),
		loaded: $("#controls-loaded"),
		timeline: $("#controls-timeline"),
		val: function(e) {
			return typeof e.offsetX == 'undefined' ? e.clientX - $(e.target).offset().left : e.offsetX;
		}
	});

	/* Prev, Next */
	playerDiv.on('click', '#controls-prev.active', function() {
		player.prev();
	})
	.on('click', '#controls-next.active', function() {
		player.next();
	});

	/* Play, Stop */
	playerDiv.on('click', '#controls-playback.active', function() {
		if(player.isPlaying())
			player.togglePause();
		else
			player.play();
	})
	.on('click', '#controls-stop.active', function() {
		player.stop();
	});

	/* Mute */
	$("#controls-volmute").on({
		click: function() {
			player.toggleMute();

			var volmute = $(this);
			if(volmute.hasClass('muted') ^ player.isMuted())
				volmute.toggleClass('muted').mouseenter();
		},
		mouseenter: function() {
			var volmute = $(this);
			volmute.attr('title', volmute.hasClass('muted') ? 'Unmute volume' : 'Mute volume');
		}
	});

	/* Volume */
	$("#controls-volslider").on({
		change: function() {
			player.setVolume($(this).val());
		}
	});

	/* Visibility */
	$("#controls-visibility").on({
		click: function() {
			if(!$(this).hasClass('active') ^ playerDiv.hasClass('shown'))
				playerDiv.toggleClass('shown'), $(this).toggleClass('active');

			$(this).mouseenter();
		},
		mouseenter: function() {
			$(this).attr('title', 'Controls visibility: ' + (playerDiv.hasClass('shown') ? 'always' : 'partly'));
		}
	});

	/**
	 * Struct switcher
	 */
	$("#controls-structures").on({
			click: function() {
				var name = $(this).attr('id').replace('controls-', ''), struct = modules[name];
				var current = struct.get(), all = struct.getAll(), key = all.indexOf(current) + 1;

				if(key < 0)
					return;

				struct.set(all[key % all.length]);
				$(this).removeClass(current).addClass(struct.get()).mouseenter();
			},
			mouseenter: function() {
				var name = $(this).attr('id').replace('controls-', ''), struct = modules[name];
				$(this).attr('title', name[0].toUpperCase() + name.substr(1) + ': ' + struct.get());
			}
		}, 'div');

	/**
	 * Saved state restoration
	 */
	var json = localStorage.getItem('player'), state = {};

	if(json)
		state = JSON.parse(json);

	/* Volume mute */
	if(state.muted)
		$("#controls-volmute").addClass('muted'), player.muted = true;

	/* Volume setting button */
	if(state.volume)
		$("#controls-volslider").val(state.volume), player.volume = state.volume;
	else
		player.volume = $("#controls-volslider").val();

	/* Stop setting button */
	if(state.stopped)
		player.stopped = true;

	/* Visibility setting button */
	if(state.visibility)
		$("#controls-visibility").click();

	/* Save */
	$(window).bind('unload', function() {
		var state = {
			muted: player.isMuted() ? 1 : '',
			stopped: player.isStopped() ? 1 : '',
			volume: player.getVolume(),
			visibility: $("#controls-visibility").hasClass('active') ? 1 : ''
		};

		localStorage.setItem('player', JSON.stringify(state));
	});
});