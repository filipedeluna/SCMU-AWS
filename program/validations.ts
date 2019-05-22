import * as Boom from 'boom';
import * as Joi from '@hapi/joi';

// General
export const id = id =>
  Joi.validate(id, Joi.number().integer().min(0).required())
  .catch(result => checkResult(result, 'Invalid id.'))

export const email = email =>
  Joi.validate(email, Joi.string().email().required())
  .catch(result => checkResult(result, 'Invalid email.'))

 export const ip = ip =>
  Joi.validate(ip, Joi.string().ip({ version: 'ipv4', cidr: 'forbidden' }).required())
  .catch(result => checkResult(result, 'Invalid ip address.'))

// Users
const userCreateSchema = Joi.object().keys({
  userEmail:    Joi.string().email().max(30).required(),
  userName:     Joi.string().min(3).max(30).required(),
  userBirthday: Joi.date().iso().min('1900-01-01').max('now').required(),
  userPicture:  Joi.string().base64({ paddingRequired: false }).required(),
}).unknown(false);

export const userCreate = user =>
  Joi.validate(user, userCreateSchema)
  .catch(result => checkResult(result, 'Invalid data for user creation.'))

// Staff
const staffCreateSchema = Joi.object().keys({
  staffEmail:    Joi.string().email().max(30).required(),
  staffName:     Joi.string().min(3).max(30).required(),
  staffPassword: Joi.string().min(3).max(20).required(),
  staffType:     Joi.number().integer().min(0).max(2).required(),
}).unknown(false);

export const staffCreate = staff =>
  Joi.validate(staff, staffCreateSchema)
  .catch(result => checkResult(result, 'Invalid data for staff creation.'))

// Events
const eventCreateSchema = Joi.object().keys({
  eventName:        Joi.string().min(3).max(40).required(),
  eventDescription: Joi.string().min(0).max(200).required(),
  eventDate:        Joi.date().iso().min('now').required(),
  eventTickets:     Joi.number().integer().min(1).max(999999).required(),
  eventPrice:       Joi.number().min(0).max(999999).required(),
  eventMinAge:      Joi.number().integer().min(0).max(120).required(),
  eventPicture:     Joi.string().base64({ paddingRequired: false }).required(),
}).unknown(false);

export const eventCreate = event =>
  Joi.validate(event, eventCreateSchema)
  .catch(result => checkResult(result, 'Invalid data for event creation.'))

// Cards
export const cardId = cardId =>
  Joi.validate(cardId, Joi.number().integer().min(10000000).max(99999999).required())
  .catch(result => checkResult(result, 'Invalid card id.'))

// Controllers
export const controllerId = cardId =>
Joi.validate(cardId, Joi.number().integer().min(10000).max(99999).required())
.catch(result => checkResult(result, 'Invalid controller id.'))

// Messages
const messageInsertSchema = Joi.object().keys({
  messageType:     Joi.string().max(20).required(),
  messageData:     Joi.object().unknown(true).required(),
}).unknown(false);

export const messageInsert = message =>
  Joi.validate(message, messageInsertSchema)
  .catch(result => checkResult(result, 'Invalid data for message insertion.'))

// Utils
const checkResult = (result, errorMessage) => {
  if (result.error !== null)
    throw Boom.badData(errorMessage, { data: result.details }) 
  }
