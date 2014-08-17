modules.background.register('squarepics', function() {
	var div;

	return {
		init: function() {
			div = $("<div />").attr('id', 'background-img')
				.addClass('img-square')
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
			var data = player.data;

			this.hide();

			$.get('http://ws.audioscrobbler.com/2.0/?method=artist.getimages&artist=' + encodeURIComponent(data.artist) + '&limit=' + system.background.numberOfImages + '&api_key=' + system.lastfm.key, function(data) {
				div.html('');

				$(data).find('image').each(function() {
					var src = $(this).find('size[name=largesquare]').text();
					div.append($("<img />").attr('src', src).fadeTo('fast', system.background.opacity));
				});
			}, 'xml');
		},
		hide: function() {
			div.children('img').stop(true, true).fadeOut('fast');
		}
	};
});