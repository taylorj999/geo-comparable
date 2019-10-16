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
var normalize = require('@mapbox/geojson-normalize');

var template = require('../config/customMapnikTemplate');

var getJSONFromStringOrJSON = require('../utils/smartparse');

function customMapnikify() {
	"use strict";
}

/**
 * generateFillColor: Provides a fill color based on the difference between a property's price and the starting property's price.
 * 
 * In case of an error in the calculation, or a property with no price data, the function returns light grey.
 * 
 * @todo	Make the color generation a dynamic calculation?.
 * 
 * @param	basePrice		Price of the property we are comparing to.
 * @param	currentPrice	Price of the property currently being checked.
 * 
 * @return	String			An RGB color code representing the fill color.
 */
customMapnikify.prototype.generateFillColor = function generateFillColor(basePrice,currentPrice) {
	if ((basePrice === 0) || (currentPrice === 0)) {
		return "#A0A0A0";
	}
	const priceRatio = currentPrice / basePrice;
	// ratio buckets <.55,.55-.65,.65-.75,.75-.85,.85-.95,.95-1.05,1.05-1.15,1.15-1.25,1.25-1.35,1.35-1.45,1.45-1.55,>1.55
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

/**
 * generateXML: Converts the results of the area search to an XML document that the mapnik engine can read.
 * 
 * This is the most complicated part of the data transformation. The XML is assembled as a string rather than using an XML
 * DOM library in order to save time. Stages:
 * 1) The first row in the parcel result set is assumed to be the parcel we are comparing all others against. This is the
 * only parcel whose address is displayed, and also defines the price we use as a basis of comparison.
 * 2) All parcel boundaries are combined into a single geoJSON document. Each parcel receives a fill color based on the 
 * difference between its price and the target parcel. All geoJSON is passed through a normalizer to ensure that what we
 * get out of the database is turned into a form that mapnik can handle.
 * 3) The resulting geoJSON is added directly to the XML file as a CDATA block. (This is the normal way for mapnik to handle
 * geoJSON).
 * 4) The street result set geoJSON is combined into a single geoJSON document. The width of the street on the map is set based
 * on the size of the map. While each street's name is added to the document, the mapnik engine itself decides whether to actually
 * display the name based on how 'crowded' that part of the map is.
 * 5) The resulting street geoJSON document is added as a new layer to the XML file (similar to step 3). This ensures the street
 * names will display over the top of the parcel boundaries, if required.
 * 6) The final layer consists of the address of the target parcel, displayed at the centerpoint of the map.
 * 
 * @link	https://geojson.org/
 * 
 * @param	parcelResultSet				Array of parcel results from the database.
 * @param	parcelResultSet.shape		geoJSON document representing the parcel boundaries.
 * @param	parcelResultSet.price		parcel price for display purposes.
 * @param	parcelResultset.address		parcel street address (only relevant for row[0]).
 * @param	parcelResultSet.centerpoint	geoJSON document representing the parcel's center (only relevant for row[0]).
 * @param	streetResultSet				Array of street results from the database.
 * @param	streetResultSet.streetname	street name for display purposes.
 * @param	streetResultSet.shape		geoJSON document representing the street's map sections.
 * @param	radius						radius of the map (used to calculate street display width).
 * 
 * @return	String						String containing the XML document that represents the provided data.
 */
customMapnikify.prototype.generateXML = function generateXML(parcelResultSet,streetResultSet,radius) {
	var self=this;
	return new Promise((resolve,reject) => {
		if (parcelResultSet.length===0) {
			return reject(new Error("Zero length result set provided to mapnikify parser"));
		}
		let theXML = template.mapStart + template.styleBlock;
		
		
		let addressLayerGeoJSON = normalize(getJSONFromStringOrJSON(parcelResultSet[0].centerpoint));
		if (!addressLayerGeoJSON) { return reject(new Error('invalid geoJSON')); }
		addressLayerGeoJSON.features[0].properties.name = parcelResultSet[0].address;
		
		let parcelGeoJSON = normalize(getJSONFromStringOrJSON(parcelResultSet[0].shape));
		if (!parcelGeoJSON) { return reject(new Error('invalid geoJSON')); }
		parcelGeoJSON.features[0].properties.fill = "#0080FF";
		for (let i=1; i<parcelResultSet.length; i++) {
			let curShape = normalize(getJSONFromStringOrJSON(parcelResultSet[i].shape));
			let gj = normalize(curShape);
			if (!gj) { return reject(new Error('invalid geoJSON')); }
			gj.features[0].properties.fill = self.generateFillColor(parcelResultSet[0].price,parcelResultSet[i].price);
			parcelGeoJSON.features.push(gj.features[0]);
		}
		theXML += template.parcelLayerBlock.replace('{{parcelgeojson}}',JSON.stringify(parcelGeoJSON));
		
		if (streetResultSet.length > 0) {
			let streetGeoJSON = null;
			for (let j=0;j<streetResultSet.length;j++) {
				let gj = normalize(getJSONFromStringOrJSON(streetResultSet[j].shape));
				if (!gj) { return reject(new Error('invalid geoJSON')); }
				gj.features[0].properties.name = streetResultSet[j].streetname;
				gj.features[0].properties.stroke = "#000000";
				gj.features[0].properties.width = Math.max(1,2/radius);
				gj.features[0].properties.opacity = "1";
				if (streetGeoJSON === null) { streetGeoJSON = gj; }
				else { streetGeoJSON.features.push(gj.features[0]); }
			}
			theXML += template.streetLayerBlock.replace('{{streetgeojson}}',JSON.stringify(streetGeoJSON));
		}
		
		theXML += template.labelsLayerBlock.replace('{{labelgeojson}}',JSON.stringify(addressLayerGeoJSON));
		theXML += template.mapEnd;
		resolve(theXML);
	});
}

module.exports = customMapnikify;
