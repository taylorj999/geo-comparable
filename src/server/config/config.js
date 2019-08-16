var config = {};

// system configuration, used to define back end features
// anything that never is required by the display layer goes in here
config.system = {};

config.system.database = {};

config.system.database.host = "localhost";
config.system.database.dbname = "test";
config.system.database.user = "nottherealuser";
config.system.database.password = "nottherealpassword";

config.system.serverPort 		= 3011;

module.exports = config;