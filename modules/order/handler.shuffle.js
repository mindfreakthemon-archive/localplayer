modules.order.register('shuffle', function() {
	var exclude = [];

	return {
		next: function() {
			var all_tracks = modules.playlist.getPlaylist().tracks;

			if(!all_tracks.length)
				return null;

			var tracks = all_tracks.diff(exclude);

			if(tracks.length == 0)
				exclude.length = 0, tracks = all_tracks.tracks;

			var track = tracks.random();
			exclude.push(track);

			return track;
		},
		prev: function() {
			return this.next();
		}
	};
});