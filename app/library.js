/**
 * @uses Artists, Albums, Tracks
 */
var Library = {
	artists: new Artists(),
	albums: new Albums(),
	tracks: new Tracks(),

	getAlbum: function(track) {
		return this.albums.get(track.get('album_hash'));
	},
	getAlbums: function(artist) {
		return this.albums.where({
			artist_hash: artist.id
		});
	},
	getTracks: function(album) {
		return this.tracks.where({
			album_hash: album.id
		});
	},
	getArtist: function(album) {
		return this.artists.get(album.get('artist_hash'));
	},
	getView: function(object) {
		if('view' in object)
			return object.view;

		if(object instanceof Track)
			return object.view = new TrackView({
				model: object,
				tagName: 'div',
				className: 'track'
			});

		if(object instanceof Album)
			return object.view = new AlbumView({
				model: object,
				tagName: 'div',
				className: 'album'
			});

		if(object instanceof Artist)
			return object.view = new ArtistView({
				model: object,
				tagName: 'div',
				className: 'artist'
			});

		if(object instanceof Tracks)
			return object.view = new TracksView({collection: object});

		if(object instanceof Albums)
			return object.view = new AlbumsView({collection: object});

		if(object instanceof Artists)
			return object.view = new ArtistsView({collection: object});
	}
};