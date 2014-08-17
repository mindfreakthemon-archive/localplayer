var Player;

$(function() {
	/* for test purpose */
	var container = $("<div />").attr({
		'class': 'no-select full-height container'
	}).appendTo('body').show().resize();
	/* --- */

	Player = new PlayerSkeleton();

	new ArtistsView({
		collection: Library.artists,
		el: container
	});

	new PlayerView();

	$.ajax(system.library.queryLocation, {
		data: {
			query: 'libraryn',
			library: system.library.library
		},
		dataType: 'json'
	}).pipe(function(data) {
		Library.tracks.reset(data.tracks);
		Library.albums.reset(data.albums);
		Library.artists.reset(data.artists);
	});
});