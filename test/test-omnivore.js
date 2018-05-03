var mapnikOmnivore = require('@mapbox/mapnik-omnivore'),
    path = require('path');

var filepath = path.resolve('resources/zipcode.shp');

/* mapnikOmnivore.digest(filepath, function(err, metadata){
    if (err) console.error(err);
    else {
        console.log('Metadata returned!');
        console.log(metadata);
    }
});
*/

var Omnivore = require('@mapbox/tilelive-omnivore');
var uri = 'omnivore://' + filepath;

new Omnivore(uri, function(err, source) {
  source.getInfo(function(err, info) {
    console.log(info);
  });
});