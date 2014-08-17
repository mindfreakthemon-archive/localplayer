$(function() {
	var history = modules.history;

	/**
	 * State restoration
	 */
	var state = history.getState();

	if(state.handler)
		history.set(state.handler);

	/**
	 * UI Applying
	 */
	$("<div />").attr({
		id: 'controls-history',
		'class': 'persistent-button ' + history.get()
	}).appendTo('#controls-structures');

	/**
	 * State saving
	 */
	history.setStateSaver(function() {
		return {
			handler: history.get()
		};
	});
});