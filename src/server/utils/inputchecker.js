function inputchecker () {
	"use strict";
}

/**
 * isValidStringInput: test that a string input actually contains data.
 * 
 * This is a convenience function to abstract away some input validation checking. It does not actually check
 * if the input is a 'string' type.
 * 
 * @param	inputString	Input to be tested.
 * @return	boolean		Passed validation or not.
 */
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

/**
 * isValidNumericInput: test that an input actually contains numeric data.
 * 
 * This is a convenience function to abstract away some input validation checking. It does not actually check
 * if the input is a 'number' type as such.
 * 
 * @param	inputString	Input to be tested.
 * @return	boolean		true if there is data and it is numeric data, false otherwise.
 */
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