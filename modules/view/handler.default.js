modules.view.register('default', function() {

	var artist_default = $('<div class="artist">\
				<div class="artist-title"><span>{artist}</span></div>\
			</div>');

	var album_default = $('<div class="album">\
				<table>\
					<tr>\
						<td rowspan="2" class="album-cover"><img src="/img/defacover.jpg" /></td>\
						<td class="album-title"><span>{album}<span></td>\
					</tr>\
					<tr><td class="album-additional">{info}</td></tr>\
				</table>\
			</div>');

	var track_default = $('<div class="track">\
				<table>\
					<tr>\
						<td class="track-number">{number}</td>\
						<td class="track-title"><span>{title}</span></td>\
						<td class="track-stream">{stream}</td>\
						<td class="track-rating"><div></div><div></div></td>\
						<td class="track-options">\
							<div class="persistent-button editor-track-edit" title="Edit"></div>\
						</td>\
					</tr>\
				</table>\
			</div>');

	var appendScrollFix = function(container, parent, child) {
		var height = container[0].scrollHeight;
		parent.append(child);
		if(child.position().top < 0)
			container.scrollTop(container.scrollTop() + container[0].scrollHeight - height);
	};

	var setNowplaying = function(container) {
		unsetNowplaying(container);

		var data = player.data;
		if(data)
			$(['#' + data.artist_link.hash, data.album_link.hash, data.hash].join(', #'), container).addClass('nowplaying');
	},
	unsetNowplaying = function(container) {
		$("div.nowplaying", container).removeClass('nowplaying');
	};

	var toggleArtists = function(container, library, only_show) {
		if(container.hasClass('expanded'))
		{
			if(!only_show)
				container.removeClass('expanded').find('div.artist').remove();

			return;
		}

		container.addClass('expanded');

		/* Injecting artists */
		var artist;

		library.artists.map(function(data) {
			artist = artist_default.clone().data({
				link: data
			}).attr('id', data.hash);

			artist.find('div.artist-title > span').text(data.title);

			appendScrollFix(container, container, artist);
		});
	},
	toggleAlbums = function(container, artist, only_show) {
		var artist_div = $("#" + artist.hash, container);

		if(artist_div.hasClass('expanded'))
		{
			if(!only_show)
				artist_div.removeClass('expanded').find('div.album').remove();

			return;
		}

		artist_div.addClass('expanded');

		/* Injecting albums */
		var album;

		artist.albums.map(function(data) {
			album = album_default.clone().data({
				link: data
			}).attr('id', data.hash);

			var addit = [];
			if(data.year)
				addit.push('released: ' + data.year);
			if(data.genre)
				addit.push('genre: ' + data.genre);
			addit.push('tracks: ' + data.count);
			album.find('td.album-title > span').text(data.title);
			album.find('td.album-additional').text(addit.join(' | ') || '');
			if(data.cover)
				album.find('td.album-cover > img').attr('src', data.cover);

			appendScrollFix(container, artist_div, album);
		});
	},
	toggleTracks = function(container, album, only_show) {
		var album_div = $("#" + album.hash, container);

		if(album_div.hasClass('expanded'))
		{
			if(!only_show)
				album_div.removeClass('expanded').find('div.track').remove();

			return;
		}

		album_div.addClass('expanded');

		/* Injecting tracks */
		var track;

		album.tracks.map(function(data) {
			track = track_default.clone().data({
				link: data
			}).attr('id', data.hash);

			track.find('td.track-title > span').text(data.title);
			track.find('td.track-number').text(data.track_number || '');
			track.find('td.track-stream').text(data.stream ? 'stream' : data.playtime_string + ' @ ' + data.bitrate_string);
			track.find('td.track-rating').addClass('rating-' + data.rating);

			appendScrollFix(container, album_div, track);
		});
	},
	showNowplaying = function(container) {
		var data = player.data;

		if(!data)
			return;

		toggleAlbums(container, data.artist_link, true);
		toggleTracks(container, data.album_link, true);
		setNowplaying(container);

		var track = $("#" + data.hash, container);

		if(track.length)
		{
			var offset = track.offset().top - container.offset().top, height = container.outerHeight(true);
			if(offset < 0 || offset > height)
				container.scrollTop(container.scrollTop() + offset - height / 2);
		}
	};

	return {
		setView: function(container, library) {
			/* Play track on click */
			container.on('click', 'td.track-title > span', function() {
				var track = $(this).closest('div.track').data('link');
				modules.playlist.selectTrack(track);
			});

			/* Albums & Artists toggling */
			container.on('click', 'div.artist-title > span', function() {
				var artist = $(this).closest('div.artist').data('link');

				toggleAlbums(container, artist);
				setNowplaying(container);
			})
			.on('click', 'td.album-title > span', function() {
				var album = $(this).closest('div.album').data('link');

				toggleTracks(container, album);
				setNowplaying(container);
			});

			/* Helpers for nowplaying */
			container.on('Player-construct', function() {
				setNowplaying(container);
			})
			.on('Player-destruct', function() {
				unsetNowplaying(container);
			});

			toggleArtists(container, library);

			/**
			* Move to current
			*/
			if(system.view.moveToCurrent)
			{
				$("<div />").attr({
					id: 'controls-movetocurrent',
					'class': 'transitional-button oninit'
				}).prependTo('#controls-functions')
				.on({
					click: function() {
						if($(this).hasClass('active'))
							showNowplaying(container);
					},
					mouseenter: function() {
						var self = $(this);

						if(self.hasClass('active'))
							self.attr('title', 'Move to currently playing track');
						else
							self.removeAttr('title');
					},
					'Player-construct': function() {
						if(system.view.moveToCurrentOnPlay)
							$(this).click();
					}
				});
			}

		},
		unsetView: function(container) {
			container.off('click Player-construct Player-destruct').html('');

			if(system.view.moveToCurrent)
				$("#controls-movetocurrent").remove();
		}
	};
});