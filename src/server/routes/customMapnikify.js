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
 * Heavily based on geojson-mapnikify by Mapbox, see above notice.
 */
var normalize = require('@mapbox/geojson-normalize'),
    enforceDefaults = require('./mapnikify-normalizedefaults.js'),
    normalizeStyle = require('./mapnikify-normalizestyle.js');

var template = require('../config/customMapnikTemplate');

module.exports = generateXML;

function generateXML(resultSet) {
	return new Promise((resolve,reject) => {
		var theXML = template.mapStart + template.styleBlock;
		for (var i=0; i<resultSet.length; i++) {
			var curShape = null;
			if (typeof resultSet[i].shape === 'string' || resultSet[i].shape instanceof String) {
				curShape = JSON.parse(resultSet[i].shape);
			} else {
				curShape = resultSet[i].shape;
			}
			var gj = normalize(curShape);
			if (!gj) { reject(new Error('invalid geoJSON')); }
			gj.features[0].properties.name = resultSet[i].address;
			gj.features[0].properties.fill = "#FF0000";
			theXML += template.parcelLayerBlock.replace('{{geojson}}',JSON.stringify(gj));
		}
		theXML += template.mapEnd;
		resolve(theXML);
	});
}