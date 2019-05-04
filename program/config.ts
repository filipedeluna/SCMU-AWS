// Database login options
export const DBOptions : iDBOptions = {
  user: "fluna",
  password: "admin",
  port: 5433,
  host: 'localhost',
  database: 'scmu',
}

// Database interface
interface iDBOptions {
  user?     : string
  password? : string,
  host      : string,
  database  : string,
  port?     : number
};

// PG Promise configurations
export const PGPConfig = {
  promiseLib: require('bluebird'),
};