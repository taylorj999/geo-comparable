var mapEngine = require('./mapEngine').mapEngine;

module.exports = exports = function(app) {
	"use strict";
		
	app.get('/testRender', (req,res) => {
		var gen = new mapEngine();

		gen.renderTestMap().then(function(image) { res.type('png'); res.send(image); }, function(err) { throw (err); });
	});
	
	
};