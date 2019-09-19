/*
ISC License

Copyright (c) 2017, Mapbox

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.<Paste>
 */

/*
 * Somewhat based on geojson-mapnikify by Mapbox, see above notice.
 */
var normalize = require('@mapbox/geojson-normalize'),
    enforceDefaults = require('./mapnikify-normalizedefaults.js'),
    normalizeStyle = require('./mapnikify-normalizestyle.js');

var template = require('../config/customMapnikTemplate');

var getJSONFromStringOrJSON = require('../utils/smartparse');

function customMapnikify() {
	"use strict";
}

customMapnikify.prototype.generateFillColor = function generateFillColor(basePrice,currentPrice) {
	if ((basePrice === 0) || (currentPrice === 0)) {
		console.error("Zero received in generateFillColor");
		return "#FF8800";
	}
	const priceRatio = currentPrice / basePrice;
	// ratio buckets <.55,.55-.65,.65-.75,.75-.85,.85-.95,.95-1.05,1.05-1.15,1.15-1.25,1.25-1.35,1.35-1.45,1.45-1.55,>1.55
	// <.55   #990000
	// .55-.65  #CC0000
	// .65-.75  #FF0000
	// .75-.85  #FF3333
	// .85-.95  #FF6666
	// .95-1.05 #3399FF
	//1.05-1.15 #66FF66
	//1.15-1.25 #33FF33
	//1.25-1.35 #00FF00
	//1.35-1.45 #00CC00
	// >1.45    #009900
	if (priceRatio <= 0.55) {
		return "#990000";
	} else if ((priceRatio > 0.55) && (priceRatio <= 0.65)) {
		return "#CC0000";
	} else if ((priceRatio > 0.65) && (priceRatio <= 0.75)) {
		return "#FF0000";
	} else if ((priceRatio > 0.75) && (priceRatio <= 0.85)) {
		return "#FF3333";
	} else if ((priceRatio > 0.85) && (priceRatio <= 0.95)) {
		return "#FF6666";
//	} else if ((priceRatio > 0.95) && (priceRatio <= 1.05)) {
//		return "#3399FF";
	} else if ((priceRatio > 0.95) && (priceRatio <= 1.15)) {
		return "#66FF66";
	} else if ((priceRatio > 1.15) && (priceRatio <= 1.25)) {
		return "#33FF33";
	} else if ((priceRatio > 1.25) && (priceRatio <= 1.35)) {
		return "#00FF00";
	} else if ((priceRatio > 1.35) && (priceRatio <= 1.45)) {
		return "#00CC00";
	} else if (priceRatio > 1.45) {
		return "#009900";
	} else {
		console.error("Error in generateFillColor price ratio calculation: " + basePrice + "/" + currentPrice);
		return "#FF8800";
	}
}

customMapnikify.prototype.generateXML = function generateXML(parcelResultSet,streetResultSet,radius) {
	var self=this;
	return new Promise((resolve,reject) => {
		if (parcelResultSet.length===0) {
			return reject(new Error("Zero length result set provided to mapnikify parser"));
		}
		var theXML = template.mapStart + template.styleBlock;
		var firstParcelGeoJSON = normalize(getJSONFromStringOrJSON(parcelResultSet[0].shape));
		if (!firstParcelGeoJSON) { return reject(new Error('invalid geoJSON')); }
		firstParcelGeoJSON.features[0].properties.name = parcelResultSet[0].address;
		firstParcelGeoJSON.features[0].properties.fill = "#0080FF";
		var parcelGeoJSON = normalize(getJSONFromStringOrJSON(parcelResultSet[0].shape));
		parcelGeoJSON.features = [];
		for (var i=1; i<parcelResultSet.length; i++) {
			var curShape = normalize(getJSONFromStringOrJSON(parcelResultSet[i].shape));
			var gj = normalize(curShape);
			if (!gj) { return reject(new Error('invalid geoJSON')); }
			gj.features[0].properties.fill = self.generateFillColor(parcelResultSet[0].price,parcelResultSet[i].price);
			parcelGeoJSON.features.push(gj.features[0]);
		}
		theXML += template.parcelLayerBlock.replace('{{parcelgeojson}}',JSON.stringify(parcelGeoJSON));
		if (streetResultSet.length > 0) {
			var streetGeoJSON = normalize(getJSONFromStringOrJSON(streetResultSet[0].shape));
			if (!streetGeoJSON) { return reject(new Error('invalid geoJSON')); }
			streetGeoJSON.features[0].properties.name = streetResultSet[0].streetname;
			streetGeoJSON.features[0].properties.stroke = "#000000";
			streetGeoJSON.features[0].properties.width = Math.max(1,2/radius);
			streetGeoJSON.features[0].properties.opacity = "1";
			for (var j=0;j<streetResultSet.length;j++) {
				var gj = normalize(getJSONFromStringOrJSON(streetResultSet[j].shape));
				if (!gj) { return reject(new Error('invalid geoJSON')); }
				gj.features[0].properties.name = streetResultSet[j].streetname;
				gj.features[0].properties.stroke = "#000000";
				gj.features[0].properties.width = Math.max(1,2/radius);
				gj.features[0].properties.opacity = "1";
				streetGeoJSON.features.push(gj.features[0]);
			}
			theXML += template.streetLayerBlock.replace('{{streetgeojson}}',JSON.stringify(streetGeoJSON));
		}
		theXML += template.parcelLayerBlock.replace('{{parcelgeojson}}',JSON.stringify(firstParcelGeoJSON));
		theXML += template.mapEnd;
		resolve(theXML);
	});
}

module.exports = customMapnikify;
