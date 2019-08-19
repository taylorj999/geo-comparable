const express = require('express');
const config  = require('./config/config');
const routes  = require('./routes/routes');

export default class WebServer {  
	constructor () {
		this.app = express();
		this.app.use(express.static('dist/public'));
		this.app.set('port', process.env.PORT || config.system.serverPort);
		routes(this.app);
	}

	start () {
		return new Promise((resolve, reject) => {
			try {
				let serverPort = this.app.get('port');
				this.server = this.app.listen(serverPort, function () {
					console.log('Express server listening on port ' + serverPort);
					resolve();
					})
			} catch (e) {
				console.error(e);
				reject(e);
			}
		})
	}

	stop () {
		return new Promise((resolve, reject) => {
			try {
				this.server.close(() => {
					resolve();
				})
			} catch (e) {
				console.error(e.message);
				reject(e);
			}
		})
	}
}