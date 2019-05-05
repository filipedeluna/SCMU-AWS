import uuid from 'uuid/v4';
import * as Boom from 'boom';

import { 
  DBTables,
} from './dbFunctions';

import * as DB from './dbFunctions';

import * as Utils from './utils';
import * as Validate from './validations';

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
  Validate.userCreate(data)
  .then(() => DB.checkTableExists(t, DBTables.USERS))
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
  Validate.id(userId)
  .then(() => DB.checkTableExists(t, DBTables.USERS))
  .then(() => DB.getUserbyId(t, userId))

export const getUserId = (t, userEmail) => 
  Validate.email(userEmail)
  .then(() => DB.checkTableExists(t, DBTables.USERS))
  .then(() => DB.getUserIdByEmail(t, userEmail))

export const getUserPicture = (t, userId) =>
  DB.checkTableExists(t, DBTables.USERS)
  .then(() => DB.getUserPicturebyId(t, userId))
  .then(res => res.user_picture)
  .then(filename => Utils.readPictureFromFile(`${PIC_FOLDER}${filename}`))

/*
    STAFF 
*/
export const getStaffId = (t, staffId) => 
  DB.checkTableExists(t, DBTables.STAFF)
  .then(() => DB.getStaffIdByEmail(t, staffId))

export const getStaff = (t, staffId) => 
  DB.checkTableExists(t, DBTables.STAFF)
  .then(() => DB.getStaffbyId(t, staffId))

export const createNewStaff = (t, data) =>
  Validate.staffCreate(data)
  .then(() => DB.checkTableExists(t, DBTables.STAFF))
  .then(() => DB.addStaff(t, {
      staff_email:    data.staff_email,
      staff_name:     data.staff_name,
      staff_password: data.staff_password,
      staff_type:     data.staff_type
    })
  )
