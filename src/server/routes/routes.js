var mapEngine = require('./mapEngine').mapEngine;
var autocompleteEngine = require('./autocompleteEngine').autocompleteEngine;
var propertyDAO = require('./propertyDAO').propertyDAO;
var config = require('../config/config');
var sanitize = require('../utils/sanitize').sanitize;
var sanitizers = require('../config/sanitizers');

module.exports = function(app, dataSource) {
	"use strict";
	
	app.post('/api-autocomplete', (req,res) => {
		let autoE = new autocompleteEngine();
		let sanitizer = new sanitize();
		
		if (req.body.apiKey === undefined) {
			res.jsonp({'status':'error','error':'No API key'});
			return;
		}
		if (req.body.searchString === undefined) {
			res.jsonp({'status':'error','error':'Received null searchstring in API'});
			return;
		}
		let searchString = sanitizer.cleanInput(req.body.searchString) + '%';
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
		let pDAO = new propertyDAO();
		let sanitizer = new sanitize();
		
		if (req.body.apiKey === undefined) {
			res.jsonp({'status':'error','error':'No API key'});
			return;
		}
		if (req.body.searchString === undefined && req.body.minPrice === undefined && req.body.maxPrice === undefined) {
			res.jsonp({'status':'error','error':'No search parameters'});
			return;
		}
		let streetName = req.body.streetName;
		if (streetName != undefined) { streetName = sanitizer.cleanInput(streetName); }
		let minPrice = req.body.minPrice;
		if (minPrice != undefined) { minPrice = sanitizer.cleanInput(minPrice, sanitizers.numeric); }
		let maxPrice = req.body.maxPrice;
		if (maxPrice != undefined) { maxPrice = sanitizer.cleanInput(maxPrice, sanitizers.numeric); }
		let resultsPage = req.body.resultsPage;
		if (resultsPage != undefined) { resultsPage = sanitizer.cleanInput(resultsPage, sanitizers.numeric); }
		
		pDAO.doPropertySearch(streetName, minPrice, maxPrice, resultsPage, dataSource)
		    .then(function(resultsWithCount) {
		    	res.jsonp({'status':'success','data':resultsWithCount.data,'count':resultsWithCount.count});
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
		let gen = new mapEngine();
		let pDAO = new propertyDAO();
		let sanitizer = new sanitize();
		
		let propertyId = req.query.propertyId;
		if (propertyId!=undefined) { propertyId = sanitizer.cleanInput(propertyId,sanitizers.numeric); }
		else { res.status(400).send('No property ID'); }

		let radius = req.query.radius;
		if (radius!=undefined) { radius = sanitizer.cleanInput(radius); }
		else { radius = 0.5; }
		
		let centerpoint = null;
		
		pDAO.doGridSearch(propertyId, radius, dataSource)
		    .then(function(combinedResultSet) {
		    	centerpoint = combinedResultSet.centerpoint;
		    	return gen.mapnikifyResults(combinedResultSet,radius);
		    }, 
		    function(err) {
		    	console.error(err);
		    	res.status(400).send('An error occurred while accessing the database');
		    })
		    .then(function(mapnikXML) {
		    	return gen.renderMapFromXML(mapnikXML, centerpoint, radius);
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