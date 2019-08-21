import DataSource from '../src/server/datasource';
var autocompleteEngine = require('../src/server/routes/autocompleteEngine').autocompleteEngine;

describe('Autocomplete Engine', () => {  
	let dataSource = null;
	let streetnameStub = 'ST%';
	let bogusStreetnameStub = '99ZZ99%';
	let autoE = null;
	
	beforeAll(async () => {
		dataSource = new DataSource();
		autoE = new autocompleteEngine();
		await dataSource.open();
	});

	test('testing return value of autocomplete (should find 10 rows)', async () => {
		let promise = autoE.getSuggestions(streetnameStub, dataSource);
		await expect(promise).resolves.toHaveLength(10);
	});
	
	test('testing return value of autocomplete (should find nothing)', async () => {
		let promise = autoE.getSuggestions(bogusStreetnameStub, dataSource);
		await expect(promise).resolves.toHaveLength(0);
	});
	
	afterAll(async () => {
		await dataSource.close();
	});
});