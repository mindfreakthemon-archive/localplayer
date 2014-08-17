$(function() {
	var order = modules.order;

	/**
	 * State restoration
	 */
	var state = order.getState();

	if(state.handler)
		order.set(state.handler);

	/**
	 * UI Applying
	 */
	$("<div />").attr({
		id: 'controls-order',
		'class': 'persistent-button ' + order.get()
	}).appendTo('#controls-structures');

	/**
	 * State saving
	 */
	order.setStateSaver(function() {
		return {
			handler: order.get()
		};
	});
});