var mysql      = require('mysql');
var config     = require('./config/config');
var express    = require('express');
var app        = express();
var routes     = require('./includes/routes');
var path       = require('path');


var connection = mysql.createConnection({
  host     : config.system.database.host,
  user     : config.system.database.user,
  password : config.system.database.password,
  database : config.system.database.dbname
});

connection.connect(function (err) {
	if (err) {
		console.error("Error opening connection to database: " + err.stack);
		return;
	}
	
	connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
		  if (error) throw error;
		  console.log('The solution is: ', results[0].solution);
		});

	app.use(express.static(path.join(__dirname, "public")));

	//set the view engine to ejs
	app.set('view engine', 'ejs');
	
	connection.end();
	
	routes(app);

	app.set('port', process.env.PORT || config.system.serverPort);

	app.listen(app.get('port'), function() {
		console.log('Express server listening on port ' + app.get('port'));
	});

});

