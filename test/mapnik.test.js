var mapnik = require('mapnik');
var mapnikify = require('../src/server/routes/mapnikify');
var Promise = require('promise');

describe('Started',() => {

  beforeAll(() => {  });

  test('testing that mapnik is installed correctly', 
       async () => { 
    	   var map = new mapnik.Map(512,512,'+init=epsg:3857');
    	   expect(map).not.toBeNull();
    	   expect(map.srs).toBe("+init=epsg:3857");
    	   var dummyMap = '<Map><Style name="points"><Rule><PointSymbolizer /></Rule></Style></Map>';
    	   expect(map.fromStringSync(dummyMap)).toBeUndefined();
    	   expect(map.width).toBe(512);
    	   expect(map.height).toBe(512);
    	   expect(map.zoomAll()).toBeUndefined();
       });

  test('testing that mapnikify is installed correctly',
	   async () => {
		   let testgeojson = {"type": "LineString", "coordinates": [[-82.4496866310505, 35.5915995599292], [-82.4497487278246, 35.5916773944812], [-82.4497053968081, 35.5918605867524], [-82.4496829370215, 35.5920193226531], [-82.4496899113975, 35.592183188315], [-82.4496279260762, 35.5923323091867], [-82.4495304232162, 35.592554624062], [-82.4495191586693, 35.5927190075827], [-82.4495641971038, 35.5929060361562]]};
		   var mapn = Promise.denodeify(mapnikify);
		   let thePromise = mapn(testgeojson,false);
		   await expect(thePromise).resolves.not.toBeNull();
	   });
});