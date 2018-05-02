
module.exports = exports = function(app) {
	"use strict";
	
	app.get('/', (req, res) => {
		res.render('home', { });			
	});
	
	
};