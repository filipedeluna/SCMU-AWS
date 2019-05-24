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
  .then(() => DB.checkUserDoesNotExist(t, data.userEmail))
  .then(() => uuid())
  .then(uuid => {
    let filename: string = `${uuid}.jpg`;
      
    return DB.addUser(t, {
      userEmail:    data.userEmail,
      userName:     data.userName,
      userBirthday: data.userBirthday,
      userPicture:  filename,
    })
    .then(() => Utils.writePictureToFile(`${PIC_FOLDER_USERS}${filename}`, data.userPicture))
  })

export const getUserByEmail = (t, userEmail) => 
  Validate.email(userEmail)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getUserByEmail(t, userEmail))

export const getUserPicture = (t, userEmail) =>
  Validate.email(userEmail)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getUserIdByEmail(t, userEmail))
  .then(userId => DB.getUserPicturebyId(t, userId))
  .then(res => Utils.readPictureFromFile(`${PIC_FOLDER_USERS}${res.user_picture}`))

/*
    STAFF 
*/

export const getStaffByEmail = (t, staffEmail) => 
  Validate.email(staffEmail)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getStaffByEmail(t, staffEmail))

export const createNewStaff = (t, data) =>
  Validate.staffCreate(data)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkStaffEmailNotRegistered(t, data.staffEmail))
  .then(() => DB.addStaff(t, {
      staffEmail:    data.staffEmail,
      staffName:     data.staffName,
      staffPassword: data.staffPassword,
      staffType:     data.staffType
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

export const getUserCardsByEmail = (t, userEmail) => 
  Validate.email(userEmail)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getUserIdByEmail(t, userEmail))
  .then(userId => DB.getCardsByUserId(t, userId))
  
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
  .then(event => DB.checkUserOldEnough(t, cardId, event.eventMinAge))
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
  .then(event => DB.checkUserOldEnough(t, cardId, event.eventMinAge))
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
      eventName:        data.eventName, 
      eventDescription: data.eventDescription, 
      eventDate:        data.eventDate,
      eventTickets:     data.eventTickets, 
      eventPrice:       data.eventPrice, 
      eventMinAge:      data.eventMinAge,
      eventPicture:     filename
    })
    .then(() => Utils.writePictureToFile(`${PIC_FOLDER_EVENTS}${filename}`, data.eventPicture))
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
  .then(event => DB.checkUserOldEnough(t, cardId, event.eventMinAge))
  .then(() => DB.checkEntryValid(t, eventId, cardId))
  .tap(status => DB.addEntry(t, eventId, cardId, status))

/*
    CONTROLLERS 
*/

export const registerController = (t, controllerId) =>
  Validate.controllerId(controllerId)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.resetControllerConnections(t, controllerId))
  .then(() => DB.resetMessages(t, controllerId))
  .then(() => DB.registerController(t, controllerId))

/*
    CONNECTIONS 
*/

export const registerConnection = (t, staffId, controllerId) =>
  Validate.id(staffId)
  .then(() => Validate.controllerId(controllerId))
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkStaffExists(t, staffId))
  .then(() => DB.checkControllerExists(t, controllerId))
  .then(() => DB.resetStaffConnections(t, staffId))
  .then(() => DB.resetMessages(t, staffId))
  .then(() => DB.registerConnection(t, staffId, controllerId))

/*
    MESSAGES 
*/

export const getAllMessages = (t, messageType) => {
  if (messageType)
    return selectAllFromTable(t, DBTables.MESSAGES);
  else
    return DB.checkAllTablesExist(t)
    .then(() => DB.getAllMessagesByType(t, messageType));
}

export const getControllerMessages = (t, controllerId, messageType) =>
  Validate.controllerId(controllerId)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkControllerExists(t, controllerId))
  .then(() => messageType 
    ? DB.getUnreadMessagesByType(t, controllerId, messageType)
    : DB.getUnreadMessages(t, controllerId)
  )
export const getStaffMessages = (t, staffEmail, messageType) =>
  Validate.email(staffEmail)
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getStaffIdByEmail(t, staffEmail))
  .then(staffId => messageType 
    ? DB.getUnreadMessagesByType(t, staffId, messageType)
    : DB.getUnreadMessages(t, staffId)
  )

export const insertMessageAsStaff = (t, staffEmail, message) =>
  Validate.email(staffEmail)
  .then(() => Validate.messageInsert(message))
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.getStaffIdByEmail(t, staffEmail))
  .then(staffId =>
    DB.insertMessageAsStaff(t, {
      ...message,
      messageSender: staffId
    })
  )

export const insertMessageAsController = (t, controllerId, message) =>
  Validate.controllerId(controllerId)
  .then(() => Validate.messageInsert(message))
  .then(() => DB.checkAllTablesExist(t))
  .then(() => DB.checkControllerExists(t, controllerId))
  .then(() => DB.insertMessageAsController(t, {
      ...message,
      messageSender: controllerId
    })
  )





