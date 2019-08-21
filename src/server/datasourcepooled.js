const mysql     = require('mysql');
const config     = require('./config/config');

export default class DataSource {
	constructor() {
		this.pool = null;
	}
	
	open() {
		return new Promise((resolve, reject) => {
			try {
				this.pool = mysql.createPool({
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
	
	getConnection() {
		return new Promise((resolve,reject) => {
			try {
				this.pool.getConnection(function(err,connection) {
					if (err) {
				        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
				            console.error('Database connection was closed.')
				        }
				        else if (err.code === 'ER_CON_COUNT_ERROR') {
				            console.error('Database has too many connections.')
				        }
				        else if (err.code === 'ECONNREFUSED') {
				            console.error('Database connection was refused.')
				        }
				        else {
				        	console.error(err);
				        }
						reject(err);
					} else {
						resolve(connection);
					}
				});
			} catch (e) {
				console.error(e);
				reject(e);
			}
		});
	}
	
	query(sql, args) {
		return new Promise ((resolve,reject) => {
			try {
				this.pool.query(sql,args,(err,rows,fields) => {
				    if (err) {
				        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
				            console.error('Database connection was closed.')
				        }
				        else if (err.code === 'ER_CON_COUNT_ERROR') {
				            console.error('Database has too many connections.')
				        }
				        else if (err.code === 'ECONNREFUSED') {
				            console.error('Database connection was refused.')
				        }
				        else {
				        	console.error(err);
				        }
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
				this.query('SELECT 1 + 1 AS solution',{})
					.then(function(rows) {
							resolve(rows[0].solution);
						  },
						  function(err) {
							reject(err);
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
				this.pool.end();
				resolve();
			} catch (e) {
				console.error(e);
				reject(e);
			}
		});
	}
}

