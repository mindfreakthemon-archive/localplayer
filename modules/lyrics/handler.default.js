modules.lyrics.register('default', function() {
	var div;

	return {
		init: function() {
			div = $("<div />").attr('id', 'lyrics-displayer')
				.hide()
				.appendTo('body')
				.on('Player-construct', $.proxy(function() {
					this.show();
				}, this));

			if(player.isPlaying())
				this.show();
		},
		util: function() {
			div.remove();
		},
		show: function() {
			this.hide();

			var track = player.data;
			if(track.lyrics)
			{
				$.get(track.lyrics, function(lyrics) {
					div.html('').text(lyrics).stop(true, true).fadeIn('fast');
				}, 'text');
			}
		},
		hide: function() {
			div.stop(true, true).fadeOut('fast');
		}
	};
});

