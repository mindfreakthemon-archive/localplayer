modules.order.register('linear', function() {
	return {
		next: function(prev) {
			var current = player.data;

			if(!current)
				return null;

			var closest = prev ? 'prev' : 'next', position = prev ? 'last' : 'first';

			var track = current[closest];
			if(track)
				return track;

			var album = current.album_link[closest];
			if(album)
				return album[position + '_track'];

			var artist = current.artist_link[closest];
			if(artist)
				return artist[position + '_album'][position + '_track'];

			return null;
		},
		prev: function() {
			return this.next(true);
		}
	};
});