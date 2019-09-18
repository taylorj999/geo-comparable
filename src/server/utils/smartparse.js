function getJSONFromStringOrJSON(stringOrJSON) {
	var theJSON = null;
	if (typeof stringOrJSON === 'string' || stringOrJSON instanceof String) {
		theJSON = JSON.parse(stringOrJSON);
	} else {
		theJSON = stringOrJSON;
	}
	return theJSON;
}

module.exports = getJSONFromStringOrJSON;