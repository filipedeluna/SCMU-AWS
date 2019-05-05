import uuid from 'uuid/v4';
import * as Boom from 'boom';

import { 
  DBTables,
} from './dbFunctions';

import * as DB from './dbFunctions';
import { Base64 } from 'js-base64';
const base64js = require('base64-js');

const uuid = require('uuid/v4');
const fs = require('fs').promises;

// General Functions
export const selectAllFromTable = (t, table: DBTables) => 
  DB.checkTableExists(t, table)
  .then(() => DB.selectAll(t, table))

// Users
export const createNewUser = (t, data) => 
  DB.checkTableExists(t, DBTables.USERS)
  .then(() => uuid())
  .then(uuid => {
    let filename: string = `pictures/${uuid}.jpg`;
      
    return DB.addUser(t, {
      user_email:    data.user_email,
      user_name:     data.user_name,
      user_birthday: data.user_birthday,
      user_picture:  filename,
    })
    .then(() => writePictureToFile(filename, data.user_picture))
  })

// File System
const writePictureToFile = (filename: string, pictureData) => {
  const fixedPictureData = pictureData.split(';base64,').pop();

  return fs.writeFile(filename, Base64.atob(fixedPictureData))
  .catch(( )=> { throw Boom.badData('Failed to save picture.'); })
}