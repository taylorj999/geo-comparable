var config = require('../config/config');
var inputchecker = require('../utils/inputchecker').inputchecker;

function propertyDAO () {
	"use strict";
}

/**
 * doPropertySearch: Given the parameters entered by the user, build and execute the search query.
 * 
 * Valid search combinations are:
 * 1) Street + MinPrice + MaxPrice
 * 2) Street + MinPrice
 * 3) Street + MaxPrice
 * 4) MinPrice + MaxPrice
 * 5) Street.
 * In order to significantly reduce the cost of matching using LIKE, we join on the streetnames table from autocomplete
 * before matching from the searchable parcels table.
 * 
 * @param	streetName		Streetname to match on. This is searched as a LIKE.
 * @param	minPrice		Minimum price. Numeric.
 * @param	maxPrice		Maximum price. Numeric.
 * @param	resultsPage		Pagination page of results to display.
 * @param	dataSource		Database connection or pool.
 * 
 * @return	Object			Object containing {data,count} where data is the search results and count the total number of
 * 							records available (for pagination purposes).
 */
propertyDAO.prototype.doPropertySearch = function doPropertySearch(streetName, minPrice, maxPrice, resultsPage, dataSource) {
	return new Promise((resolve,reject) => {
	  let checker = new inputchecker();
	  let validStreet = checker.isValidStringInput(streetName);
	  let validMin = checker.isValidNumericInput(minPrice);
	  let validMax = checker.isValidNumericInput(maxPrice);
	  let propQuery = null;
	  let queryParams = [];
	  let resultsOffset = 0;

	  let streetQueryString = null;
	  if (validStreet) { streetQueryString = '%' + streetName.toUpperCase() + '%'; }
	  if (checker.isValidNumericInput(resultsPage)) { resultsOffset = config.system.propSearchLimit * (resultsPage - 1) }
	  
	  const selectClause = "SELECT sp.ogr_fid, sp.address, sp.price, st_asgeojson(sp.centerpoint) as centerpoint";
	  const countClause = "SELECT COUNT(*) as count";
	  const orderLimitClause = "ORDER BY sp.streetname, sp.housenumber LIMIT ? OFFSET ?";
	  let fromClause = null;
	  
	  if (validStreet && validMin && validMax) {
		fromClause = "FROM search_parcels sp INNER JOIN autocomplete_streetnames au ON sp.streetname = au.streetnames " +
		 	         "WHERE au.streetnames LIKE ? AND sp.price >= ? AND sp.price <= ? AND sp.searchable = 1";
		queryParams = [streetQueryString,minPrice,maxPrice];
	  } else if (validStreet && validMin && !validMax) {
		fromClause = "FROM search_parcels sp INNER JOIN autocomplete_streetnames au ON sp.streetname = au.streetnames " +
				     "WHERE au.streetnames LIKE ? AND sp.price >= ? AND sp.searchable = 1";
		queryParams = [streetQueryString,minPrice];
	  } else if (validStreet && !validMin && validMax) {
		fromClause = "FROM search_parcels sp INNER JOIN autocomplete_streetnames au ON sp.streetname = au.streetnames " +
				     "WHERE au.streetnames LIKE ? AND sp.price <= ? AND sp.searchable = 1";
		queryParams = [streetQueryString,maxPrice];
	  } else if (!validStreet && validMin && validMax) {
		fromClause = "FROM search_parcels sp WHERE " +
	          			"sp.price >= ? AND sp.price <= ? AND sp.searchable = 1";
		queryParams = [minPrice,maxPrice];
	  } else if (validStreet && !validMin && !validMax) {
		fromClause = "FROM search_parcels sp INNER JOIN autocomplete_streetnames au ON sp.streetname = au.streetnames " +
				     "WHERE au.streetnames LIKE ? AND sp.searchable = 1";
		queryParams = [streetQueryString];
	  } else {
		reject(new Error('You must submit a valid street name and/or minimum + maximum price'));
	  }
	  
	  if (fromClause!=null) {
		let propCount = 0;
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

/**
 * doGridSearch: Retrieve all parcels and streets within a given distance of the search property.
 * 
 * The actual search is run as a bounding box rather than a circle.
 * 
 * @param		propertyId		Unique database id of the property we are searching around.
 * @param		radius			Distance to edges of the bounding box, from the property center point.
 * @param		dataSource		Database connection or pool.
 * 
 * @return		Object			Object containing {parcelResultSet,streetResultSet,centerpoint} where
 * 								parcelResultSet is the output from the ParcelsInProximity procedure,
 * 								streetResultSet is the output from the StreetsInProximity procedure,
 * 								and centerpoint is the center of the property being searched on (used to center the map).
 */
propertyDAO.prototype.doGridSearch = function doGridSearch(propertyId, radius, dataSource) {
	return new Promise((resolve, reject) => {
      let checker = new inputchecker();
	  let resultSetReturn = {};
	  if (!checker.isValidNumericInput(propertyId)) {
		  reject(new Error('Invalid property id: ' + propertyId));
	  } else {
		  dataSource.query("CALL ParcelsInProximity(?,?)",[propertyId,radius])
		            .then(function(parcels) {
		            	resultSetReturn.parcelResultSet = parcels[0];
		            	if (parcels.length > 0) {
		            		resultSetReturn.centerpoint = parcels[0][0].centerpoint;
			            	return dataSource.query("CALL StreetsInProximity(?,?)",[propertyId,radius]);
		            	}
		            	else {
		            		reject(new Error('Found no parcels for propertyId: ' + propertyId));
		            	}
		            }, function(err) {
		            	console.error(err);
		            	reject(new Error('A database error occurred getting parcel data'));
		            })
		            .then(function(streets) {
		            	resultSetReturn.streetResultSet = streets[0];
		            	resolve(resultSetReturn);
		            }, function(err) {
		            	console.error(err);
		            	reject(new Error('A database error occurred getting street data'));
		            })
		            .catch(function(err) {
		            	console.error(err);
		            	reject(new Error('A database error occurred'));
		            });
	  }
	});
}

module.exports.propertyDAO = propertyDAO;