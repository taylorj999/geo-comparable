import DataSource from '../src/server/datasourcepooled'
var PropertyDAO = require('../src/server/routes/propertyDAO').propertyDAO;
var config = require('../src/server/config/config');

describe('Property Data Access Object', () => {  
	let dataSource = null;
	let pDAO = null;
	
	beforeAll(() => {
	  dataSource = new DataSource();
	  pDAO = new PropertyDAO();
	});
	
	test('making sure datasource opens without errors', async () => {
		await expect(dataSource.open()).resolves.toBeUndefined();
	});

	test('testing bad parameter combinations (should all reject)', async () => {
		await expect(pDAO.doPropertySearch(undefined,undefined,undefined,dataSource)).rejects.toThrow('You must submit a valid street name and/or minimum + maximum price');
		await expect(pDAO.doPropertySearch(undefined,0,undefined,dataSource)).rejects.toThrow('You must submit a valid street name and/or minimum + maximum price');
		await expect(pDAO.doPropertySearch(undefined,undefined,5,dataSource)).rejects.toThrow('You must submit a valid street name and/or minimum + maximum price');
		await expect(pDAO.doPropertySearch('','','',dataSource)).rejects.toThrow('You must submit a valid street name and/or minimum + maximum price');
	});

	test('testing property queries with impossible parameters (should return 0 rows)', async () => {
		await expect(pDAO.doPropertySearch('ZZZZ ST',null,null,dataSource)).resolves.toHaveLength(0);
		await expect(pDAO.doPropertySearch(null,999999,999998,dataSource)).resolves.toHaveLength(0);
	});
	
	test('testing property queries that should return a full data set (limited to 10)', async () => {
		await expect(pDAO.doPropertySearch('BEAVERDAM',null,null,dataSource)).resolves.toHaveLength(config.system.propSearchLimit);
		await expect(pDAO.doPropertySearch(null,100000,900000,dataSource)).resolves.toHaveLength(config.system.propSearchLimit);
	});
	
	test('making sure that pool closes without errors', async () => {
		await expect(dataSource.close()).resolves.toBeUndefined();
	});

});
	