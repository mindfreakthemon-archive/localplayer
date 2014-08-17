function Menu() {
	
}

Menu.prototype = new Structurer('addLink', 'removeLink', 'getContainer');
Menu.prototype.constructor = Menu;

modules.menu = new Menu();




