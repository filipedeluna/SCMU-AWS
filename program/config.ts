// Database login options
export const DBOptions = {
  user: "fluna",
  password: "admin",
  port: 5433,
  host: 'localhost',
  database: 'scmu',
}

// PG Promise configurations
export const PGPConfig = {
  promiseLib: require('bluebird'),
};