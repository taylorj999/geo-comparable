var sanitizers = require('../config/sanitizers');
var validator = require('validator');
var inputchecker = require('./inputchecker').inputchecker;

function sanitize () {
	"use strict";
}

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