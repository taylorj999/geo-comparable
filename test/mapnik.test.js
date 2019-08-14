var mapnik = require('mapnik');

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

});