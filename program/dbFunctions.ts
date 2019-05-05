// General Functions
export const checkTableExists = (t, table : DBTables) =>
  t.one(`SELECT COUNT(*) FROM information_schema.tables WHERE table_name = $1`, table)
  .then(val => val.count == '1')

export const selectAll = (t, table : DBTables) =>
  t.any(`SELECT * FROM ${table}`) 

// Users

// ENUMS
export enum DBTables {
  USERS    = 'users',
  STAFF    = 'staff',
  CARDS    = 'cards',
  TICKETS  = 'tickets',
  EVENTS   = 'events',
  ENTRIES  = 'entries'
}