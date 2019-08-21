var config = require('../config/config');

function autocompleteEngine () {
	"use strict";
}

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