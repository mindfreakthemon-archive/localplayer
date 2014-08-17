modules.library.register('default', function() {
	var updaterDiv, library;

	return {
		init: function() {
			updaterDiv = $("<div />").attr({
				id: 'controls-libupd',
				'class': 'transitional-button active'
			}).prependTo('#controls-functions')
			.on({
				click: function() {
					var btn = $(this);

					if(btn.hasClass('active'))
					{
						btn.removeClass('active');
						btn.mouseenter();

						$.ajax(system.library.updateLocation, {
							data: {
								library: system.library.library
							},
							timeout: 600000,
							dataType: 'json'
						}).always(function() {
							btn.addClass('active');
							btn.mouseenter();
						});
					}
				},
				mouseenter: function() {
					var self = $(this);

					if(self.hasClass('active'))
						self.attr('title', 'Update library');
					else
						self.attr('title', 'Updating..');
				}
			});
		},
		util: function() {
			updaterDiv.remove();
		},
		loadLibrary: function() {
			if(library)
				return $.extend({}, library);

			return $.ajax(system.library.queryLocation, {
				data: {
					query: 'library',
					library: system.library.library
				},
				dataType: 'json'
			}).pipe(function(data) {
				library = data;
				return $.extend({}, data);
			});
		},
		makePlaylist: function(library, artist_sort, album_sort, track_sort) {
			var first_artist, last_artist;

			library.albums = [];
			library.tracks = [];
			library.artists.sort(artist_sort).map(function(artist) {
				var first_album, last_album;

				artist.albums.sort(album_sort).map(function(album) {
					var first_track, last_track;

					album.tracks.sort(track_sort).map(function(track) {
						if(!first_track)
							first_track = track;
						else
							last_track.next = track;

						track.prev = last_track;
						last_track = track;

						library.tracks.push(track);

						track.album_link = album;
						track.artist_link = artist;
						track.library_link = library;
					});

					if(!first_album)
						first_album = album;
					else
						last_album.next = album;

					album.prev = last_album;
					last_album = album;

					library.albums.push(album);

					album.artist_link = artist;
					album.library_link = library;
					album.first_track = first_track;
					album.last_track = last_track;
				});

				if(!first_artist)
					first_artist = artist;
				else
					last_artist.next = artist;

				artist.prev = last_artist;
				last_artist = artist;

				artist.library_link = library;
				artist.first_album = first_album;
				artist.last_album = last_album;
			});

			library.first_artist = first_artist;
			library.last_artist = first_artist;

			return library;
		},
		unmakePlaylist: function(library) {

		}
	};
});