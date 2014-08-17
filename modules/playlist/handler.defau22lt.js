modules.playlist.register('defau22lt', function() {
	var loader, container, playlist;

	var artist_sort = function(a, b) {
		var sort_re = new RegExp('^(The|A) ', 'i');
		return a.title.replace(sort_re, '') > b.title.replace(sort_re, '') ? 1 : -1;
	};

	var album_sort = function(a, b) {
		return a.year - b.year;
	};

	var track_sort = function(a, b) {
		return a.track_number - b.track_number;
	};

	return {
		init: function() {
			/* Load onload */
			loader = modules.library.loadLibrary().pipe(function(library) {
				return playlist = modules.library.makePlaylist(library, artist_sort, album_sort, track_sort);
			});

			/* Library container */
			container = $("<div />").attr({
				'class': 'no-select full-height container'
			}).appendTo('body').resize();

			/* Menu link */
			modules.menu.addLink('playlist', 'Music', container, {
				position: 0,
				open: true
			});

			loader.done(function(playlist) {
				modules.view.setView(container, playlist);
			});
		},
		util: function() {
			container.remove();
			modules.menu.removeLink('playlist');
		},
		getLoader: function() {
			return loader;
		},
		getContainer: function() {
			return container;
		},
		getPlaylist: function() {
			return playlist;
		},
		selectTrack: function(track) {
			player.select(track);
			modules.history.push(track);
		}
	};
});
modules.playlist.set('defau22lt');