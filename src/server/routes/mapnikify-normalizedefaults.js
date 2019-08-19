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
var xtend = require('xtend');

var defaultFilled = {
    fill: '#555555',
    'fill-opacity': 0.6,
    stroke: '#555555',
    'stroke-width': 2,
    'stroke-opacity': 1
};

var defaultStroked = {
    stroke: '#555555',
    'stroke-width': 2,
    'stroke-opacity': 1
};

var defaultPoint = {
    'marker-color': '7e7e7e',
    'marker-size': 'medium',
    'symbol': '-'
};

var typed = {
    LineString: defaultStroked,
    MultiLineString: defaultStroked,
    Polygon: defaultFilled,
    MultiPolygon: defaultFilled,
    Point: defaultPoint,
    MultiPoint: defaultPoint
};

module.exports = enforceDefaults;

function enforceDefaults(feature) {
    if (!feature || !feature.properties || !feature.geometry) {
        return feature;
    }
    var def = typed[feature.geometry.type];
    feature.properties = xtend({}, def, feature.properties);
    return feature;
}
