var mapEngine = require('./mapEngine').mapEngine;
var autocompleteEngine = require('./autocompleteEngine').autocompleteEngine;
var propertyDAO = require('./propertyDAO').propertyDAO;
var config = require('../config/config');
var sanitize = require('../utils/sanitize').sanitize;
var sanitizers = require('../config/sanitizers');

module.exports = function(app, dataSource) {
	"use strict";

	/*
	app.get('/testRender', (req,res) => {
		var gen = new mapEngine();

		gen.renderTestMap().then(function(image) { res.type('png'); res.send(image); }, function(err) { throw (err); });
	});
	*/
	
	/*
	app.get('/testDatasource', (req,res) => {
		var autoE = new autocompleteEngine();
		
		autoE.getSuggestions('ST%',dataSource)
		     .then(function(rows) {
		 		
		 		res.send("<HTML><BODY>" + rows + "</BODY></HTML>");
		    	 
		     });
	});
	*/
	
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
		    	 res.jsonp({'status':'error','error':'An error occurred getting street name list'});
		     })
		     .catch(function(err) {
		    	console.log(err);
		    	res.jsonp({'status':'error','error':'An error occurred getting street name list'});
		     });
	});
	
	app.post('/api-propsearch', (req,res) => {
		var pDAO = new propertyDAO();
		var sanitizer = new sanitize();
		
		if (req.body.apiKey === undefined) {
			res.jsonp({'status':'error','error':'No API key'});
			return;
		}
		if (req.body.searchString === undefined && req.body.minPrice === undefined && req.body.maxPrice === undefined) {
			res.jsonp({'status':'error','error':'No search parameters'});
			return;
		}
		var streetName = req.body.streetName;
		if (streetName != undefined) { streetName = sanitizer.cleanInput(streetName); }
		var minPrice = req.body.minPrice;
		if (minPrice != undefined) { minPrice = sanitizer.cleanInput(minPrice, sanitizers.numeric); }
		var maxPrice = req.body.maxPrice;
		if (maxPrice != undefined) { maxPrice = sanitizer.cleanInput(maxPrice, sanitizers.numeric); }
		
		pDAO.doPropertySearch(streetName, minPrice, maxPrice, dataSource)
		    .then(function(rows) {
		    	res.jsonp({'status':'success','data':rows});
		    },
		    function(err) {
		    	res.jsonp({'status':'error','error':'An error occurred getting property list'});
		    })
		    .catch(function(err) {
		    	console.log(err);
		    	res.jsonp({'status':'error','error':'An error occurred getting property list'});
		    });
	});
	
	app.get('/generateMap', (req,res) => {
		var gen = new mapEngine();
		var pDAO = new propertyDAO();
		var sanitizer = new sanitize();
		
		if (req.query.propertyId === undefined) {
			res.status(400).send('No property ID');
		}
		var propertyId = req.query.propertyId;
		
		pDAO.doGridSearch(propertyId, dataSource)
		    .then(function(rows) {
		    	return gen.mapnikifyResults(rows[0]);
		    }, 
		    function(err) {
		    	console.error(err);
		    	res.status(400).send('An error occurred while accessing the database');
		    })
		    .then(function(mapnikXML) {
		    	return gen.renderMapFromXML(mapnikXML);
		    },
		    function(err) {
		    	console.error(err);
		    	res.status(400).send('An error occurred while parsing the geoJSON data');
		    })
		    .then(function(image) { res.type('png'); res.send(image); }, 
		    	  function(err) { 
		    	console.error(err);
		    	res.status(400).send('An error occurred while generating the image');
		    })
		    .catch(function(err) {
		    	console.log(err);
		    	res.jsonp({'status':'error','error':'An error occurred getting property list'});
		    });
	});
	
	
};