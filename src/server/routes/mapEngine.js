var config = require('../config/config');

var mapnikify = require('./mapnikify');
var customMapnikify = require('./customMapnikify');

var mapnik = require('mapnik');

var Promise2 = require('promise');

var testgeojson = {"type": "LineString", "coordinates": [[-82.4496866310505, 35.5915995599292], [-82.4497487278246, 35.5916773944812], [-82.4497053968081, 35.5918605867524], [-82.4496829370215, 35.5920193226531], [-82.4496899113975, 35.592183188315], [-82.4496279260762, 35.5923323091867], [-82.4495304232162, 35.592554624062], [-82.4495191586693, 35.5927190075827], [-82.4495641971038, 35.5929060361562]]};

function mapEngine() {
	mapnik.register_default_input_plugins();
	mapnik.register_default_fonts();
	mapnik.register_system_fonts();
	"use strict";
};

/*
 * fromStringPromise: a wrapper for the mapnik fromString function that converts the callback into a Promise
 * 
 * Expects:
 *   map : an initialized mapnik.Map
 *   xml : a valid mapnikified geoJSON document
 */
mapEngine.prototype.fromStringPromise = function fromStringPromise(map,xml) {
	return new Promise(function(resolve,reject) {
		map.fromString(xml,function(err,res) {
			if (err) { console.log(err); reject(new Error("Error generating mapnik map from XML")); }
			else { resolve(map); }
		});
	});
};

mapEngine.prototype.renderMapFromXML = function renderMapFromXML(geoXML) {
	var self=this;
	return new Promise((resolve, reject) => {
		var map = new mapnik.Map(512,512,'+init=epsg:3857');
		self.fromStringPromise(map,geoXML)
			.then(function(newMap) {
    			newMap.zoomAll();
    			var image = new mapnik.Image(newMap.width,newMap.height);
    			newMap.render(image,{},function(err, image) {
    				if (err) reject(err);
    				var buffer = image.encodeSync('png');
    				resolve(buffer);
      			    });
    		    }, function(err) { reject(err); })
    		.catch(function(err) {
    			reject(err);
    		});
	});
}

mapEngine.prototype.mapnikifyResults = function mapnikifyResults(resultSet) {
	return new Promise((resolve,reject) => {
		customMapnikify(resultSet.parcelResultSet, resultSet.streetResultSet)
		          .then(function(xml) { resolve(xml); },
		        		function(err) { console.error(err); reject(new Error('Error in mapnikify'));})
		          .catch(function(err) {
		        	  console.error(err); reject(new Error('Error in mapnikify'));
		          });
	});
}

module.exports.mapEngine = mapEngine;