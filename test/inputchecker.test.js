import inputchecker from '../src/server/utils/inputchecker'

describe('Input validator', () => {
	let inputCheck = new inputchecker.inputchecker();
	
	test('Testing string validator', async () => {
		await expect(inputCheck.isValidStringInput(undefined)).toBe(false);
		await expect(inputCheck.isValidStringInput(null)).toBe(false);
		await expect(inputCheck.isValidStringInput('')).toBe(false);
		await expect(inputCheck.isValidStringInput('this is a test string')).toBe(true);
	});
	
	test('Testing numeric validator', async () => {
		await expect(inputCheck.isValidNumericInput(undefined)).toBe(false);
		await expect(inputCheck.isValidNumericInput(null)).toBe(false);
		await expect(inputCheck.isValidNumericInput('')).toBe(false);
		await expect(inputCheck.isValidNumericInput('0')).toBe(true);
		await expect(inputCheck.isValidNumericInput('1000')).toBe(true);
		await expect(inputCheck.isValidNumericInput('0100')).toBe(true);
		await expect(inputCheck.isValidNumericInput(10)).toBe(true);
	});
});