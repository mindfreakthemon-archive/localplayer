function Lyrics() {

}

Lyrics.prototype = new Structurer('show', 'hide');
Lyrics.prototype.constructor = Lyrics;

modules.lyrics = new Lyrics();