//var mapnikify = require('@mapbox/geojson-mapnikify');

var mapnikify = require('../includes/mapnikify');

var testgeojson = {"type": "LineString", "coordinates": [[-82.4496866310505, 35.5915995599292], [-82.4497487278246, 35.5916773944812], [-82.4497053968081, 35.5918605867524], [-82.4496829370215, 35.5920193226531], [-82.4496899113975, 35.592183188315], [-82.4496279260762, 35.5923323091867], [-82.4495304232162, 35.592554624062], [-82.4495191586693, 35.5927190075827], [-82.4495641971038, 35.5929060361562]]};

mapnikify(testgeojson,false,function(err,xml) {
	if (err) {
		console.error(err);
	} else {
		console.log(xml);
	}
});