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
	path = require('path'),
	fs = require('fs'),
    enforceDefaults = require('./mapnikify-normalizedefaults.js'),
    normalizeStyle = require('./mapnikify-normalizestyle.js');

//var template = fs.readFileSync(__dirname + '/../static/template.xml', 'utf8');

var template = require('../config/template');

module.exports = generateXML;

function generateXML(data, retina, callback) {
    var gj = normalize(data);
    
//    var q = queue(1);
    
    if (!gj) return callback(new Error('invalid GeoJSON'));

    for (let i = 0; i < gj.features.length; i++) {
        gj.features[i] = !markerURL(gj.features[i]) ? enforceDefaults(normalizeStyle(gj.features[i])) : normalizeStyle(gj.features[i]);
    }

/*    gj.features.filter(isPoint).forEach(function(feat, i) {
        if (markerURL(feat)) {
            q.defer(getRemote, feat, retina);
        } else {
            q.defer(getMarker, feat, retina);
        }
    });
*/
    
//    q.awaitAll(done);

//    function done(err, ls) {
//        if (err) return callback(err);
        return callback(null,
            template.replace('{{geojson}}', JSON.stringify(gj)));
//    }
}

function markerURL(feature) {
    return (feature.properties || {})['marker-url'];
}