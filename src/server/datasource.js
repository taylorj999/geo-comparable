const mysql     = require('mysql');
const config     = require('./config/config');

export default class DataSource {
	constructor() {
		this.connection = null;
	}
	
	open() {
		return new Promise((resolve, reject) => {
			try {
				this.connection = mysql.createConnection({
					  host     : config.system.database.host,
					  user     : config.system.database.user,
					  password : config.system.database.password,
					  database : config.system.database.dbname
					});
				resolve();
			} catch (e) {
				console.error(e);
				reject(e);
			}
		});
	}
	
	query(sql, args) {
		return new Promise ((resolve,reject) => {
			try {
				this.connection.query(sql,args,(err,rows) => {
					if (err) {
						console.error(err);
						reject(err);
					} else {
						resolve(rows);
					}
				});
			} catch (e) {
				console.error(e);
				reject(e);
			}
		});
	}
	
	test() {
		return new Promise((resolve,reject) => {
			try {
				this.connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
					  if (error) {
						  console.error(error);
						  reject(error);
					  }
					  resolve(results[0].solution);
					});
			} catch (e) {
				  console.error(error);
				  reject(e);
			}
		});
	}
	
	close() {
		return new Promise((resolve,reject) => {
			try {
				this.connection.end();
				resolve();
			} catch (e) {
				console.error(e);
				reject(e);
			}
		});
	}
}

