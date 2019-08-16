import WebServer from '../src/server/web.server'

describe('Started', () => {  
	let webServer = null;

	beforeAll(() => {    webServer = new WebServer();  });
	
	test('testing that webserver starts up correctly', 
		async () => {
			let promise = webServer.start();
			await expect(promise).resolves.toBeUndefined();
		});
	
	test('testing that webserver stops correctly', 
		async () => {
			let promise = webServer.stop();
			await expect(promise).resolves.toBeUndefined();
		});
	});
		