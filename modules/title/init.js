function Title() {

}

Title.prototype = new Structurer('show', 'hide');
Title.prototype.constructor = Title;

modules.title = new Title();