var config = require('../config/config');

var mapnikify = require('./mapnikify');

var mapnik = require('mapnik');

var Promise2 = require('promise');

var testgeojson = {"type": "LineString", "coordinates": [[-82.4496866310505, 35.5915995599292], [-82.4497487278246, 35.5916773944812], [-82.4497053968081, 35.5918605867524], [-82.4496829370215, 35.5920193226531], [-82.4496899113975, 35.592183188315], [-82.4496279260762, 35.5923323091867], [-82.4495304232162, 35.592554624062], [-82.4495191586693, 35.5927190075827], [-82.4495641971038, 35.5929060361562]]};

function mapEngine() {
	mapnik.register_default_fonts();
	mapnik.register_default_input_plugins();
	"use strict";
};

mapEngine.prototype.fromStringPromise = function fromStringPromise(map,xml) {
	return new Promise(function(fulfill,reject) {
		map.fromString(xml,function(err,res) {
			if (err) console.log(err);
			fulfill(map);
		});
	});
};

mapEngine.prototype.renderTestMap = function renderTestMap() {
	var self=this;
	return new Promise(function (fulfill, reject) {
		var mapn = Promise2.denodeify(mapnikify);
		mapn(testgeojson,false)
    		.then(function(xml) {
    			    var map = new mapnik.Map(512,512,'+init=epsg:3857');
    			    return self.fromStringPromise(map,xml)
    			  }, function(err) { reject(err); })
    		.then(function(newMap) {
    			newMap.zoomAll();
    			var image = new mapnik.Image(newMap.width,newMap.height);
    			newMap.render(image,{},function(err, image) {
    				if (err) reject(err);
    				var buffer = image.encodeSync('png');
   			    	fulfill(buffer);
      			    });
    		    }, function(err) { reject(err); })
    		.catch(function(err) {
    			reject(err);
    		});
    	});
};

module.exports.mapEngine = mapEngine;