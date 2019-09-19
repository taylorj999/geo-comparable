var config = {};

// system configuration, used to define back end features
// anything that never is required by the display layer goes in here
config.system = {};

config.system.database = {};

config.system.database.host = "localhost";
config.system.database.dbname = "test";
config.system.database.user = "__DBUSERHERE__";
config.system.database.password = "__DBPWDHERE__";
config.system.database.port = 3306;

config.system.serverPort 		= 3011;

// how many possibilities, maximum, to return on an autocompletion query
config.system.autoCompleteLimit = 10;

// how many properties, maximum, to return on a property search query
config.system.propSearchLimit = 10;

module.exports = config;