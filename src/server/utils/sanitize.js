var sanitizers = require('../config/sanitizers');
var validator = require('validator');
var inputchecker = require('./inputchecker').inputchecker;

function sanitize () {
	"use strict";
}

/**
 * cleanInput: Removes invalid characters from a string in order to prevent input contamination.
 * 
 * Uses the NodeJS validator library in order to perform input cleaning. Any character not in the sanitizer string will be removed.
 * The standard sanitizer string is defined as all alphanumeric plus space. Alternately, a custom sanitizer string can be passed in.
 * 
 * @param	uncleanInput	Unsanitized user input (for example from a web form).
 * @param	sanitizer		[optional] sanitizer string to use; any input characters not in this string are removed.
 * 
 * @return	String			Sanitized user input.
 */
sanitize.prototype.cleanInput = function cleanInput(uncleanInput, sanitizer) {
	var checker = new inputchecker();
	if (checker.isValidNumericInput(uncleanInput)) {
		return uncleanInput;
	} else if (sanitizer === undefined) {
		return validator.whitelist(uncleanInput,sanitizers.standard);
	} else {
		return validator.whitelist(uncleanInput,sanitizer);
	}
}

module.exports.sanitize = sanitize;