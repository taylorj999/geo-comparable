var config = require('../config/config');

var customMapnikify = require('./customMapnikify');

var mapnik = require('mapnik');

var getJSONFromStringOrJSON = require('../utils/smartparse');

var mapnikify = new customMapnikify();

function mapEngine() {
	mapnik.register_default_input_plugins();
	mapnik.register_default_fonts();
	mapnik.register_system_fonts();
	"use strict";
};

/**
 * fromStringPromise: a wrapper for the mapnik fromString function that converts the callback into a Promise.
 * 
 * @param	map		An initialized mapnik.Map object.
 * @param	xml		A string containing a valid mapnikified geoJSON xml document.
 * 
 * @return	The mapnik.Map object, loaded with the geoJSON xml.
 */
mapEngine.prototype.fromStringPromise = function fromStringPromise(map,xml) {
	return new Promise(function(resolve,reject) {
		map.fromString(xml,function(err,res) {
			if (err) { console.log(err); reject(new Error("Error generating mapnik map from XML")); }
			else { resolve(map); }
		});
	});
};

/**
 * generateBoundingBox: Given an x/y point and a radius, generate a valid geospatial bounding box.
 * 
 * Because mapnik uses "web mercator" to actually define map bounding boxes, it is necessary to convert latitude and longitude
 * to "web mercator" coordinates in order to show the map properly.
 * 
 * @param	x		Center point of bounding box, latitude.
 * @param	y		Center point of bounding box, longitude.
 * @param	radius	Radius of bounding box, in miles (can be fractional, e.g. 0.5).
 * 
 * @return  Array	The upper left and lower right coordinates of the bounding box.
 */
mapEngine.prototype.generateBoundingBox = function generateBoundingBox(x,y,radius) {
	const eqRadius = 6378137;
	const eqShift = Math.PI * eqRadius;
	const radiusInDegrees = radius / 69;
	let x1 = (x-radiusInDegrees) * (eqShift / 180);
	let y1 = (y-radiusInDegrees);
	y1 = Math.log(Math.tan((90.0 + y1) * Math.PI / 360.0)) / (Math.PI / 180.0);
	y1 = y1 * eqShift / 180;
	let x2 = (x+radiusInDegrees) * eqShift / 180;
	let y2 = (y+radiusInDegrees);
	y2 = Math.log(Math.tan((90.0 + y2) * Math.PI / 360.0)) / (Math.PI / 180.0);
	y2 = y2 * eqShift / 180;
	return [x1,y1,x2,y2];
}

/**
 * renderMapFromXML: Generates a map image using the mapnik library.
 * 
 * This function handles the several steps required to go from geoJSON data to a final generated image using mapnik. 1. Create a new
 * Map object and load it with the provided geospatial data. 2. Generate the bounding box limit of the map. 3. Create a new Image
 * object and render the map into it.
 * 
 * @param	geoXML			A string containing a valid mapnikified geoJSON xml document.
 * @param	centerpoint		A JSON object representing a geoJSON point.
 * @param	radius			Radius of map to be generated around the point represented by centerpoint.
 * 
 * @return	Buffer			A binary buffer object containing the PNG image of the generated map.
 */
mapEngine.prototype.renderMapFromXML = function renderMapFromXML(geoXML,centerpoint,radius) {
	var self=this;
	return new Promise((resolve, reject) => {
		let map = new mapnik.Map(512,512,'+init=epsg:3857');
		self.fromStringPromise(map,geoXML)
			.then(function(newMap) {
				let boundingBox = null;
				try {
					let center = getJSONFromStringOrJSON(centerpoint);
					let x = center.coordinates[0];
					let y = center.coordinates[1];
					boundingBox = self.generateBoundingBox(x,y,radius);
				} catch (e) { console.error(e); };
				if (boundingBox != null) {
					newMap.zoomToBox(boundingBox);
				} else {
					newMap.zoomAll();
				}
				let image = new mapnik.Image(newMap.width,newMap.height);
    			newMap.render(image,{},function(err, image) {
    				if (err) { reject(err); }
    				else {
    					let buffer = image.encodeSync('png');
    					resolve(buffer);
    				}
      			    });
    		    }, function(err) { reject(err); })
    		.catch(function(err) {
    			reject(err);
    		});
	});
}

/**
 * mapnikifyResults: Wrapper for the mapnikify function that converts geoJSON to geoXML
 * 
 * Takes in the results of the propertyDAO search function directly. Any preprocessing of the result sets should take place here.
 * 
 * @see			customMapnikify.js
 * 
 * @param		resultSet					Object containing the results of the propertyDAO search function.
 * @param		resultSet.parcelResultSet	Array of parcel (property) data.
 * @param		resultSet.streetResultSet	Array of street data.
 * @param		radius						Radius of map to be generated (in miles).
 * 
 * @return		String						String containing the geoXML document representing the provided data.
 */
mapEngine.prototype.mapnikifyResults = function mapnikifyResults(resultSet, radius) {
	return new Promise((resolve,reject) => {
		mapnikify.generateXML(resultSet.parcelResultSet, resultSet.streetResultSet, radius)
		          .then(function(xml) { resolve(xml); },
		        		function(err) { console.error(err); reject(new Error('Error in mapnikify'));})
		          .catch(function(err) {
		        	  console.error(err); reject(new Error('Error in mapnikify'));
		          });
	});
}

module.exports.mapEngine = mapEngine;