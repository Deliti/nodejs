var CONCAT = Array.prototype.concat;

function haha(one,two,three){
	var last = CONCAT.apply(['last'],arguments);
	console.log(last);
}

var Evproxy = function(){

}

Evproxy.prototype.on = function(eventname1,eventname2,callback){
	var args = CONCAT.apply([],arguments);
	console.log(args);
	haha.apply(this,args);
}

var evproxy = new Evproxy();
evproxy.on('one','two','three');