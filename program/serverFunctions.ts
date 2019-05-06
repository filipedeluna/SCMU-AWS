import uuid from 'uuid/v4';
import * as Boom from 'boom';

import { 
  DBTables,
} from './dbFunctions';

import * as DB from './dbFunctions';

import * as Utils from './utils';
import * as Validate from './validations';

const uuid = require('uuid/v4');
const PIC_FOLDER_USERS = 'pictures/users';
const PIC_FOLDER_EVENTS = 'pictures/events';

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
    .then(() => Utils.writePictureToFile(`${PIC_FOLDER_USERS}${filename}`, data.user_picture))
  })

export const getUserById = (t, userId) => 
  Validate.id(userId)
  .then(() => DB.checkTableExists(t, DBTables.USERS))
  .then(() => DB.getUserById(t, userId))

export const getUserByEmail = (t, userEmail) => 
  Validate.email(userEmail)
  .then(() => DB.checkTableExists(t, DBTables.USERS))
  .then(() => DB.getUserByEmail(t, userEmail))

export const getUserPicture = (t, userId) =>
  Validate.id(userId)
  .then(() => DB.checkTableExists(t, DBTables.USERS))
  .then(() => DB.getUserPicturebyId(t, userId))
  .then(res => res.user_picture)
  .then(filename => Utils.readPictureFromFile(`${PIC_FOLDER_USERS}${filename}`))

/*
    STAFF 
*/

export const getStaffId = (t, staffemail) => 
  Validate.email(staffemail)
  .then(() => DB.checkTableExists(t, DBTables.STAFF))
  .then(() => DB.getStaffIdByEmail(t, staffemail))

export const getStaff = (t, staffId) => 
  Validate.id(staffId)
  .then(() => DB.checkTableExists(t, DBTables.STAFF))
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

/*
    CARDS 
*/

export const addCard = (t, cardId, userId) => 
  Validate.id(userId)
  .then(() => Validate.cardId(cardId))
  .then(() => DB.checkTableExists(t, DBTables.CARDS))
  .then(() => DB.checkTableExists(t, DBTables.USERS))
  .then(() => DB.addCard(t, cardId, userId))

export const getUserCards = (t, userId) => 
  Validate.id(userId)
  .then(() => DB.checkTableExists(t, DBTables.CARDS))
  .then(() => DB.getCardsByUserId(t, userId))
  
export const getCardOwner = (t, cardId) =>
  Validate.cardId(cardId)
  .then(() => DB.checkTableExists(t, DBTables.CARDS))  
  .then(() => DB.getCardOwnerByCardId(t, cardId))

/*
    TICKETS 
*/

export const addTicketToCard = (t, cardId, eventId) =>
  Validate.cardId(cardId)
  .then(() => Validate.id(eventId))
  .then(() => DB.checkTableExists(t, DBTables.TICKETS))
  .then(() => DB.checkTableExists(t, DBTables.EVENTS))
  .then(() => DB.checkTableExists(t, DBTables.CARDS))
  .then(() => DB.checkTicketAlreadyBought(t, cardId, eventId))
  .then(() => DB.checkTicketsLeft(t, cardId))
  .then(() => DB.addTicket(t, cardId, eventId))

export const getAllTicketsByCardId = (t, cardId) =>
  Validate.cardId(cardId)
  .then(() => DB.checkTableExists(t, DBTables.TICKETS))
  .then(() => DB.getAllTicketsByCardId(t, cardId))

export const getAllTicketsByEventId = (t, eventId) =>
  Validate.id(eventId)
  .then(() => DB.checkTableExists(t, DBTables.TICKETS))
  .then(() => DB.getAllTicketsByEventId(t, eventId))

export const checkTicketUsed = (t, cardId, eventId) =>
  Validate.cardId(cardId)
  .then(() => Validate.id(eventId))
  .then(() => DB.checkTableExists(t, DBTables.TICKETS))
  .then(() => DB.checkTicketUsed(t, cardId, eventId))

export const setTicketAsUsed = (t, cardId, eventId) =>
  Validate.cardId(cardId)
  .then(() => Validate.id(eventId))
  .then(() => DB.checkTableExists(t, DBTables.TICKETS))
  .then(() => DB.setTicketAsUsed(t, cardId, eventId))

/*
    EVENTS 
*/

export const getEventById = (t, eventId) =>
  Validate.id(eventId)
  .then(() => DB.checkTableExists(t, DBTables.EVENTS))
  .then(() => DB.getEventById(t, eventId))

  
/*
    ENTRIES 
*/

export const getEntriesByEventId = (t, eventId) =>
  Validate.id(eventId)
  .then(() => DB.checkTableExists(t, DBTables.ENTRIES))
  .then(() => DB.getEventById(t, eventId))

export const getEntriesByCardId = (t, cardId) =>
  Validate.cardId(cardId)
  .then(() => DB.checkTableExists(t, DBTables.ENTRIES))
  .then(() => DB.getEntriesByCardtId(t, cardId))

export const getEntriesByCardAndEventId = (t, eventId, cardId) =>
  Validate.id(eventId)
  .then(() => Validate.cardId(cardId))
  .then(() => DB.checkTableExists(t, DBTables.CARDS))
  .then(() => DB.checkTableExists(t, DBTables.EVENTS))
  .then(() => DB.checkEventExists(t, eventId))
  .then(() => DB.checkCardExists(t, cardId))
  .then(() => DB.getEntriesByEventAndCardId(t, eventId, cardId))

export const registerEntry = (t, eventId, cardId) =>
  Validate.id(cardId)
  .then(() => Validate.id(eventId))
  .then(() => DB.checkTableExists(t, DBTables.EVENTS))
  .then(() => DB.checkTableExists(t, DBTables.CARDS))
  .then(() => DB.checkTableExists(t, DBTables.ENTRIES))
  .then(() => DB.checkEventExists(t, eventId))
  .then(() => DB.checkCardExists(t, cardId))
  .then(() => DB.checkEntryValid(t, eventId, cardId))
  .tap(status => DB.addEntry(t, eventId, cardId, status))
