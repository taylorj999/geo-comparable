import DataSource from '../src/server/datasourcepooled'

describe('Started', () => {  
	let dataSource = null;

	beforeAll(() => {    dataSource = new DataSource();  });
	
	test('testing that datasouce creates the pool without errors', async () => {
		let promise = dataSource.open();
		await expect(promise).resolves.toBeUndefined();
	});

	test('testing that connection is valid', async () => {
		let promise = dataSource.test();
		await expect(promise).resolves.toEqual(2);
	});
	
	test('testing that pool closes without errors', async () => {
		let promise = dataSource.close();
		await expect(promise).resolves.toBeUndefined();
	});
	
	});
	