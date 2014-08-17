function Playlist() {
	$.extend(system, {
		playlist: {
			replayOnReload: true
		}
	});
}

Playlist.prototype = new Structurer('getPlaylist', 'getContainer', 'getLoader', 'selectTrack');
Playlist.prototype.constructor = Playlist;

modules.playlist = new Playlist();