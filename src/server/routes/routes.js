var mapEngine = require('./mapEngine').mapEngine;
var autocompleteEngine = require('./autocompleteEngine').autocompleteEngine;
var config = require('../config/config');
var sanitize = require('../utils/sanitize').sanitize;

module.exports = function(app, dataSource) {
	"use strict";
	
	app.get('/testRender', (req,res) => {
		var gen = new mapEngine();

		gen.renderTestMap().then(function(image) { res.type('png'); res.send(image); }, function(err) { throw (err); });
	});
	
	app.get('/testDatasource', (req,res) => {
		var autoE = new autocompleteEngine();
		
		autoE.getSuggestions('ST%',dataSource)
		     .then(function(rows) {
		 		
		 		res.send("<HTML><BODY>" + rows + "</BODY></HTML>");
		    	 
		     });
	});
	
	app.post('/api-autocomplete', (req,res) => {
		var autoE = new autocompleteEngine();
		var sanitizer = new sanitize();
		
		if (req.body.apiKey === undefined) {
			res.jsonp({'status':'error','error':'No API key'});
			return;
		}
		if (req.body.searchString === undefined) {
			res.jsonp({'status':'error','error':'Received null searchstring in API'});
			return;
		}
		var searchString = sanitizer.cleanInput(req.body.searchString) + '%';
		searchString = searchString.toUpperCase();
		
		autoE.getSuggestions(searchString,dataSource)
		     .then(function(rows) {
		    	 res.jsonp({'status':'success','data':rows});
		     },
		     function(err) {
		    	 res.jsonp({'status':'error','error':err});
		     });
	});
};