import sanitize from '../src/server/utils/sanitize'
import sanitizers from '../src/server/config/sanitizers'

describe('Input sanitizer', () => {
	let inputSanitizer = new sanitize.sanitize();
	
	test('Testing numeric sanitizer', async () => {
		await expect(inputSanitizer.cleanInput('14586',sanitizers.numeric)).toBe('14586');
		await expect(inputSanitizer.cleanInput('14586\';drop table *;',sanitizers.numeric)).toBe('14586');
		await expect(inputSanitizer.cleanInput('14586 asdfs',sanitizers.numeric)).toBe('14586');
		await expect(inputSanitizer.cleanInput('14586 test st',sanitizers.numeric)).toBe('14586');
		await expect(inputSanitizer.cleanInput('\';drop table *;14586',sanitizers.numeric)).toBe('14586');
		await expect(inputSanitizer.cleanInput('test st 14586',sanitizers.numeric)).toBe('14586');
		
	});
	
	test('Testing standard sanitizer', async () => {
		await expect(inputSanitizer.cleanInput('TEST ST')).toBe('TEST ST');
		await expect(inputSanitizer.cleanInput('14586 TEST ST')).toBe('14586 TEST ST');
		await expect(inputSanitizer.cleanInput('TEST ST\';DROP TABLE *;')).toBe('TEST STDROP TABLE ');
		await expect(inputSanitizer.cleanInput('14586 TEST ST.')).toBe('14586 TEST ST');
	});
});