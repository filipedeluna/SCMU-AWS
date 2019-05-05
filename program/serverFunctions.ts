import uuid from 'uuid/v4';
import * as Boom from 'boom';

import { 
  DBTables,
} from './dbFunctions';

import * as DB from './dbFunctions';

import * as Utils from './utils';

const uuid = require('uuid/v4');
const PIC_FOLDER = 'pictures/';

/*
    GENERAL FUNCTIONS 
*/ 
export const selectAllFromTable = (t, table: DBTables) => 
  DB.checkTableExists(t, table)
  .then(() => DB.selectAll(t, table))

/*
    USERS 
*/
export const createNewUser = (t, data) => 
  DB.checkTableExists(t, DBTables.USERS)
  .then(() => uuid())
  .then(uuid => {
    let filename: string = `${uuid}.jpg`;
      
    return DB.addUser(t, {
      user_email:    data.user_email,
      user_name:     data.user_name,
      user_birthday: data.user_birthday,
      user_picture:  filename,
    })
    .then(() => Utils.writePictureToFile(`${PIC_FOLDER}${filename}`, data.user_picture))
  })

export const getUser = (t, userId) => 
  DB.checkTableExists(t, DBTables.USERS)
  .then(() => DB.getUserbyId(t, userId))

export const getUserId = (t, userId) => 
  DB.checkTableExists(t, DBTables.USERS)
  .then(() => DB.getUserIdByEmail(t, userId))

export const getUserPicture = (t, userId) =>
  DB.checkTableExists(t, DBTables.USERS)
  .then(() => DB.getUserPicturebyId(t, userId))
  .then(res => res.user_picture)
  .then(filename => Utils.readPictureFromFile(`${PIC_FOLDER}${filename}`))