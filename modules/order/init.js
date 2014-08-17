function Order() {

}

Order.prototype = new Structurer('next', 'prev');
Order.prototype.constructor = Order;

modules.order = new Order();
