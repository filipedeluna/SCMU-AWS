import * as Utils from "./utils";
import * as Boom from 'boom';

/*
    GENERAL FUNCTIONS 
*/ 
export const checkTableExists = (t, table: DBTables) =>
  t.one(`SELECT * FROM information_schema.tables WHERE table_name = $1`, table)
  .catch(e => { throw Boom.badRequest(`Table ${table} does not exist.`, { data: e }); })

export const selectAll = (t, table: DBTables) =>
  t.any(`SELECT * FROM ${table}`) 


/*
    USERS
*/ 
export const addUser = (t, user: IInsertUser) =>
  t.any(`
    INSERT INTO users 
    (user_email, user_name, user_birthday, user_picture)
    VALUES
    ($1, $2, $3, $4)`,
    [user.user_email, user.user_name, Utils.checkDate(user.user_birthday), user.user_picture]
  ) 
  .catch(e => { throw Boom.badRequest(`Error inserting user.`, { data: e }); })

export const getUserIdByEmail = (t, email: string) =>
  t.one(`SELECT user_id FROM users WHERE user_email = $1`, email) 
  .catch(e => { throw Boom.notFound(`Email not found.`, { data: e }) })

export const getUserbyId = (t, userId: string) =>
  t.one(`SELECT user_id, user_email, user_name, user_birthday FROM users WHERE user_id = $1`, userId) 
  .catch(e => { throw Boom.notFound(`User does not exist.`, { data: e }) })

export const getUserPicturebyId = (t, userId: string) =>
  t.one(`SELECT user_picture FROM users WHERE user_id = $1`, userId) 
  .catch(e => { throw Boom.notFound(`User does not exist.`, { data: e }) })

/*
    ENUMS 
*/ 
export enum DBTables {
  USERS    = 'users',
  STAFF    = 'staff',
  CARDS    = 'cards',
  TICKETS  = 'tickets',
  EVENTS   = 'events',
  ENTRIES  = 'entries'
}

/*
    INTERFACES 
*/ 
interface IInsertUser {
  user_email:    string,
  user_name:     string,
  user_birthday: string,
  user_picture:  string
}