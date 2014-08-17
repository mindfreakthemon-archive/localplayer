$(function() {
	var background = modules.background;

	/**
	 * State restoration
	 */
	var state = background.getState();

	if(state.handler)
		background.set(state.handler);

	/**
	 * UI Applying
	 */
	$("<div />").attr({
		id: 'controls-background',
		'class': 'persistent-button ' + background.get()
	}).appendTo('#controls-structures');

	/**
	 * State saving
	 */
	background.setStateSaver(function() {
		return {
			handler: background.get()
		};
	});
});