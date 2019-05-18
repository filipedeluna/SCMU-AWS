import uuid from 'uuid/v4';
import * as Boom from 'boom';

import { 
  DBTables,
} from './dbFunctions';

import * as DB from './dbFunctions';

import * as Utils from './utils';
import * as Validate from './validations';

const uuid = require('uuid/v4');
const PIC_FOLDER_USERS = 'pictures/users/';
const PIC_FOLDER_EVENTS = 'pictures/events/';

/*
    GENERAL FUNCTIONS 
*/ 

export const selectAllFromTable = (t, table: DBTables) => 
  DB.checkAllTablesExist(t)
  .then(() => DB.selectAll(t, table))

/*
    USERS 
*/

export const createNewUser = (t, data) => 
  Validate.userCreate(data)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkUserDoesNotExist(t, data.user_email))
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
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getUserById(t, userId))

export const getUserByEmail = (t, userEmail) => 
  Validate.email(userEmail)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getUserByEmail(t, userEmail))

export const getUserPicture = (t, userId) =>
  Validate.id(userId)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getUserPicturebyId(t, userId))
  .then(res => Utils.readPictureFromFile(`${PIC_FOLDER_USERS}${res.user_picture}`))

/*
    STAFF 
*/

export const getStaffByEmail = (t, staffEmail) => 
  Validate.email(staffEmail)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getStaffByEmail(t, staffEmail))

export const getStaffbyId = (t, staffId) => 
  Validate.id(staffId)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getStaffbyId(t, staffId))

export const createNewStaff = (t, data) =>
  Validate.staffCreate(data)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkStaffEmailNotRegistered(t, data.staff_email))
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
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkUserExists(t, userId))
  .then(() => DB.checkCardExists(t, cardId))
  .then(() => DB.addCard(t, cardId, userId))

export const getUserCards = (t, userId) => 
  Validate.id(userId)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkUserExists(t, userId))
  .then(() => DB.getCardsByUserId(t, userId))
  
export const getCardOwner = (t, cardId) =>
  Validate.cardId(cardId)
  .then(() => DB.checkAllTablesExist(t))  
  .then(() => DB.getCardOwnerByCardId(t, cardId))

/*
    TICKETS 
*/

export const addTicketToCard = (t, cardId, eventId) =>
  Validate.cardId(cardId)
  .then(() => Validate.id(eventId))
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkTicketsLeft(t, cardId))
  .then(() => DB.checkCardExists(t, cardId))
  .then(() => DB.checkEventExists(t, cardId))
  .then(() => DB.checkTicketAlreadyBought(t, cardId, eventId))
  .then(event => DB.checkUserOldEnough(t, cardId, event.event_min_age))
  .then(() => DB.addTicket(t, cardId, eventId))

export const getAllTicketsByCardId = (t, cardId) =>
  Validate.cardId(cardId)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkCardExists(t, cardId))
  .then(() => DB.getAllTicketsByCardId(t, cardId))

export const getAllTicketsByEventId = (t, eventId) =>
  Validate.id(eventId)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkEventExists(t, eventId))
  .then(() => DB.getAllTicketsByEventId(t, eventId))

export const useTicket = (t, cardId, eventId) =>
  Validate.cardId(cardId)
  .then(() => Validate.id(eventId))
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkCardExists(t, cardId))
  .then(() => DB.checkEventExists(t, eventId))
  .then(event => DB.checkUserOldEnough(t, cardId, event.event_min_age))
  .then(() => DB.checkEntryValid(t, cardId, eventId))
  .tap(valid => {
    if (valid)
      return DB.setTicketAsUsed(t, cardId, eventId)
  })
  .tap(valid => {
    if (valid)
      return DB.addEntry(t, eventId, cardId, "TRUE")
    else
      return DB.addEntry(t, eventId, cardId, "FALSE")
  })

export const setTicketAsUsed = (t, cardId, eventId) =>
  Validate.cardId(cardId)
  .then(() => Validate.id(eventId))
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkCardExists(t, cardId))
  .then(() => DB.checkEventExists(t, eventId))
  .then(() => DB.setTicketAsUsed(t, cardId, eventId))

/*
    EVENTS 
*/

export const getEventById = (t, eventId) =>
  Validate.id(eventId)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getEventById(t, eventId))

export const createNewEvent = (t, data) => 
  Validate.eventCreate(data)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => uuid())
  .then(uuid => {
    let filename: string = `${uuid}.jpg`;
      
    return DB.addEvent(t, {
      event_name:        data.event_name, 
      event_description: data.event_description, 
      event_date:        data.event_date,
      event_tickets:     data.event_tickets, 
      event_price:       data.event_price, 
      event_min_age:     data.event_min_age,
      event_picture:     filename
    })
    .then(() => Utils.writePictureToFile(`${PIC_FOLDER_EVENTS}${filename}`, data.event_picture))
  })

export const getEventPicture = (t, eventId) =>
  Validate.id(eventId)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getEventPicturebyId(t, eventId))
  .then(res => Utils.readPictureFromFile(`${PIC_FOLDER_EVENTS}${res.event_picture}`))
  
export const getEventTicketsLeft = (t, eventId) =>
  Validate.id(eventId)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkEventExists(t, eventId))
  .then(() => DB.getEventTicketsLeft(t, eventId))

/*
    ENTRIES 
*/

export const getEntriesByEventId = (t, eventId) =>
  Validate.id(eventId)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getEventById(t, eventId))

export const getEntriesByCardId = (t, cardId) =>
  Validate.cardId(cardId)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkCardExists(t, cardId))
  .then(() => DB.getEntriesByCardId(t, cardId))

export const getEntriesByCardAndEventId = (t, eventId, cardId) =>
  Validate.id(eventId)
  .then(() => Validate.cardId(cardId))
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkEventExists(t, eventId))
  .then(() => DB.checkCardExists(t, cardId))
  .then(() => DB.getEntriesByEventAndCardId(t, eventId, cardId))

export const registerEntry = (t, eventId, cardId) =>
  Validate.id(cardId)
  .then(() => Validate.id(eventId))
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkCardExists(t, cardId))
  .then(() => DB.checkEventExists(t, eventId))
  .then(event => DB.checkUserOldEnough(t, cardId, event.event_min_age))
  .then(() => DB.checkEntryValid(t, eventId, cardId))
  .tap(status => DB.addEntry(t, eventId, cardId, status))

/*
    CONTROLLERS 
*/

export const registerController = (t, controllerId, controllerIp) =>
  Validate.controllerId(controllerId)
  .then(() => Validate.ip(controllerIp))
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.registerController(t, controllerId, controllerIp))

/*
    CONNECTIONS 
*/

export const registerConnection = (t, staffId, staffIp, controllerId) =>
  Validate.id(staffId)
  .then(() => Validate.ip(staffIp))
  .then(() => Validate.controllerId(controllerId))
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkStaffExists(t, staffId))
  .then(() => DB.checkControllerExists(t, controllerId))
  .then(() => DB.registerConnection(t, staffId, staffIp, controllerId))
