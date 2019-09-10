function inputchecker () {
	"use strict";
}

inputchecker.prototype.isValidStringInput = function isValidStringInput(inputString) {
	if (inputString === undefined) {
		return false;
	} else if (inputString === null) {
		return false;
	} else if (inputString.length == 0) {
		return false;
	} else {
		return true;
	}
}

inputchecker.prototype.isValidNumericInput = function isValidNumericInput(inputNumber) {
	if (inputNumber === undefined) {
		return false;
	} else if (inputNumber === null) {
		return false;
	} else if (inputNumber.length == 0) {
		return false;
	} else if (isNaN(inputNumber)) {
		return false;
	} else {
		return true;
	}
}

module.exports.inputchecker = inputchecker;