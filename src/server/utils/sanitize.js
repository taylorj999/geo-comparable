var sanitizers = require('../config/sanitizers');
var validator = require('validator');

function sanitize () {
	"use strict";
}

sanitize.prototype.cleanInput = function cleanInput(uncleanInput, sanitizer) {
	if (sanitizer === undefined) {
		return validator.whitelist(uncleanInput,sanitizers.standard);
	} else {
		return validator.whitelist(uncleanInput,sanitizer);
	}
}

module.exports.sanitize = sanitize;