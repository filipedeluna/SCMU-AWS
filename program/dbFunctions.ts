import * as Utils from "./utils";
import * as Boom from 'boom';


// General Functions
export const checkTableExists = (t, table: DBTables) =>
  t.one(`SELECT * FROM information_schema.tables WHERE table_name = $1`, table)
  .catch(() => { throw Boom.badRequest(`Table ${table} does not exist.`); })

export const selectAll = (t, table: DBTables) =>
  t.any(`SELECT * FROM ${table}`) 

// USERS
export const addUser = (t, user: IInsertUser) =>
  t.any(`
    INSERT INTO users 
    (user_email, user_name, user_birthday, user_picture)
    VALUES
    ($1, $2, $3, $4)`,
    [user.user_email, user.user_name, Utils.checkDate(user.user_birthday), user.user_picture]
  ) 
  .catch((err) => { throw Boom.badRequest(`Error inserting user.`); })

export const getUserId = (t, email: string) =>
  t.one(`SELECT * FROM users WHERE user_email = '${email}'`) 
  .catch(() => { throw Boom.notFound(`User does not exist.`) })

// ENUMS
export enum DBTables {
  USERS    = 'users',
  STAFF    = 'staff',
  CARDS    = 'cards',
  TICKETS  = 'tickets',
  EVENTS   = 'events',
  ENTRIES  = 'entries'
}

// Interfaces
interface IInsertUser {
  user_email:    string,
  user_name:     string,
  user_birthday: string,
  user_picture:  string
}