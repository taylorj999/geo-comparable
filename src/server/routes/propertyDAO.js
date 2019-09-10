var config = require('../config/config');
var inputchecker = require('../utils/inputchecker').inputchecker;

function propertyDAO () {
	"use strict";
}

propertyDAO.prototype.doPropertySearch = function doPropertySearch(streetName, minPrice, maxPrice, dataSource) {
	return new Promise((resolve,reject) => {
	  var checker = new inputchecker();
	  var validStreet = checker.isValidStringInput(streetName);
	  var validMin = checker.isValidNumericInput(minPrice);
	  var validMax = checker.isValidNumericInput(maxPrice);
	  var propQuery = null;
	  var queryParams = [];

	  var streetQueryString = null;
	  if (validStreet) { streetQueryString = '%' + streetName.toUpperCase() + '%'; }
	  
	  if (validStreet && validMin && validMax) {
		propQuery = "SELECT sp.ogr_fid, sp.address FROM search_parcels sp, autocomplete_streetnames au WHERE au.streetnames LIKE ? " +
		            "AND sp.streetname = au.streetnames AND sp.price >= ? AND sp.price <= ? ORDER BY sp.streetname LIMIT ?";
		queryParams = [streetQueryString,minPrice,maxPrice,config.system.autoCompleteLimit];
	  } else if (validStreet && validMin && !validMax) {
		propQuery = "SELECT sp.ogr_fid, sp.address FROM search_parcels sp, autocomplete_streetnames au WHERE au.streetnames LIKE ? " +
        			"AND sp.streetname = au.streetnames AND sp.price >= ? ORDER BY sp.streetname LIMIT ?";
		queryParams = [streetQueryString,minPrice,config.system.autoCompleteLimit];
	  } else if (validStreet && !validMin && validMax) {
		propQuery = "SELECT sp.ogr_fid, sp.address FROM search_parcels sp, autocomplete_streetnames au WHERE au.streetnames LIKE ? " +
					"AND sp.streetname = au.streetnames AND sp.price <= ? ORDER BY sp.streetname LIMIT ?";
		queryParams = [streetQueryString,maxPrice,config.system.autoCompleteLimit];
	  } else if (!validStreet && validMin && validMax) {
		propQuery = "SELECT sp.ogr_fid, sp.address FROM search_parcels sp WHERE " +
           			"sp.price >= ? AND sp.price <= ? ORDER BY sp.streetname LIMIT ?";
		queryParams = [minPrice,maxPrice,config.system.autoCompleteLimit];
	  } else if (validStreet && !validMin && !validMax) {
		propQuery = "SELECT sp.ogr_fid, sp.address FROM search_parcels sp, autocomplete_streetnames au WHERE au.streetnames LIKE ? " +
					"AND sp.streetname = au.streetnames ORDER BY sp.streetname LIMIT ?";
		queryParams = [streetQueryString,config.system.autoCompleteLimit];
	  } else {
		reject(new Error('You must submit a valid street name and/or minimum + maximum price'));
	  }
	  
	  if (propQuery!=null) {
		dataSource.query(propQuery,queryParams)
	              .then(function(rows) {
	            	resolve(rows);
	              }, function(err) {
	            	console.error(err);
	            	reject(new Error('A database error occurred'));
	              })
	              .catch(function(err) {
	            	console.error(err);
	            	reject(new Error('A database error occurred.'));
	              });
	  }
	});
}

module.exports.propertyDAO = propertyDAO;