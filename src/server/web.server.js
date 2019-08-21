const express = require('express');
const config  = require('./config/config');
const routes  = require('./routes/routes');
import DataSource from './datasourcepooled';

export default class WebServer {  
	constructor () {
		this.app = express();
		this.app.use(express.static('dist/public'));
		this.app.set('port', process.env.PORT || config.system.serverPort);
	}

	start () {
		return new Promise((resolve, reject) => {
			try {
				var self = this;
				this.dataSource = new DataSource();
				this.dataSource.open()
				.then(
					function() {
						routes(self.app, self.dataSource);
						let serverPort = self.app.get('port');
						self.server = self.app.listen(serverPort, function () {
							console.log('Express server listening on port ' + serverPort);
							resolve();
							})
					},
					function(err) {
						console.error(err);
						reject(e);
					});
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