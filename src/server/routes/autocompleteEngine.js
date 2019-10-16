var config = require('../config/config');

function autocompleteEngine () {
	"use strict";
}

/**
 * getSuggestions: query a list of streetname suggestions based on the stub of what the user has already typed.
 * 
 * @param	stringStub	Search stub to use. It is expected that the calling function will already have included '%' characters.
 * @param	dataSource	The database connection or pool to use.
 * 
 * @return	Array		Streetnames that matched, if any.
 */
autocompleteEngine.prototype.getSuggestions = function getSuggestions(stringStub, dataSource) {
	return new Promise((resolve,reject) => {
		dataSource.query('SELECT streetnames FROM autocomplete_streetnames WHERE streetnames LIKE ? ORDER BY streetnames LIMIT ?'
				        ,[stringStub,config.system.autoCompleteLimit])
		          .then(function(rows) {
		        	  resolve(rows);
		          },function(err) {
		        	  reject(err);
		          });
	});
}

module.exports.autocompleteEngine = autocompleteEngine;