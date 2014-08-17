$(function() {
	var playlist = modules.playlist;

	/**
	 * State restoration
	 */
	var state = playlist.getState();

	/**
	 * Replay on reload
	 */
	if(system.playlist.replayOnReload && state.nowplaying) {
		playlist.getLoader().done(function(library) {
			var nowplaying;
			
			library.tracks.map(function(track) {
				if(state.nowplaying == track.hash)
					nowplaying = track;
			})
	
			if(nowplaying)
				soundManager.onready(function() {
					player.select(nowplaying), modules.history.push(nowplaying);
				});					
		});
	}

	/**
	 * State saving
	 */
	playlist.setStateSaver(function() {
		return {
			nowplaying: player.data ? player.data.hash : null
		};
	});
});