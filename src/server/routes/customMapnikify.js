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

function generateXML(parcelResultSet,streetResultSet,radius) {
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
			var curShape = null;
			if (typeof parcelResultSet[i].shape === 'string' || parcelResultSet[i].shape instanceof String) {
				curShape = JSON.parse(parcelResultSet[i].shape);
			} else {
				curShape = parcelResultSet[i].shape;
			}
			var gj = normalize(curShape);
			if (!gj) { return reject(new Error('invalid geoJSON')); }
//			gj.features[0].properties.name = parcelResultSet[i].address;
			gj.features[0].properties.fill = "#FF0000";
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

module.exports = generateXML;
