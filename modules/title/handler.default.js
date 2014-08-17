modules.title.register('default', function() {
	var title, link;

	return {
		init: function() {
			link = $("<link />").attr({
				rel: 'shortcut icon'
			})
			.appendTo('head')
			.on('Player-construct', $.proxy(function() {
				this.show();
			}, this));

			if(player.isPlaying())
				this.show();
		},
		util: function() {
			link.remove();
			this.hide();
		},
		show: function() {
			if(!title)
				title = document.title;

			var data = player.data;

			document.title = sprintf('%s \u2014 %s', data.title, data.artist);
			link.attr({
				href: data.cover || '/img/defacover.jpg',
				type: data.cover_mime || 'image/jpeg'
			});
		},
		hide: function() {
			if(!title)
				return;

			document.title = title;
			title = null;
		}
	};
});

