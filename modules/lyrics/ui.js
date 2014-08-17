$(function() {
	var lyrics = modules.lyrics;

	/**
	 * State restoration
	 */
	var state = lyrics.getState();

	if(state.handler)
		lyrics.set(state.handler);

	/**
	 * UI Applying
	 */
	$("<div />").attr({
		id: 'controls-lyrics',
		'class': 'persistent-button ' + lyrics.get()
	}).appendTo('#controls-structures');

	/**
	 * State saving
	 */
	lyrics.setStateSaver(function() {
		return {
			handler: lyrics.get()
		};
	});
});