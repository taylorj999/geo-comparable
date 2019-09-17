var config = require('../config/config');
var inputchecker = require('../utils/inputchecker').inputchecker;

function propertyDAO () {
	"use strict";
}

propertyDAO.prototype.doPropertySearch = function doPropertySearch(streetName, minPrice, maxPrice, resultsPage, dataSource) {
	return new Promise((resolve,reject) => {
	  var checker = new inputchecker();
	  var validStreet = checker.isValidStringInput(streetName);
	  var validMin = checker.isValidNumericInput(minPrice);
	  var validMax = checker.isValidNumericInput(maxPrice);
	  var propQuery = null;
	  var queryParams = [];
	  var resultsOffset = 0;

	  var streetQueryString = null;
	  if (validStreet) { streetQueryString = '%' + streetName.toUpperCase() + '%'; }
	  if (checker.isValidNumericInput(resultsPage)) { resultsOffset = config.system.propSearchLimit * (resultsPage - 1) }
	  
	  const selectClause = "SELECT sp.ogr_fid, sp.address, sp.price, st_asgeojson(sp.centerpoint) as centerpoint";
	  const countClause = "SELECT COUNT(*) as count";
	  const orderLimitClause = "ORDER BY sp.streetname LIMIT ? OFFSET ?";
	  var fromClause = null;
	  
	  if (validStreet && validMin && validMax) {
		fromClause = "FROM search_parcels sp, autocomplete_streetnames au WHERE au.streetnames LIKE ? " +
		            "AND sp.streetname = au.streetnames AND sp.price >= ? AND sp.price <= ?";
		queryParams = [streetQueryString,minPrice,maxPrice];
	  } else if (validStreet && validMin && !validMax) {
		fromClause = "FROM search_parcels sp, autocomplete_streetnames au WHERE au.streetnames LIKE ? " +
        			"AND sp.streetname = au.streetnames AND sp.price >= ?";
		queryParams = [streetQueryString,minPrice];
	  } else if (validStreet && !validMin && validMax) {
		fromClause = "FROM search_parcels sp, autocomplete_streetnames au WHERE au.streetnames LIKE ? " +
					"AND sp.streetname = au.streetnames AND sp.price <= ?";
		queryParams = [streetQueryString,maxPrice];
	  } else if (!validStreet && validMin && validMax) {
		fromClause = "FROM search_parcels sp WHERE " +
           			"sp.price >= ? AND sp.price <= ?";
		queryParams = [minPrice,maxPrice];
	  } else if (validStreet && !validMin && !validMax) {
		fromClause = "FROM search_parcels sp, autocomplete_streetnames au WHERE au.streetnames LIKE ? " +
					"AND sp.streetname = au.streetnames";
		queryParams = [streetQueryString];
	  } else {
		reject(new Error('You must submit a valid street name and/or minimum + maximum price'));
	  }
	  
	  if (fromClause!=null) {
		var propCount = 0;
		dataSource.query(countClause + " " + fromClause,queryParams)
	              .then(function(rows) {
	            	propCount = rows[0].count;
	            	queryParams.push(config.system.propSearchLimit);
	            	queryParams.push(resultsOffset);
	            	return dataSource.query(selectClause + " " + fromClause + " " + orderLimitClause,queryParams);
	              }, function(err) {
	            	console.error(err);
	            	reject(new Error('A database error occurred'));
	              })
	              .then(function(rows) {
	            	resolve({data:rows,count:propCount});
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

propertyDAO.prototype.doGridSearch = function doGridSearch(propertyId, dataSource) {
	return new Promise((resolve, reject) => {
	  var checker = new inputchecker();
	  if (!checker.isValidNumericInput(propertyId)) {
		  reject(new Error('Invalid property id: ' + propertyId));
	  } else {
		  dataSource.query("CALL ParcelsInProximity(?)",[propertyId])
		            .then(function(rows) {
		            	resolve(rows);
		            }, function(err) {
		            	console.error(err);
		            	reject(new Error('A database error occurred'));
		            })
		            .catch(function(err) {
		            	console.error(err);
		            	reject(new Error('A database error occurred'));
		            });
	  }
	});
}

module.exports.propertyDAO = propertyDAO;